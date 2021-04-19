<template>
  <div id="ZJWrap">
    <div id="CityInfo"></div>
  </div>
</template>

<script>
import * as d3 from 'd3-geo'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'ZJ',
  setup () {
    let scene, camera, renderer, cityInfo
    let map
    let raycaster, mouse
    let activeInstersect = []

    function init () {
      scene = new THREE.Scene()

      cityInfo = document.getElementById('CityInfo')

      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.set(0, -70, 150)
      camera.lookAt(0, 0, 0)

      const light = new THREE.AmbientLight(0xffffff)
      scene.add(light)

      const loader = new THREE.FileLoader()
      loader.load('geojson/ZJ.json', (data) => {
        initMap(JSON.parse(data))
      })

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('ZJWrap')
      container.appendChild(renderer.domElement)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.addEventListener('change', render)

      window.addEventListener('resize', onWindowResize)
    }

    function initMap (zjJson) {
      map = new THREE.Object3D()

      // 墨卡托投影转换
      const projection = d3.geoMercator().center([120.372256, 29.106157]).scale(800).translate([0, 0])
      zjJson.features.forEach(elem => {
        const city = new THREE.Object3D()
        const coordinates = elem.geometry.coordinates

        coordinates.forEach(multiPolygon => {
          multiPolygon.forEach(polygon => {
            // 用于挤压几何体的形状
            const shape = new THREE.Shape()

            // 轮廓
            const lineMaterial = new THREE.LineBasicMaterial({
              color: 0xffffff
            })
            const lineGeometry = new THREE.BufferGeometry()

            const positions = []

            for (let i = 0; i < polygon.length; i++) {
              const [x, y] = projection(polygon[i])
              if (i === 0) {
                shape.moveTo(x, -y)
              }

              shape.lineTo(x, -y)
              positions.push(x, -y, 4.01)
            }

            lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

            const extrudeSettings = {
              depth: 4,
              bevelEnabled: false
            }

            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
            const material = new THREE.MeshBasicMaterial({
              color: 0x02A1E2,
              transparent: true,
              opacity: 0.6
            })
            const material1 = new THREE.MeshBasicMaterial({
              color: 0x3480C4,
              transparent: true,
              opacity: 0.5
            })
            const mesh = new THREE.Mesh(geometry, [material, material1])
            const line = new THREE.Line(lineGeometry, lineMaterial)
            city.add(mesh)
            city.add(line)
          })
        })

        // 将 geojson 的 properties 放到模型中（用于放置名称标签）
        city.properties = elem.properties
        if (elem.properties.centroid) {
          const [x, y] = projection(elem.properties.centroid)
          city.properties._centroid = [x, y]
        }

        map.add(city)
      })

      scene.add(map)
    }

    function setRaycaster () {
      raycaster = new THREE.Raycaster()
      mouse = new THREE.Vector2()
      const eventOffset = {}

      function onMouseMove (event) {
        // 将鼠标位置归一化为设备坐标
        // x 和 y 方向的取值范围是 (-1 to +1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
        eventOffset.x = event.clientX
        eventOffset.y = event.clientY
        cityInfo.style.left = eventOffset.x + 2 + 'px'
        cityInfo.style.top = eventOffset.y + 2 + 'px'
      }

      window.addEventListener('mousemove', onMouseMove, false)
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
      // 通过摄像机和鼠标位置更新射线
      raycaster.setFromCamera(mouse, camera)
      if (map) {
        // 计算物体和射线的焦点
        const intersects = raycaster.intersectObjects(map.children, true)
        // 恢复原状
        if (activeInstersect && activeInstersect.length) {
          activeInstersect.forEach(elem => {
            elem.object.material[0].color.set(0x02A1E2)
            elem.object.material[1].color.set(0x3480C4)
          })
        }

        activeInstersect = []

        for (let i = 0; i < intersects.length; i++) {
          if (intersects[i].object.material && intersects[i].object.material.length === 2) {
            activeInstersect.push(intersects[i])
            intersects[i].object.material[0].color.set(0xff0000)
            intersects[i].object.material[1].color.set(0xff0000)
            break
          }
        }
      }

      createCityInfo()
      render()
    }

    // 显示城市信息
    function createCityInfo () {
      if (activeInstersect && activeInstersect.length && activeInstersect[0].object.parent.properties.name) {
        const properties = activeInstersect[0].object.parent.properties
        cityInfo.textContent = properties.name
        cityInfo.style.visibility = 'visible'
      } else {
        cityInfo.style.visibility = 'hidden'
      }
    }

    onMounted(() => {
      init()
      setRaycaster()
      animate()
    })
    return {}
  }
})
</script>

<style lang='scss' scoped>
#CityInfo {
  position: absolute;
  z-index: 2;
  background: white;
  padding: 10px;
  visibility: hidden;
}
</style>
