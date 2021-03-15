<template>
  <div id="CameraWraper"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'CameraGroup',
  setup () {
    const SCREEN_WIDTH = window.innerWidth
    const SCREEN_HEIGHT = window.innerHeight
    const aspect = SCREEN_WIDTH / SCREEN_HEIGHT
    // const frustumSize = 600

    let scene, camera, mesh, renderer
    let cameraRig
    // let cameraOrtho, cameraOrthoHelper
    let cameraPerspective, cameraPerspectiveHelper

    function init () {
      const container = document.getElementById('CameraWraper')
      scene = new THREE.Scene()

      // 透视相机 -1
      camera = new THREE.PerspectiveCamera(50, aspect, 1, 10000)
      camera.position.z = 2500

      // 透视相机 -2
      cameraPerspective = new THREE.PerspectiveCamera(50, aspect * 0.5, 150, 1000)
      cameraPerspectiveHelper = new THREE.CameraHelper(cameraPerspective)
      scene.add(cameraPerspectiveHelper)

      // 圆锥相机
      // cameraOrtho = new THREE.OrthographicCamera(0.5 * frustumSize * aspect / -2, 0.5 * frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 150, 1000)
      // cameraOrthoHelper = new THREE.CameraHelper(cameraOrtho)
      // console.log(cameraOrthoHelper)
      // scene.add(cameraOrthoHelper)

      // 透视相机
      // const activeCamera = cameraPerspective
      // activeHelper = cameraPerspectiveHelper

      // 相机运动轨迹
      // cameraOrtho.rotation.y = Math.PI
      // cameraPerspective.rotation.y = Math.PI

      // 相机组合？？ Group？？
      cameraRig = new THREE.Group()
      cameraRig.add(cameraPerspective)
      // cameraRig.add(cameraOrtho)

      scene.add(cameraRig)

      // 白色球形
      mesh = new THREE.Mesh(
        new THREE.SphereGeometry(150, 16, 16), // 球形几何
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }) // 材料
      )
      scene.add(mesh)

      // 锥形几何体
      // const geometry = new THREE.BufferGeometry()
      // const vertices = []

      // for (let i = 0; i < 10000; i++) {
      //   // x y z
      //   vertices.push(THREE.MathUtils.randFloatSpread(2000))
      //   vertices.push(THREE.MathUtils.randFloatSpread(2000))
      //   vertices.push(THREE.MathUtils.randFloatSpread(2000))
      // }

      // geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

      // 粒子
      // const particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x888888 }))
      // scene.add(particles)

      // 平滑渲染（抗锯齿）
      renderer = new THREE.WebGLRenderer({ antialias: true })
      // 设置设备像素比例
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
      container.appendChild(renderer.domElement)

      renderer.autoClear = false
    }

    function animate () {
      requestAnimationFrame(animate)
      render()
    }

    onMounted(() => {
      init()
      animate()
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.addEventListener('change', render)
    })

    function render () {
      // const r = Date.now() * 0.0005

      // mesh.position.x = 700 * Math.cos(r)
      // mesh.position.y = 700 * Math.sin(r)
      // mesh.position.z = 700 * Math.sin(r)

      // cameraRig.lookAt(mesh.position)
      // renderer.clear()
      renderer.setViewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
      renderer.render(scene, camera)
    }

    return {}
  }
})
</script>

<style lang='less' scoped>
</style>
