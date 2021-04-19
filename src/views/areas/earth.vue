<template>
  <div id="EarthWrap"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'Earth',
  setup () {
    let scene, camera, renderer, controls

    function init () {
      scene = new THREE.Scene()

      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
      camera.position.set(100, 100, 100)
      camera.lookAt(new THREE.Vector3(0, 0, 0))
      scene.add(camera)

      const light = new THREE.HemisphereLight(0xffffff)
      light.position.set(0, 0, 200)
      scene.add(light)

      const geometry = new THREE.SphereGeometry(40, 100, 100)

      const loader = new THREE.TextureLoader()
      loader.load('textures/world_image_nansha.jpg', texture => {
        const material = new THREE.MeshLambertMaterial({
          map: texture,
          transparent: true
        })

        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
      })

      // 绘制点
      // let shapePoint = new THREE.Shape()
      // shapePoint.absarc(0, 0, r - 4, 0, 2 * Math.PI, false)
      // let arcGeometry = new THREE.ShapeGeometry(shapePoint)
      // let arcMaterial = new THREE.MeshBasicMaterial({ color: 0x008080 })
      // let point = new THREE.Mesh(arcGeometry, arcMaterial)

      // // 绘制圆弧
      // let geometryLine = new THREE.Geometry()
      // let arc = new THREE.ArcCurve(0, 0, r, 0, 2 * Math.PI)
      // let points = arc.getPoints(40)
      // geometryLine.setFromPoints(points)
      // let LineMateri = new THREE.LineBasicMaterial({ color: 0x20b2aa })
      // let line = new THREE.Line(geometryLine, LineMateri)

      // // 位置设置
      // position.set(pos.x, pos.y, pos.z)

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('EarthWrap')
      container.appendChild(renderer.domElement)

      controls = new OrbitControls(camera, renderer.domElement)
      controls.addEventListener('change', render)

      window.addEventListener('resize', onWindowResize)
    }

    // function getPosition (longitude, latitude, radius = 40) {
    //   const lg = THREE.Math.degToRad(longitude)
    //   const lt = THREE.Math.degToRad(latitude) // 获取x，y，z坐标
    //   const temp = radius * Math.cos(lt)
    //   const x = temp * Math.sin(lg)
    //   const y = radius * Math.sin(lt)
    //   const z = temp * Math.cos(lg)
    //   return new THREE.Vector3(x, y, z)
    // }

    function render () {
      renderer.render(scene, camera)
    }

    function animate () {
      requestAnimationFrame(animate)
      controls.update()
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
