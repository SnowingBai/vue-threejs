<template>
  <div id="CityModelWrap"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'CityModel',
  setup () {
    let scene, camera, renderer, controls

    function init () {
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0xcccccc)
      // scene.fog = new THREE.FogExp2(0xcccccc, 0.002)

      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000)
      camera.position.set(400, 200, 0)
      scene.add(camera)

      const geometry = new THREE.BoxGeometry(1, 1, 1)
      geometry.translate(0, 0.5, 0)
      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        flatShading: true
      })

      for (let i = 0; i < 500; i++) {
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.x = Math.random() * 1600 - 800
        mesh.position.y = 0
        mesh.position.z = Math.random() * 1600 - 800
        mesh.scale.x = 20
        mesh.scale.y = Math.random() * 80 + 10
        mesh.scale.z = 20
        mesh.updateMatrix()
        mesh.matrixAutoUpdate = false
        scene.add(mesh)
      }

      const dirLight1 = new THREE.DirectionalLight(0xffffff)
      dirLight1.position.set(1, 1, 1)
      scene.add(dirLight1)

      const dirLight2 = new THREE.DirectionalLight(0x002288)
      dirLight2.position.set(-1, -1, -1)
      scene.add(dirLight2)

      const ambientLight = new THREE.AmbientLight(0x222222)
      scene.add(ambientLight)

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('CityModelWrap')
      container.appendChild(renderer.domElement)

      controls = new OrbitControls(camera, renderer.domElement)
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
      controls.update()
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
