<template>
  <div id="CityGroupWrap"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'CityGroup',
  setup () {
    let scene, camera, renderer
    let ambientLight, pointLight

    function init () {
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 80000)
      camera.position.set(0, 0, 2000)

      ambientLight = new THREE.AmbientLight(0x404040)
      pointLight = new THREE.PointLight(0xffffff, 0.9)
      scene.add(ambientLight)
      scene.add(pointLight)

      const onProgress = (xhr) => {
        if (xhr.lengthComputable) {
          const percentComplete = (xhr.loaded / xhr.total) * 100
          console.log(percentComplete + '% download')
        }
      }

      const onError = () => {
        console.log('error')
      }

      // const lineMaterial = new THREE.LineBasicMaterial({
      //   color: 0x4da1f6,
      //   transparent: true,
      //   opacity: 0.2,
      //   linewidth: 4,
      //   depthFunc: THREE.AlwaysDepth
      // })

      const texture = new THREE.TextureLoader().load('textures/building/building_top.png')

      const loader = new FBXLoader()
      loader.load('models/city_group.fbx', (fbx) => {
        fbx.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.name !== '平面') {
              // child.material = lineMaterial
              child.material.map = texture
              child.material.reflectivity = 0.9
            }

            if (child.name === '平面') {
              child.material.visible = false
            }
          }
        })
        fbx.position.set(0, 1050, 0)
        fbx.rotation.set(Math.PI * 0.25, 0, 0)
        fbx.scale.set(0.26, 0.26, 0.26)
        scene.add(fbx)
      }, onProgress, onError)

      renderer = new THREE.WebGLRenderer({
        antialias: true
        // alpha: true
      })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.gammaInput = true
      renderer.gammaOutput = true
      const container = document.getElementById('CityGroupWrap')
      container.appendChild(renderer.domElement)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.addEventListener('change', render)

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
