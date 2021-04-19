<template>
  <div id="BuildingWrap"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Stats from 'three/examples/jsm/libs/stats.module'

import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'Building',
  setup () {
    let scene, camera, renderer, stats
    let ambientLight, pointLight

    function init () {
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0x001228)
      // camera
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
      camera.position.set(0, 0, 5000)

      ambientLight = new THREE.AmbientLight(0x404040)
      pointLight = new THREE.PointLight(0xffffff, 0.6)
      scene.add(ambientLight)
      scene.add(pointLight)

      const onProgress = (xhr) => {
        if (xhr.lengthComputable) {
          const percentComplete = (xhr.loaded / xhr.total)
          console.log(percentComplete + '% download')
        }
      }

      const onError = () => {
        console.log('error')
      }

      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x4da1f6,
        transparent: true,
        opacity: 0.2,
        linewidth: 4,
        depthFunc: THREE.AlwaysDepth
      })

      const loader = new GLTFLoader()
      loader.load('models/building.gltf', (gltf) => {
        const elem = gltf.scene
        elem.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = lineMaterial
          }
        })
        elem.position.set(0, -500, 0)
        elem.rotation.set(Math.PI * 0.12, Math.PI * 0.65, 0)
        scene.add(elem)
      }, onProgress, onError)

      renderer = new THREE.WebGLRenderer({
        antialias: true
      })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('BuildingWrap')
      container.appendChild(renderer.domElement)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.addEventListener('change', render)

      stats = new Stats()
      container.appendChild(stats.dom)

      window.addEventListener('resize', onWindowResize)
    }

    function render () {
      renderer.render(scene, camera)
    }

    function animate () {
      requestAnimationFrame(animate)
      stats.update()
      renderer.clear()
      render()
      stats.update()
    }

    function onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    onMounted(() => {
      init()
      animate()
    })
    return {}
  }
})
</script>
