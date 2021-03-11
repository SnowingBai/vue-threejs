<template>
  <div id="lineWraper"></div>
</template>

<script>
import * as THREE from 'three'

import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Line',
  setup () {
    var renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500)
    camera.position.set(0, 0, 100)
    camera.lookAt(0, 0, 0)

    var scene = new THREE.Scene()

    // 线条可用的材质只有：LineBasicMaterial 或 LineDashedMaterial
    var material = new THREE.LineBasicMaterial({ color: 0x0000ff })

    var geometry = new THREE.BufferGeometry()
    var vertices = new Float32Array([
      -10, 0, 0,
      0, 10, 0,
      10, 0, 0
    ])

    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3))

    var line = new THREE.Line(geometry, material)

    scene.add(line)
    renderer.render(scene, camera)
    return {}
  }
})
</script>

<style lang='less' scoped>
</style>
