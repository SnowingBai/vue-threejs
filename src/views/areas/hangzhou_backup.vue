<template>
  <div id="HangzhouWrap">
    <div id="building-info"></div>
    <div id="cont"></div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils'
import * as GeoTIFF from 'geotiff'

import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'Hangzhou',
  setup () {
    let scene, camera, renderer
    let raycaster, controls, clock, loadManager
    let sun
    const geometries = []

    // Center
    const Center = {
      longitude: -3.188822,
      latitude: 55.943686
    }

    const Building = 'hangzhou/building.geojson'
    const Road = 'hangzhou/highway.geojson'
    const Water = 'hangzhou/water.geojson'

    const Lights = 'hangzhou/lights.json'

    // infomation collider
    const ColliderBuilding = []

    function init () {
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0x222222)
      scene.fog = new THREE.Fog(0x444444, 10, 150)

      camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 200)
      camera.position.set(8, 4, 0)

      // sun light
      sun = new THREE.DirectionalLight(0xffffff, 0.8)
      sun.position.set(0, 3, 0)
      scene.add(sun)

      // init models loading manager
      loadManager = new THREE.LoadingManager()
      loadManager.onProgress = (item, loaded, total) => {
        if (loaded === total) {
          console.log('Loading Finished')
        } else {
          console.log(loaded, total)
        }
      }

      // 加载建筑物
      loadBuildings()

      // raycaster
      raycaster = new THREE.Raycaster()

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
      const container = document.getElementById('cont')
      container.appendChild(renderer.domElement)

      controls = new MapControls(camera, renderer.domElement)
      controls.rotateSpeed = 0.7
      controls.enableDamping = true
      controls.dampingFactor = 0.25
      controls.minDistance = 10
      controls.maxDistance = 1000
      controls.update()
      // controls.addEventListener('change', render)

      window.addEventListener('resize', onWindowResize)

      container.addEventListener('mousedown', (evt) => {
        const mouse = {
          x: (evt.clientX / window.innerWidth) * 2 - 1,
          y: -(evt.clientY / window.innerHeight) * 2 + 1
        }

        const hitted = checkIntersection(mouse)
        console.log(hitted)
      }, false)
    }

    // 加载建筑物
    function loadBuildings () {
      const material = new THREE.MeshPhongMaterial({
        transparent: true,
        opacity: 0.95
      })

      const loader = new THREE.FileLoader()
      loader.load('hangzhou/building.geojson', (res) => {
        const features = res.dampingFactor.features

        for (let i = 0; i < features.length; i++) {
          const fel = features[i]

          if (!fel.properties) return

          const info = fel.properties
          if (info.tags && info.tags.building) {
            addBuilding(fel.geometry.coordinates, info, info.tags['building:levels'])
          }
        }

        const mergeGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries)
        const mesh = new THREE.Mesh(mergeGeometry, material)
        mesh.position.y = -1
        scene.add(mesh)

        loadRoads()
      })
    }

    // 加载道路
    function loadRoads () {
      // .
    }

    // 点击画布，返回选中目标
    // 向屏幕发射一条射线，返回触碰的所有物体，返回第一个物体
    function checkIntersection (pointer) {
      raycaster.setFromCamera(pointer, camera)
      const intersects = raycaster.intersectObjects(ColliderBuilding, true)
      if (intersects.length > 0) {
        const selectedObject = intersects[0].object
        return selectedObject
      } else {
        return false
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
      controls.update()
      render()
    }

    onMounted(() => {
      init()
      animete()
    })
    return {}
  }
})
</script>
