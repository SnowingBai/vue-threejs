<template>
  <div id="carModelsWrapper"></div>
</template>

<script>
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'CarModels',
  setup () {
    let scene, camera, renderer, controls
    const woods = [
      '立方体',
      '立方体_3_2',
      '立方体_1_2',
      '立方体_2',
      '立方体_4',
      '圆柱体_2',
      '圆柱体'
    ]

    const metals = [
      '立方体_5_0',
      '立方体_5_1',
      '立方体_5_2',
      '立方体_5_3',
      '立方体_5_4',
      '立方体_5_5',
      '扫描'
    ]

    const metals1 = [
      '立方体_3',
      '扫描_1',
      '扫描_2',
      '挤压_1',
      '立方体_1'
    ]

    function init () {
      scene = new THREE.Scene()

      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 8000)
      camera.position.set(-100, 100, 200)

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
      hemiLight.position.set(0, 1, 0)
      scene.add(hemiLight)

      const dirLight = new THREE.DirectionalLight(0xffffff)
      dirLight.position.set(0, 1, 0)
      scene.add(dirLight)

      const material = new THREE.MeshPhongMaterial({ color: 0xD4AF37 })
      const texture = new THREE.TextureLoader().load('/textures/crate.gif')
      const metalMeshTexture = new THREE.TextureLoader().load('/textures/metal.jpg')
      const metalMeshTexture1 = new THREE.TextureLoader().load('/textures/metal1.jpg')
      const metalMeshTexture2 = new THREE.TextureLoader().load('/textures/metal2.jpg')
      const wheelTexture = new THREE.TextureLoader().load('/textures/wheel.jpg')

      const loader = new FBXLoader()
      loader.load('models/car.fbx', function (object) {
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            console.log(child.name)

            if (woods.includes(child.name)) {
              child.material.map = texture
            } else if (child.name === '货斗') {
              child.material.map = metalMeshTexture
            } else if (metals.includes(child.name)) {
              child.material.map = metalMeshTexture1
            } else if (child.name === '圆柱体_3') {
              child.material.map = wheelTexture
            } else if (metals1.includes(child.name)) {
              child.material.map = metalMeshTexture2
            } else {
              child.material = material
            }
          }
        })
        scene.add(object)
      })

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('carModelsWrapper')
      container.appendChild(renderer.domElement)

      controls = new OrbitControls(camera, renderer.domElement)
      controls.target.set(0, 12, 0)
      controls.update()

      window.addEventListener('resize', onWindowResize)
    }

    function render () {
      renderer.render(scene, camera)
    }

    function onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    function animate () {
      requestAnimationFrame(animate)
      render()
    }

    onMounted(() => {
      init()
      animate()
    })
    return {}
  }
})
</script>
