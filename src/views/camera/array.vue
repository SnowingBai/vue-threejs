<template>
  <div id="cameraArray"></div>
</template>

<script>
import * as THREE from 'three'

import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'CameraArray',
  setup () {
    let camera, scene, renderer
    let mesh
    const AMOUNT = 3

    function init () {
      const SCREEN_WIDTH = window.innerWidth
      const SCREEN_HEIGHT = window.innerHeight
      const aspect = SCREEN_WIDTH / SCREEN_HEIGHT
      const WIDTH = (SCREEN_WIDTH / AMOUNT) * window.devicePixelRatio
      const HEIGHT = (SCREEN_HEIGHT / AMOUNT) * window.devicePixelRatio
      const container = document.getElementById('cameraArray')

      scene = new THREE.Scene()
      scene.add(new THREE.AmbientLight(0x222244))

      const cameras = []

      for (let y = 0; y < AMOUNT; y++) {
        for (let x = 0; x < AMOUNT; x++) {
          const subCamera = new THREE.PerspectiveCamera(40, aspect, 0.1, 10)
          subCamera.viewport = new THREE.Vector4(Math.floor(x * WIDTH), Math.floor(y * HEIGHT), Math.ceil(WIDTH), Math.ceil(HEIGHT))
          subCamera.position.x = (x / AMOUNT) - 0.5
          subCamera.position.y = 0.5 - (y / AMOUNT)
          subCamera.position.z = 1.5
          subCamera.position.multiplyScalar(2)
          subCamera.lookAt(0, 0, 0)
          subCamera.updateMatrixWorld()
          cameras.push(subCamera)
        }
      }

      // 摄像机阵列
      camera = new THREE.ArrayCamera(cameras)
      camera.position.z = 3

      const light = new THREE.DirectionalLight()
      light.position.set(0.5, 0.5, 1)
      light.castShadow = true
      light.shadow.camera.zoom = 4
      scene.add(light)

      // const geometryBackground = new THREE.PlaneGeometry(100, 100)
      // const materialBackground = new THREE.MeshPhongMaterial({ color: 0x000066 })
      // const background = new THREE.Mesh(geometryBackground, materialBackground)
      // background.receiveShadow = true
      // background.position.set(0, 0, -1)
      // scene.add(background)

      const geometryCylinder = new THREE.CylinderGeometry(0.5, 0.5, 1, 32)
      const materialCylinder = new THREE.MeshPhongMaterial({ color: 0xff0000 })
      mesh = new THREE.Mesh(geometryCylinder, materialCylinder)
      mesh.castShadow = true
      mesh.receiveShadow = true
      scene.add(mesh)

      renderer = new THREE.WebGLRenderer()
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
      renderer.shadowMap.enabled = true
      container.appendChild(renderer.domElement)
    }

    function animate () {
      mesh.rotation.x += 0.005
      mesh.rotation.y += 0.01

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    onMounted(() => {
      init()
      animate()
    })
    return {}
  }
})
</script>
