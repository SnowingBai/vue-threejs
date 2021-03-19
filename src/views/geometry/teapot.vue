<template>
  <div id="GeoTeapotWrap"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry'

import { defineComponent, onMounted, onUnmounted } from 'vue'
export default defineComponent({
  name: 'GeoTeapot',
  setup () {
    let scene, camera, renderer
    let cameraControls

    let ambientLight, light

    let teapot
    let phongMaterial // 光照材质

    const controls = {
      teapotSize: 200,
      tess: -1,
      bottom: true,
      lid: true,
      body: true,
      fitLid: false,
      nonblinn: true
    }

    function init () {
      // camera
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 80000)
      camera.position.set(-600, 500, 1300)

      // light
      ambientLight = new THREE.AmbientLight(0x333333)
      light = new THREE.DirectionalLight(0xFFFFFF, 1.0)

      // material
      const materialColor = new THREE.Color()
      materialColor.setRGB(1.0, 1.0, 1.0)
      phongMaterial = new THREE.MeshPhongMaterial({
        color: materialColor,
        side: THREE.DoubleSide
      })

      scene = new THREE.Scene()
      scene.background = new THREE.Color(0xAAAAAA)

      scene.add(ambientLight)
      scene.add(light)

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.outputEncoding = THREE.sRGBEncoding
      const container = document.getElementById('GeoTeapotWrap')
      container.appendChild(renderer.domElement)

      cameraControls = new OrbitControls(camera, renderer.domElement)
      cameraControls.addEventListener('change', render)

      window.addEventListener('resize', onWindowResize)
    }

    function render () {
      createNewTeapot()
      renderer.render(scene, camera)
    }

    function createNewTeapot () {
      if (teapot !== undefined) {
        teapot.geometry.dispose()
        scene.remove(teapot)
      }

      const teapotGeometry = new TeapotGeometry(
        controls.teapotSize,
        controls.tess,
        controls.bottom,
        controls.lid,
        controls.body,
        controls.fitLid,
        controls.nonblinn
      )

      teapot = new THREE.Mesh(teapotGeometry, phongMaterial)
      scene.add(teapot)
    }

    function onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      render()
    }

    onMounted(() => {
      init()
      render()
    })

    onUnmounted(() => {
      window.removeEventListener('resize', onWindowResize)
    })
    return {}
  }
})
</script>

<style lang='less' scoped>
</style>
