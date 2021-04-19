<template>
  <div id="CityWrap"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'
// import { LuminosityHighPassShader } from 'three/examples/jsm/shaders/LuminosityHighPassShader'
import Stats from 'three/examples/jsm/libs/stats.module'

import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'City',
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

      const loader = new OBJLoader()
      loader.load('models/city.obj', (object) => {
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = lineMaterial
          }
        })
        object.position.set(0, -500, 0)
        object.rotation.set(Math.PI * 0.12, Math.PI * 0.65, 0)
        scene.add(object)
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

      window.addEventListener('resize', onWindowResize)

      // 初始化renderPass
      const renderScene = new RenderPass(scene, camera)

      // 初始化bloomPass
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
      )

      bloomPass.threshold = 0.36
      bloomPass.strength = 0.6
      bloomPass.radius = 0

      // effectCopy
      const effectCopy = new ShaderPass(CopyShader)
      effectCopy.renderToScreen = true

      // 初始化 composer
      const composer = new EffectComposer(renderer)
      console.log(composer)
      // 模版缓冲（stencil buffer） https://blog.csdn.net/silangquan/article/details/46608915
      composer.renderTarget1.stencilBuffer = true
      composer.renderTarget2.stencilBuffer = true
      composer.setSize(window.innerWidth, window.innerHeight)
      composer.addPass(renderScene)
      composer.addPass(bloomPass)
      composer.addPass(effectCopy)
    }

    function render () {
      renderer.render(scene, camera)
    }

    function animate () {
      requestAnimationFrame(animate)
      stats.update()
      // renderer.clear()
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
