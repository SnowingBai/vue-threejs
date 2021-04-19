<template>
  <div id="MoveLineWrap"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'MoveLine',
  setup () {
    let scene, camera, renderer
    let mixer, clock, mesh

    function init () {
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(45, window.innerWidth, window.innerHeight, 1, 10000)
      camera.position.set(1, 1, 1)

      // 创建一个模型，用于沿着三维曲线运动
      const box = new THREE.BoxGeometry(5, 5, 5)
      const material = new THREE.MeshLambertMaterial({
        color: 0x0000ff
      })
      mesh = new THREE.Mesh(box, material)
      scene.add(mesh)
      mesh.position.set(-10, -50, -50)

      // 创建 3D 曲线
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, -50, -50),
        new THREE.Vector3(10, 0, 0),
        new THREE.Vector3(8, 50, 50),
        new THREE.Vector3(-5, 0, 100)
      ])

      const points = curve.getPoints(100)
      console.log(points)

      const geometry = new THREE.BufferGeometry()
      geometry.vertices = points

      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x4488ff
      })
      const line = new THREE.Line(geometry, lineMaterial)
      scene.add(line)

      // 声明数组用于存储时间序列
      const arr = []
      for (let i = 0; i < 101; i++) {
        arr.push(i)
      }
      // 创建一个时间序列
      const times = new Float32Array(arr)
      const posArr = []
      points.forEach(elem => {
        posArr.push(elem.x, elem.y, elem.z)
      })
      // 创建一个和时间序列相对应的坐标系列
      const values = new Float32Array(posArr)
      // 创建一个帧动画的关键帧数据，曲线上的位置序列对应一个时间序列
      const posTrack = new THREE.KeyframeTrack('.position', times, values)
      const duration = 101
      const clip = new THREE.AnimationClip('default', duration, [posTrack])
      mixer = new THREE.AnimationMixer(mesh)
      const AnimationAction = mixer.clipAction(clip)
      AnimationAction.timeScale = 20
      AnimationAction.play()

      clock = new THREE.Clock()

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('MoveLineWrap')
      container.appendChild(renderer.domElement)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.addEventListener('change', render)

      window.addEventListener('resize', onWindowResize)
    }

    function render () {
      renderer.render(scene, camera)
    }

    function onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    function animate () {
      requestAnimationFrame(animate)
      render()
      mixer.update(clock.getDelta())
    }

    onMounted(() => {
      init()
      animate()
    })
    return {}
  }
})
</script>
