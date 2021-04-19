<template>
  <div id="CityWrap"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import Stats from 'three/examples/jsm/libs/stats.module'

import { defineComponent, onMounted, onUnmounted } from 'vue'

export default defineComponent({
  name: 'City',
  setup () {
    let scene, camera, renderer, stats
    let ambientLight, pointLight
    let composer

    function init () {
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0x001228)
      // camera
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
      camera.position.set(0, 0, 5000)
      scene.add(camera)

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
      loader.load('models/city.gltf', (gltf) => {
        const elem = gltf.scene
        elem.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = lineMaterial
          }
        })
        elem.scale.set(0.29, 0.29, 0.29)
        elem.position.set(0, 970, 0)
        elem.rotation.set(Math.PI * 0.4, -Math.PI * 0.5, 0)
        scene.add(elem)
      }, onProgress, onError)

      renderer = new THREE.WebGLRenderer({
        antialias: true
      })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('CityWrap')
      container.appendChild(renderer.domElement)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.addEventListener('change', render)

      stats = new Stats()
      container.appendChild(stats.dom)

      const renderScene = new RenderPass(scene, camera)
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
      bloomPass.threshold = 0
      bloomPass.strength = 0.2
      bloomPass.radius = 0

      composer = new EffectComposer(renderer)
      composer.addPass(renderScene)
      composer.addPass(bloomPass)

      window.addEventListener('resize', onWindowResize)
    }

    function render () {
      renderer.render(scene, camera)
    }

    function animate () {
      requestAnimationFrame(animate)
      stats.update()
      composer.render()
    }

    function onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      composer.setSize(window.innerWidth, window.innerHeight)
    }

    onMounted(() => {
      init()
      animate()

      const gl = renderer.domElement.getContext('CityWrap')
      // gl && gl.getExtension('WEBGL_lose_context').loseContext()
      console.log(gl)
      // console.log(gl.getExtension('WEBGL_lose_context'))
    })

    onUnmounted(() => {
      const gl = renderer.domElement.getContext('webgl')
      gl && gl.getExtension('WEBGL_lose_context').loseContext()
    })
    return {}
  }
})
</script>
