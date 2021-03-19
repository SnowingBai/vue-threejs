<template>
  <div id="RectAreaLifght"></div>
</template>

<script>
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'RectAreaLifght',
  setup () {
    let scene, camera, renderer

    function init () {
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / innerHeight, 1, 8000)
      camera.position.set(0, 0, 0)

      renderer = new THREE.WebGLRenderer({})
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('RectAreaLifght')
      container.appendChild(renderer.domElement)
    }

    function render () {
      renderer.render(scene, camera)
    }

    onMounted(() => {
      init()
      render()
    })
    return {}
  }
})
</script>

<style lang='less' scoped>
</style>
