<template>
  <div id="FactoryWrap"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'Factory',
  setup () {
    let scene, camera, renderer
    let model
    let selectObject, intersects

    function init () {
      scene = new THREE.Scene()
      // camera
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
      camera.position.set(0, 0, 30)

      const ambientLight = new THREE.AmbientLight(0xffffff)
      const pointLight = new THREE.PointLight(0xffffff, 1)
      scene.add(ambientLight)
      scene.add(pointLight)

      const loader = new GLTFLoader()
      loader.load('models/FactoryComplex.glb', (gltf) => {
        model = gltf.scene
        model.position.y = -5
        scene.add(model)
      })

      renderer = new THREE.WebGLRenderer({
        antialias: true
      })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('FactoryWrap')
      container.appendChild(renderer.domElement)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.addEventListener('change', render)

      window.addEventListener('resize', onWindowResize)
      window.addEventListener('dblclick', onMouseDblclick, false)
    }

    function render () {
      renderer.render(scene, camera)
    }

    function animate () {
      requestAnimationFrame(animate)
      renderer.clear()
      render()
    }

    function onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    function onMouseDblclick (event) {
      // 获取 raycaster 和所有模型相交的数组，其中的元素按照距离排序
      intersects = getIntersects(event)
      console.log(intersects)
      if (intersects.length !== 0 && intersects[0].object instanceof THREE.Mesh) {
        selectObject = intersects[0].object
        console.log(selectObject.name)
      } else {
        console.log('未选中 Mesh')
      }
    }

    // 获取与射线相交的对象数组
    function getIntersects (event) {
      event.preventDefault()

      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      // 通过鼠标点击的位置和当前相机的矩阵计算出射线位置
      raycaster.setFromCamera(mouse, camera)

      intersects = raycaster.intersectObjects(scene.children)
      return intersects
    }

    onMounted(() => {
      init()
      animate()
    })
    return {}
  }
})
</script>
