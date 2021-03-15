<template>
  <div id="CubeWrapper"></div>
</template>

<script>
import * as THREE from 'three'

import { defineComponent } from 'vue'
export default defineComponent({
  name: 'CubeWrapper',
  setup () {
    function init () {
      const scene = new THREE.Scene()

      // create cube camera
      const cubeCamera = new THREE.CubeCamera(1, 100000, 128)
      scene.add(cubeCamera)

      // create car
      const chromeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        envMap: cubeCamera.renderTarget // 生成的立方体纹理，可赋值给其他材质
      })
      const car = new THREE.Mesh(carGeometry, chromeMaterial)
      scene.add(car)

      car.setVisible(false)
      cubeCamera.position.copy(car.position)
      cubeCamera.update(renderer, scene)

      car.setVisible(true)
      renderer.render(scene, camera)
    }

    init()
    return {}
  }
})
</script>

<style lang='less' scoped>
</style>
