<template>
  <div id="DriveWrap"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
// 该通道在指定的场景和相机的基础上渲染一个新场景
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
// 高亮虚化通道
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'Drive',
  setup () {
    let scene, camera, renderer
    let composer, mixer, clock

    function init () {
      clock = new THREE.Clock()

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.toneMapping = THREE.ReinhardToneMapping
      const container = document.getElementById('DriveWrap')
      container.appendChild(renderer.domElement)

      scene = new THREE.Scene()
      scene.background = new THREE.Color(0x000000)

      camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100)
      camera.position.set(-5, 2.5, -3.5)
      scene.add(camera)

      scene.add(new THREE.AmbientLight(0x404040))

      const pointLight = new THREE.PointLight(0xffffff, 1)
      camera.add(pointLight)

      const renderScene = new RenderPass(scene, camera)
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
      bloomPass.threshold = 0
      bloomPass.strength = 1.5
      bloomPass.radius = 0

      composer = new EffectComposer(renderer)
      composer.addPass(renderScene)
      composer.addPass(bloomPass)

      new GLTFLoader().load('models/PrimaryIonDrive.glb', (gltf) => {
        const model = gltf.scene
        scene.add(model)

        mixer = new THREE.AnimationMixer(model)
        const clip = gltf.animations[0]
        mixer.clipAction(clip.optimize()).play()
        animate()
      })

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.maxPolarAngle = Math.PI * 0.5
      controls.minDistance = 1
      controls.maxDistance = 10

      window.addEventListener('resize', onWindowResize)
    }

    function animate () {
      requestAnimationFrame(animate)
      const delta = clock.getDelta()
      mixer.update(delta)
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
    })
    return {}
  }
})
</script>
