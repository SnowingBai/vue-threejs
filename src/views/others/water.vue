<template>
  <div id="WaterWrap"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import { Water } from 'three/examples/jsm/objects/Water2'

import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'Water',
  setup () {
    let scene, camera, renderer, water

    function init () {
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200)
      camera.position.set(0, 25, 0)
      camera.lookAt(scene.position)

      const groundGeometry = new THREE.PlaneGeometry(20, 20, 10, 10)
      const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc })
      const ground = new THREE.Mesh(groundGeometry, groundMaterial)
      ground.rotation.x = Math.PI * -0.5
      scene.add(ground)

      const textureLoader = new THREE.TextureLoader()
      textureLoader.load('textures/water/FloorsCheckerboard_S_Diffuse.jpg', function (map) {
        map.wrapS = THREE.RepeatWrapping
        map.wrapT = THREE.RepeatWrapping
        map.anisotropy = 16
        map.repeat.set(4, 4)
        groundMaterial.map = map
        groundMaterial.needsUpdate = true
      })

      // water
      const waterGeometry = new THREE.PlaneGeometry(20, 20)
      const flowMap = textureLoader.load('textures/water/Water_1_M_Flow.jpg')

      water = new Water(waterGeometry, {
        scale: 2,
        textureWidth: 1024,
        textureHeight: 1024,
        flowMap: flowMap
      })

      water.position.y = 1
      water.rotation.x = Math.PI * -0.5
      scene.add(water)

      // flow map helper
      const helperGeometry = new THREE.PlaneGeometry(20, 20)
      const helperMaterial = new THREE.MeshBasicMaterial({ map: flowMap })
      const helper = new THREE.Mesh(helperGeometry, helperMaterial)
      helper.position.y = 1.01
      helper.rotation.x = Math.PI * -0.5
      helper.visible = false
      scene.add(helper)

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('WaterWrap')
      container.appendChild(renderer.domElement)

      const gui = new GUI()
      gui.add(helper, 'visible').name('Show Flow Map')
      gui.open()

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
