<template>
  <div id="TextureBox"></div>
</template>

<script>
import * as THREE from 'three'

import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'TextureBox',
  setup () {
    let scene, camera, renderer, mesh

    function init () {
      scene = new THREE.Scene()

      camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
      camera.position.z = 400

      const texture = new THREE.TextureLoader().load('/textures/crate.gif')
      const geometry = new THREE.BoxGeometry(200, 200, 200)
      const material = new THREE.MeshBasicMaterial({ map: texture })

      mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('TextureBox')
      container.appendChild(renderer.domElement)

      window.addEventListener('resize', onWindowResize)
    }

    function onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    function render () {
      mesh.rotation.x += 0.005
      mesh.rotation.y += 0.01
      renderer.render(scene, camera)
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

<style lang='less' scoped>
</style>
