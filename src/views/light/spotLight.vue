<template>
  <div id="SpotLight"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'

import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'SpotLight',
  setup () {
    let scene, camera, renderer
    let spotLight, lightHelper, shadowCameraHelper
    let gui

    function init () {
      scene = new THREE.Scene()

      camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000)
      camera.position.set(160, 40, 10)

      // light
      // 环境光
      const ambient = new THREE.AmbientLight(0xffffff, 0.1)
      scene.add(ambient)

      // 聚光灯
      spotLight = new THREE.SpotLight(0xffffff, 1)
      spotLight.position.set(15, 40, 35) // 光源位置
      spotLight.angle = Math.PI / 4 // 光线散射角度，默认 Math.PI / 2
      spotLight.penumbra = 0.1 // 聚光锥半影衰减百分比
      spotLight.decay = 2 // 沿着光照距离的衰减量 设置为 2 将实现现实世界的光衰减
      spotLight.distance = 200 // 如果非零，光照强度会从最大值当前灯光位置按照距离线性衰减到0
      spotLight.power = 2 // 光功率，表示以“流明”为单位的光功率，默认 Math.PI

      // 聚光灯 阴影
      spotLight.castShadow = true // 投射阴影
      spotLight.shadow.mapSize.width = 512 // 一个 Vector2 定义阴影贴图的宽、高
      spotLight.shadow.mapSize.height = 512
      spotLight.shadow.camera.near = 10 // 近剪切面
      spotLight.shadow.camera.far = 200 // 远剪切面
      scene.add(spotLight)

      // 光线辅助
      lightHelper = new THREE.SpotLightHelper(spotLight)
      scene.add(lightHelper)

      // 阴影辅助
      shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
      scene.add(shadowCameraHelper)

      // 平面
      let geometry = new THREE.PlaneGeometry(2000, 2000)
      let material = new THREE.MeshPhongMaterial({
        color: 0x808080,
        dithering: true
      })

      let mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(0, -1, 0)
      mesh.rotation.x = -Math.PI * 0.5
      // 接收阴影
      mesh.receiveShadow = true
      scene.add(mesh)

      // 圆柱体
      geometry = new THREE.CylinderGeometry(5, 5, 2, 32, 1, false)
      material = new THREE.MeshPhongMaterial({ color: 0x4080ff, dithering: true })
      mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(0, 5, 0)
      // 投射阴影
      mesh.castShadow = true
      scene.add(mesh)

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      // shadow map??
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      renderer.outputEncoding = THREE.sRGBEncoding

      const container = document.getElementById('SpotLight')
      container.appendChild(renderer.domElement)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.addEventListener('change', render)

      window.addEventListener('resize', onWindowResize)
    }

    function render () {
      lightHelper.update()
      shadowCameraHelper.update()
      renderer.render(scene, camera)
    }

    function onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    function buildGui () {
      gui = new GUI()

      const params = {
        'light color': spotLight.color.getHex(),
        intensity: spotLight.intensity,
        distance: spotLight.distance,
        angle: spotLight.angle,
        penumbra: spotLight.penumbra,
        decay: spotLight.decay,
        power: spotLight.power
      }

      gui.addColor(params, 'light color').onChange((val) => {
        spotLight.color.setHex(val)
        render()
      })

      gui.add(params, 'intensity', 0, 2).onChange((val) => {
        spotLight.intensity = val
        render()
      })

      gui.add(params, 'distance', 50, 200).onChange((val) => {
        spotLight.distance = val
        render()
      })

      gui.add(params, 'angle', 0, Math.PI / 3).onChange((val) => {
        spotLight.angle = val
        render()
      })

      gui.add(params, 'penumbra', 0, 1).onChange((val) => {
        spotLight.penumbra = val
        render()
      })

      gui.add(params, 'decay', 1, 2).onChange((val) => {
        spotLight.decay = val
        render()
      })

      gui.add(params, 'power', 0, 4).onChange((val) => {
        /**
         * .power: Float
         * 光功率 修改该值会导致强度改变
         * power = intensity * 4π
         */
        spotLight.power = val * Math.PI
        render()
      })

      gui.open()
    }

    onMounted(() => {
      init()
      render()
      buildGui()
    })
    return {}
  }
})
</script>

<style lang='less' scoped>
</style>
