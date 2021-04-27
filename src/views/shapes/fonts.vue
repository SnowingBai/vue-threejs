<template>
  <div id="FontsWrap"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'Fonts',
  setup () {
    let scene, camera, renderer

    function init () {
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0xf0f0f0)

      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
      camera.position.set(0, -400, 600)

      const loader = new THREE.FontLoader()
      loader.load('fonts/helvetiker_regular.json', font => {
        const color = new THREE.Color(0x006699)
        // dark material
        const matDark = new THREE.LineBasicMaterial({
          color,
          side: THREE.DoubleSide
        })

        // light material
        const matLite = new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: 0.4,
          side: THREE.DoubleSide
        })

        const message = 'Three.js\nSimple test.'
        // generateShapes 创建一个 Shapes 数组，表示使用字体的文本 属性：text -- 文本字符串 size -- Shapes 缩放大小
        const shapes = font.generateShapes(message, 80)
        // ShapeGeometry 形状缓冲几何体
        const geometry = new THREE.ShapeGeometry(shapes)
        // 更新边界盒子
        geometry.computeBoundingBox()
        console.log(geometry)
        // 居中
        const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)
        // 移动几何体
        geometry.translate(xMid, 0, 0)

        const text = new THREE.Mesh(geometry, matLite)
        text.position.z = -150
        scene.add(text)

        // holes shapes
        const holeShapes = []
        for (let i = 0; i < shapes.length; i++) {
          const shape = shapes[i]
          if (shape.holes && shape.holes.length > 0) {
            for (let j = 0; j < shape.holes.length; j++) {
              const hole = shape.holes[j]
              holeShapes.push(hole)
            }
          }
        }

        // holes geometry + mesh
        shapes.push.apply(shapes, holeShapes)
        const lineText = new THREE.Object3D()
        for (let i = 0; i < shapes.length; i++) {
          const shape = shapes[i]
          const points = shape.getPoints()
          const geometry = new THREE.BufferGeometry().setFromPoints(points)
          geometry.translate(xMid, 0, 0)
          const lineMesh = new THREE.Line(geometry, matDark)
          lineText.add(lineMesh)
        }

        scene.add(lineText)
      })

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('FontsWrap')
      container.appendChild(renderer.domElement)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.addEventListener('change', render)

      window.addEventListener('resize', onWindowResize)
    }

    function render () {
      renderer.render(scene, camera)
    }

    function animate () {
      requestAnimationFrame(animate)
      render()
    }

    function onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    onMounted(() => {
      init()
      animate()
    })
    return {}
  }
})
</script>

<style lang='less' scoped>
</style>
