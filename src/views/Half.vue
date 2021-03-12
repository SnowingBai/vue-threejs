<template>
  <div id="halfWraper"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'Half',
  setup () {
    const SCREEN_WIDTH = window.innerWidth
    const SCREEN_HEIGHT = window.innerWidth
    const aspect = SCREEN_WIDTH / SCREEN_HEIGHT
    // 三维向量
    const clipPlanes = [
      new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
      new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
      new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)
    ]

    let scene, camera, renderer

    function init () {
      const container = document.getElementById('halfWraper')
      scene = new THREE.Scene()

      camera = new THREE.PerspectiveCamera(50, aspect, 1, 10000)
      camera.position.z = 2500

      // 同心球体
      const group = new THREE.Group()
      for (let i = 1; i <= 10; i++) {
        const geometry = new THREE.SphereGeometry(50 * i, 30, 30)
        const material = new THREE.MeshLambertMaterial({
          color: new THREE.Color().setHSL(Math.random(), 0.5, 0.5),
          side: THREE.DoubleSide,
          clippingPlanes: clipPlanes,
          clipIntersection: true
        })

        group.add(new THREE.Mesh(geometry, material))
      }

      scene.add(group)

      // light
      const light = new THREE.HemisphereLight(0xffffff, 0x080808, 1.5)
      light.position.z = 2500
      scene.add(light)

      // 平滑渲染（抗锯齿）
      renderer = new THREE.WebGLRenderer({ antialias: true })
      // 设置设备像素比例
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
      renderer.localClippingEnabled = true
      container.appendChild(renderer.domElement)
    }

    onMounted(() => {
      init()
      render()
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.addEventListener('change', render)
    })

    function render () {
      renderer.setViewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
      renderer.render(scene, camera)
    }

    return {}
  }
})
</script>

<style lang='less' scoped>
</style>
