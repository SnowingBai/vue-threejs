<template>
  <div id="HangzhouWrap"></div>
</template>

<script>
import * as THREE from 'three'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils'
import Stats from 'three/examples/jsm/libs/stats.module'

import { CreateShape, CreateBuildingGeometry } from '@/utils/BuildModels'
import { AddGroup, GPSRelativePosition } from '@/utils/ThreeBasic'

import { defineComponent, onMounted, nextTick } from 'vue'
export default defineComponent({
  name: 'Hangzhou',
  setup () {
    let scene, camera, renderer
    let controls
    let stats
    const geometries = []
    const AnimatedLineDistances = []
    // Center
    const Center = {
      longitude: 120.2070046,
      latitude: 30.2473306
    }

    // 3D Groups
    let groups = null
    let roadGroups = null
    let lineGroups = null

    function init () {
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0x222222)
      scene.fog = new THREE.Fog(0x444444, 10, 150)

      camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000)
      camera.position.set(8, 4, 10)

      // init groups
      groups = AddGroup('groups', 'Interactive-Root')
      roadGroups = AddGroup('roadGroups', 'road-groups')
      lineGroups = AddGroup('lineGroups', 'line-groups')
      scene.add(groups)

      nextTick(() => {
        groups.add(roadGroups)
        groups.add(lineGroups)
      })

      // 加载灯光
      loadLights()

      const loader = new THREE.FileLoader()
      loader.load('hangzhou/map.geojson', (data) => {
        const res = JSON.parse(data)
        const features = res.features

        for (const feature of features) {
          if (!feature.properties) return

          const info = feature.properties
          if (info) {
            if (info.building) {
              // 建筑物
              addBuilding(feature.geometry.coordinates, info, info['building:levels'])
            } else if (info.highway) {
              // 公路
              if (feature.geometry.type === 'LineString' && info.highway !== 'pedestrian' && info.highway !== 'footway' && info.highway !== 'path') {
                addRoad(feature.geometry.coordinates, info)
              }
            }
          }
        }

        // 建筑材质
        const buildingMaterial = new THREE.MeshPhongMaterial({
          transparent: true,
          opacity: 0.95
        })

        // 合并建筑几何体 优化性能
        const mergeGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries)
        const mesh = new THREE.Mesh(mergeGeometry, buildingMaterial)
        mesh.position.y = -1
        scene.add(mesh)
      })

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
      const container = document.getElementById('HangzhouWrap')
      container.appendChild(renderer.domElement)

      controls = new MapControls(camera, renderer.domElement)
      controls.rotateSpeed = 0.5
      controls.enableDamping = true
      controls.dampingFactor = 0.5
      controls.minDistance = 10
      controls.maxDistance = 1000

      stats = new Stats()
      container.appendChild(stats.dom)

      window.addEventListener('resize', onWindowResize)
    }

    function loadLights () {
      let light

      const loader = new THREE.FileLoader()
      loader.load('hangzhou/lights.json', (data) => {
        const res = JSON.parse(data)
        res.forEach(el => {
          if (el.type === 'Directional') {
            light = new THREE.DirectionalLight(new THREE.Color(parseInt('0x' + el.color)), el.opacity)
          } else if (el.type === 'Ambient') {
            light = new THREE.AmbientLight(new THREE.Color(parseInt('0x' + el.color)), el.opacity)
          } else if (el.type === 'Point') {
            light = new THREE.PointLight(new THREE.Color(parseInt('0x' + el.color)), el.opacity)
          }

          if (el && el.position) {
            light.position.set(el.position.x, el.position.y, el.position.z)
          }

          light.castShadow = false
          light.name = el.name

          scene.add(light)
        })
      })
    }

    // 添加单个建筑物
    function addBuilding (points, info, height = 1) {
      const holes = []
      let shape, geometry

      for (let i = 0; i < points.length; i++) {
        const point = points[i]

        if (i === 0) {
          // shape
          shape = CreateShape(point, Center)
        } else {
          // holes
          holes.push(CreateShape(point, Center))
        }

        for (const hole of holes) {
          shape.holes.push(hole)
        }

        geometry = CreateBuildingGeometry(shape, {
          steps: 1,
          depth: 0.05 * height,
          bevelEnabled: false,
          curveSegments: 2
        })

        geometry.rotateX(Math.PI / 2)
        geometry.rotateZ(Math.PI)
        geometries.push(geometry)
      }
    }

    // 添加单条道路
    function addRoad (points, info) {
      if (points && points.length < 2) return
      const pointsPath = []

      for (const point of points) {
        if (!point[0] || !point[1]) return
        const [x, y] = GPSRelativePosition({ longitude: point[0], latitude: point[1] }, Center)
        pointsPath.push(new THREE.Vector3(x, 1, y))
      }

      // setFromPoints 通过点队列设置该 BufferGeometry 的 attribute [ position ]
      const geometry = new THREE.BufferGeometry().setFromPoints(pointsPath)
      geometry.rotateZ(Math.PI)

      const line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({ color: 0x1B4686 })
      )
      line.info = info
      // 计算 LineDashedMaterial 所需的距离的值的数组
      // 对于几何体中的每一个顶点，计算出当前点到线的起始点的累积长度
      line.computeLineDistances()
      roadGroups.add(line)

      // animated line
      const lineLength = geometry.attributes.lineDistance.array[geometry.attributes.lineDistance.count - 1]
      if (lineLength > 0.8) {
        const animatedLine = addAnimatedLine(geometry, lineLength)
        lineGroups.add(animatedLine)
      }

      line.matrixAutoUpdate = false
      line.updateMatrix()

      return line
    }

    // 添加流动线条
    function addAnimatedLine (geometry, length) {
      const animatedLine = new THREE.Line(geometry, new THREE.LineDashedMaterial({ color: 0x00FFFF }))
      animatedLine.material.transparent = true
      animatedLine.material.dashSize = 0 // 虚线大小
      animatedLine.material.gapSize = 1000 // 间隙大小

      AnimatedLineDistances.push(length)
      return animatedLine
    }

    // 更新流动线条
    function updateAnimatedLine () {
      if (!lineGroups.children.length) return false

      for (let i = 0; i < lineGroups.children.length; i++) {
        const line = lineGroups.children[i]
        // dashSize - 虚线大小（实线部分与间隙之和）
        const dash = parseInt(line.material.dashSize)
        const length = parseInt(AnimatedLineDistances[i])

        if (dash > length) {
          line.material.dashSize = 0
          line.material.opacity = 1
        } else {
          line.material.dashSize += 0.005
          line.material.opacity = line.material.opacity > 0 ? line.material.opacity - 0.002 : 0
        }
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
      updateAnimatedLine()
      stats.update()
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
