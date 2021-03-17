<template>
  <div id="GeoCarWrapper"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'GeoCar',
  setup () {
    let scene, camera, renderer
    let ambientLight, light
    let group
    let controls
    const color = 0x2C85E1
    const extrudeSettings = {
      depth: 50,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 1,
      bevelThickness: 1
    }
    const extrudeSettings1 = {
      depth: 10,
      bevelSegments: 3,
      bevelSize: 20,
      bevelThickness: 20,
      bevelOffset: -10
    }
    const extrudeSettings2 = {
      depth: 3,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 1,
      bevelThickness: 1
    }

    function init () {
      scene = new THREE.Scene()

      camera = new THREE.PerspectiveCamera(45, window.innerWidth / innerHeight, 1, 80000)
      camera.position.z = 1300

      // light
      ambientLight = new THREE.AmbientLight(0x333333)
      light = new THREE.DirectionalLight(0xFFFFFF, 1.0)
      scene.add(ambientLight)
      scene.add(light)

      // material
      const material = new THREE.MeshPhongMaterial({ color })

      // group
      group = new THREE.Group()
      scene.add(group)

      // 底盘
      const cylinder = new THREE.CylinderGeometry(100, 100, 20, 20)
      const cylinderMesh = new THREE.Mesh(cylinder, material)
      group.add(cylinderMesh)

      // 中心轴
      const cylinder1 = new THREE.CylinderGeometry(40, 40, 40, 30)
      const cylinderMesh1 = new THREE.Mesh(cylinder1, material)
      cylinderMesh1.position.set(0, 30, 0)
      group.add(cylinderMesh1)

      // 中心轴2
      const arcShape1 = new THREE.Shape()
        .absarc(0, 0, 35, 0, Math.PI * 2, false)

      // 上圆环 shape + ExtrudeGeometry 挤压
      const arcShape = new THREE.Shape()
        .absarc(0, 0, 85, 0, Math.PI * 2, false)
      const holePath = new THREE.Path()
        .absarc(0, 0, 80, 0, Math.PI * 2, true)
      arcShape.holes.push(holePath)

      // 叶子板
      const triangleShape = new THREE.Shape()
        .moveTo(0, 0)
        .lineTo(0, 40)
        .lineTo(30, 15)
        .lineTo(40, 0)
        .lineTo(0, 0)

      addShape(arcShape, extrudeSettings, 0, 60, 0, Math.PI * 0.5, 0, 0)
      addShape(arcShape1, extrudeSettings1, 0, 60, 0, Math.PI * 0.5, 0, 0)
      addShape(triangleShape, extrudeSettings2, 40, 10, 0, 0, 0, 0)
      addShape(triangleShape, extrudeSettings2, 0, 10, -40, 0, Math.PI * 0.5, 0)
      addShape(triangleShape, extrudeSettings2, 0, 10, 40, 0, Math.PI * 1.5, 0)
      addShape(triangleShape, extrudeSettings2, -40, 10, 0, 0, Math.PI, 0)

      // renderer
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('GeoCarWrapper')
      container.appendChild(renderer.domElement)

      controls = new OrbitControls(camera, renderer.domElement)
      controls.addEventListener('change', render)

      // event
      window.addEventListener('resize', onWindowResize)
    }

    function addShape (shape, extrudeSettings, x, y, z, rx, ry, rz) {
      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
      const mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color }))
      mesh.position.set(x, y, z)
      mesh.rotation.set(rx, ry, rz)
      group.add(mesh)
    }

    function onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      render()
    }

    function render () {
      renderer.render(scene, camera)
    }

    onMounted(() => {
      init()
      render()
    })

    return {}
  }
})
</script>

<style lang='less' scoped>
</style>
