<template>
  <div id="DashLineWrap"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'

import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'DashLine',
  setup () {
    let scene, camera, renderer
    let geometry, len
    let line, dashLine
    let gui

    function init () {
      scene = new THREE.Scene()

      camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000)
      camera.position.set(-40, 0, 60)

      const material = new THREE.LineBasicMaterial({
        color: 0xffffff
      })

      const points = []
      points.push(new THREE.Vector3(0, 0, 0))
      points.push(new THREE.Vector3(0, 20, 0))

      geometry = new THREE.BufferGeometry().setFromPoints(points)
      // basic material
      line = new THREE.Line(geometry, material)
      scene.add(line)
      // dash material
      dashLine = new THREE.Line(geometry, new THREE.LineDashedMaterial({ color: 0xff0000 }))
      dashLine.material.transparent = true
      dashLine.material.dashSize = 0 // 虚线大小
      dashLine.material.gapSize = 1000 // 间隙大小
      dashLine.computeLineDistances()
      scene.add(dashLine)

      len = geometry.attributes.lineDistance.array[geometry.attributes.lineDistance.count - 1]
      console.log(geometry)

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('DashLineWrap')
      container.appendChild(renderer.domElement)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.addEventListener('change', render)

      window.addEventListener('resize', onWindowResize)
    }

    // 更新流动线条
    function updateAnimatedLine () {
      // dashSize - 虚线大小（实线部分与间隙之和）
      const dashSize = dashLine.material.dashSize

      if (dashSize > len) {
        dashLine.material.dashSize = 0
        dashLine.material.opacity = 1
      } else {
        dashLine.material.dashSize += 0.05
        dashLine.material.opacity = dashLine.material.opacity > 0 ? dashLine.material.opacity - 0.002 : 0
      }
    }

    function onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    function render () {
      renderer.render(scene, camera)
    }

    function animete () {
      requestAnimationFrame(animete)
      updateAnimatedLine()
      render()
    }

    function buildGui () {
      gui = new GUI()

      const params = {
        dashSize: dashLine.material.dashSize,
        gapSize: dashLine.material.gapSize,
        opacity: dashLine.material.opacity
      }

      gui.add(params, 'dashSize', 0, 40).onChange((val) => {
        dashLine.material.dashSize = val
        render()
      })

      gui.add(params, 'gapSize', 0, 100).onChange((val) => {
        dashLine.material.gapSize = val
        render()
      })

      gui.add(params, 'opacity', 0, 1).onChange((val) => {
        dashLine.material.opacity = val
        render()
      })

      gui.open()
    }

    onMounted(() => {
      init()
      animete()
      buildGui()
    })
    return {}
  }
})
</script>
