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
import { Water } from 'three/examples/jsm/objects/Water'

import BuildModels from '@/utils/BuildModels'
import ThreeBasic from '@/utils/ThreeBasic'

import { defineComponent, onMounted, nextTick } from 'vue'
export default defineComponent({
  name: 'Hangzhou',
  setup () {
    let scene, camera, renderer
    let controls
    let sun
    let waterMaterial
    const geometries = []
    const AnimatedLineDistances = []
    // Center
    const Center = {
      longitude: 120.2070046,
      latitude: 30.2473306
    }

    // 3D Groups
    let ir = null
    let irRoad = null
    let irLine = null
    let irWater = null

    function init () {
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0x222222)
      scene.fog = new THREE.Fog(0x444444, 10, 150)

      camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 200)
      camera.position.set(8, 4, 0)

      // init ir
      ir = ThreeBasic.AddGroup('ir', 'Interactive-Root')
      irRoad = ThreeBasic.AddGroup('IRR', 'irRoad')
      irLine = ThreeBasic.AddGroup('IRL', 'irLine')
      irWater = ThreeBasic.AddGroup('IRW', 'irWater')
      scene.add(ir)

      nextTick(() => {
        ir.add(irRoad)
        ir.add(irLine)
        ir.add(irWater)
      })

      // sun light
      sun = new THREE.DirectionalLight(0xffffff, 0.8)
      sun.position.set(0, 3, 0)
      scene.add(sun)

      // 加载灯光
      loadLights()

      // 水域材质
      const texture = new THREE.TextureLoader().load('hangzhou/textures/waternormals.png', texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      })

      waterMaterial = {
        textureWidth: 0.5,
        textureHeight: 0.5,
        waterNormals: texture,
        alpha: 1.0,
        sunDirection: sun.position.clone().normalize(),
        sunColor: 0xDDEBFF,
        waterColor: 0xA6C8FA,
        distortionScale: 2,
        fog: scene.fog !== undefined
      }

      const loader = new THREE.FileLoader()
      loader.load('hangzhou/map.geojson', (data) => {
        const res = JSON.parse(data)
        const features = res.features

        for (let i = 0; i < features.length; i++) {
          const fel = features[i]

          if (!fel.properties) return

          const info = fel.properties
          if (info) {
            if (info.building) {
              // 建筑物
              addBuilding(fel.geometry.coordinates, info, info['building:levels'])
            } else if (info.highway) {
              // 公路
              if (fel.geometry.type === 'LineString' && info.highway !== 'pedestrian' && info.highway !== 'footway' && info.highway !== 'path') {
                addRoad(fel.geometry.coordinates, info)
              }
            } else if (info.natural === 'water') {
              if (fel.geometry.type === 'Polygon') {
                addWater(fel.geometry.coordinates, fel.properties)
              }
            }
          }
        }

        // 建筑材质
        const buildingMaterial = new THREE.MeshPhongMaterial({
          transparent: true,
          opacity: 0.95
        })
        const mergeGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries)
        const mesh = new THREE.Mesh(mergeGeometry, buildingMaterial)
        mesh.position.y = -1
        scene.add(mesh)
        console.log(geometries)
      })

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
    }

    function loadLights () {
      let light

      const loader = new THREE.FileLoader()
      loader.load('hangzhou/lights.json', (data) => {
        const res = JSON.parse(data)
        res.forEach(el => {
          if (el.type === 'Ambient') {
            light = new THREE.AmbientLight(new THREE.Color(parseInt('0x' + el.color)), el.opacity)
          } else if (el.type === 'Point') {
            light = new THREE.PointLight(new THREE.Color(parseInt('0x' + el.color)), el.opacity)
            light.position.set(el.position.x, el.position.y, el.position.z)
          }

          light.castShadow = false
          light.name = el.name

          scene.add(light)
        })
      })
    }

    // 添加单个建筑物
    function addBuilding (d, info, height = 1) {
      if (!height) height = 1

      const holes = []
      let shape, geometry

      for (let i = 0; i < d.length; i++) {
        const el = d[i]

        if (i === 0) {
          // main
          shape = BuildModels.GenShape(el, Center)
        } else {
          // holes
          holes.push(BuildModels.GenShape(el, Center))
        }

        for (let h = 0; h < holes.length; h++) {
          shape.holes.push(holes[h])
        }

        geometry = BuildModels.GenBuildingGeometry(shape, {
          curveSegments: 2,
          steps: 1,
          depth: 0.05 * height,
          bevelEnabled: false
        })

        geometry.rotateX(Math.PI / 2)
        geometry.rotateZ(Math.PI)
        geometries.push(geometry)
      }
    }

    // 添加单条道路
    function addRoad (d, info) {
      const points = []

      for (let i = 0; i < d.length; i++) {
        if (!d[0][1]) return

        const el = d[i]

        if (!el[0] || !el[1]) return

        let elp = [el[0], el[1]]

        elp = ThreeBasic.GPSRelativePosition({ latitude: elp[1], longitude: elp[0] }, Center)
        points.push(new THREE.Vector3(elp[0], 1, elp[1]))
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      geometry.rotateZ(Math.PI)

      const line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({ color: 0x1B4686 })
      )
      line.info = info
      line.computeLineDistances()
      irRoad.add(line)

      // ani-road
      const lineLength = geometry.attributes.lineDistance.array[geometry.attributes.lineDistance.count - 1]
      if (lineLength > 0.8) {
        const aniLine = addAnimatedLine(geometry, lineLength)
        irLine.add(aniLine)
      }

      // line.position = new THREE.Vector3(line.position.x, 0, line.position.z)
      line.matrixAutoUpdate = false
      line.updateMatrix()

      return line
    }

    // 添加流动线条
    function addAnimatedLine (geometry, length) {
      const animatedLine = new THREE.Line(geometry, new THREE.LineDashedMaterial({ color: 0x00FFFF }))
      animatedLine.material.transparent = true
      animatedLine.material.dashSize = 0
      animatedLine.material.gapSize = 1000

      AnimatedLineDistances.push(length)

      return animatedLine
    }

    // 更新流动线条
    function updateAniLines () {
      if (irLine.children.length <= 0) return false

      for (let i = 0; i < irLine.children.length; i++) {
        const line = irLine.children[i]
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

    // 添加单条水域
    function addWater (d, info) {
      const holes = []
      let shape

      for (let i = 0; i < d.length; i++) {
        const el = d[i]
        if (i === 0) {
          shape = BuildModels.GenShape(el, Center)
        } else {
          holes.push(BuildModels.GenShape(el, Center))
        }
      }

      for (let h = 0; h < holes.length; h++) {
        shape.holes.push(holes[h])
      }

      const geometry = BuildModels.GenWaterGeometry(shape, {
        curveSegments: 2,
        steps: 1,
        depth: 0.01,
        bevelEnabled: false
      })

      geometry.rotateX(Math.PI / 2)
      geometry.rotateZ(Math.PI)

      const water = new Water(geometry, waterMaterial)
      irWater.add(water)
    }

    // 更新水域
    function updateWater () {
      for (let i = 0; i < irWater.children.length; i++) {
        irWater.children[i].material.uniforms.time.value += 1.0 / 700
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
      updateAniLines()
      updateWater()
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
