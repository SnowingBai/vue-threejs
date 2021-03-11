<template>
  <div id="activeLineWraper"></div>
</template>

<script>
import * as THREE from 'three'

import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ActiveLine',
  setup () {
    var MAX_POINTS = 500
    var scene = new THREE.Scene()

    var geometry = new THREE.BufferGeometry()
    var positions = new Float32Array(MAX_POINTS * 3)
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))

    // draw range
    var drawCount = 2
    geometry.setDrawRange(0, drawCount)

    var material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 3 })

    var line = new THREE.Line(geometry, material)
    scene.add(line)

    // var positions = line.geometry.attributes.position.array
    // var x, y, z, index = 0

    // for (let i = 0; i < MAX_POINTS; i++) {
    //   positions[index++] = x
    //   positions[index++] = y
    //   positions[index++] = z

    //   x += (Math.random() - 0.5) * 30
    //   y += (Math.random() - 0.5) * 30
    //   z += (Math.random() - 0.5) * 30
    // }

    return {}
  }
})
</script>

<style lang='less' scoped>
</style>
