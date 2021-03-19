<template>
  <div id="SphereGeometryWrap"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'SphereGeometry',
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
      const container = document.getElementById('SphereGeometryWrap')
      scene = new THREE.Scene()

      camera = new THREE.PerspectiveCamera(50, aspect, 1, 10000)
      camera.position.z = 2500

      // 同心球体
      const group = new THREE.Group()
      for (let i = 1; i <= 10; i++) {
        // 白色球体
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(50 * i, 16, 16, 0, Math.PI / 2, 0, Math.PI),
          new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            clippingPlanes: clipPlanes,
            clipIntersection: true
          })
        )

        // 绿色球体
        const mesh2 = new THREE.Mesh(
          new THREE.SphereGeometry(50 * i, 16, 16, Math.PI / 2, Math.PI / 2, 0, Math.PI),
          new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            side: THREE.DoubleSide,
            // clippingPlanes: clipPlanes,
            clipIntersection: true
          })
        )
        mesh.add(mesh2)

        // 粉色球体
        const mesh3 = new THREE.Mesh(
          new THREE.SphereGeometry(50 * i, 16, 16, Math.PI, Math.PI / 2, 0, Math.PI),
          new THREE.MeshBasicMaterial({
            color: 0xfa7c7c,
            side: THREE.DoubleSide,
            // clippingPlanes: clipPlanes,
            clipIntersection: true
          })
        )
        mesh.add(mesh3)

        // 黄色球体
        const mesh4 = new THREE.Mesh(
          new THREE.SphereGeometry(50 * i, 16, 16, -Math.PI / 2, Math.PI / 2, 0, Math.PI),
          new THREE.MeshBasicMaterial({
            color: 0xf2e657,
            side: THREE.DoubleSide,
            // clippingPlanes: clipPlanes,
            clipIntersection: true
          })
        )
        mesh.add(mesh4)
        group.add(mesh)
      }

      scene.add(group)

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
