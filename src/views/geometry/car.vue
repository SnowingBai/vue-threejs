<template>
  <div id="GeoCarWrap"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { defineComponent, onMounted, onUnmounted } from 'vue'

export default defineComponent({
  name: 'GeoCar',
  setup () {
    let scene, camera, renderer
    let ambientLight, light
    let controls
    let group
    const color = 0x2C85E1
    const material = new THREE.MeshPhongMaterial({ color })
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

    const extrudeSettings4 = {
      depth: 100,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 1,
      bevelThickness: 1
    }

    const extrudeSettings5 = {
      depth: 20,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 1,
      bevelThickness: 1
    }

    function init () {
      scene = new THREE.Scene()

      camera = new THREE.PerspectiveCamera(45, window.innerWidth / innerHeight, 1, 80000)
      camera.position.z = 1700

      // light
      ambientLight = new THREE.AmbientLight(0x333333)
      light = new THREE.DirectionalLight(0xFFFFFF, 1.0)
      scene.add(ambientLight)
      scene.add(light)

      // group
      group = new THREE.Group()
      scene.add(group)

      group.rotation.set(Math.PI * 0.25, 0, 0)

      // wheel
      addWheel(0, 0, 400, Math.PI * 0.5, 0, 0)
      addWheel(300, 0, 400, Math.PI * 0.5, 0, 0)
      addWheel(0, 0, 0, -Math.PI * 0.5, 0, 0)
      addWheel(300, 0, 0, -Math.PI * 0.5, 0, 0)

      crossbeam(0, 0, 160, 0, 0, 0)

      baseplate(-310, 50, 10, Math.PI * 0.5, 0, 0)

      // renderer
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('GeoCarWrap')
      container.appendChild(renderer.domElement)

      controls = new OrbitControls(camera, renderer.domElement)
      controls.addEventListener('change', render)

      // event
      window.addEventListener('resize', onWindowResize)
    }

    function addShape (shape, extrudeSettings, x, y, z, rx, ry, rz, color = 0x2C85E1) {
      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
      const mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color }))
      mesh.position.set(x, y, z)
      mesh.rotation.set(rx, ry, rz)
      return mesh
    }

    function addWheel (x, y, z, rx, ry, rz) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(100, 100, 20, 20),
        material
      )
      group.add(mesh)

      // 中心轴
      const cylinder1 = new THREE.CylinderGeometry(40, 40, 40, 30)
      const cylinderMesh1 = new THREE.Mesh(cylinder1, material)
      cylinderMesh1.position.set(0, 30, 0)
      mesh.add(cylinderMesh1)

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

      mesh.add(addShape(arcShape, extrudeSettings, 0, 60, 0, Math.PI * 0.5, 0, 0))
      mesh.add(addShape(arcShape1, extrudeSettings1, 0, 60, 0, Math.PI * 0.5, 0, 0))
      mesh.add(addShape(triangleShape, extrudeSettings2, 40, 10, 0, 0, 0, 0))
      mesh.add(addShape(triangleShape, extrudeSettings2, 0, 10, -40, 0, Math.PI * 0.5, 0))
      mesh.add(addShape(triangleShape, extrudeSettings2, 0, 10, 40, 0, Math.PI * 1.5, 0))
      mesh.add(addShape(triangleShape, extrudeSettings2, -40, 10, 0, 0, Math.PI, 0))

      mesh.position.set(x, y, z)
      mesh.rotation.set(rx, ry, rz)
    }

    function crossbeam (x, y, z, rx, ry, rz) {
      const beam = new THREE.Mesh(
        new THREE.BoxGeometry(50, 40, 460),
        material
      )

      const beam1 = new THREE.Mesh(
        new THREE.BoxGeometry(50, 40, 460),
        material
      )
      beam1.position.set(300, 0, 0)
      beam.add(beam1)

      const beamTrapezoid = new THREE.Shape()
        .moveTo(0, 30)
        .lineTo(380, 30)
        .lineTo(380, 20)
        .lineTo(190, 0)
        .lineTo(0, 20)
        .lineTo(0, 30)

      const trapezoid = new THREE.Shape()
        .moveTo(10, 0)
        .lineTo(0, 60)
        .lineTo(80, 60)
        .lineTo(70, 0)
        .lineTo(10, 0)

      beam.add(addShape(beamTrapezoid, extrudeSettings, 130, -20, 230, 0, Math.PI * 0.5, 0))
      beam.add(addShape(trapezoid, extrudeSettings4, -50, -30, 80, 0, Math.PI * 0.5, 0))
      beam.add(addShape(trapezoid, extrudeSettings4, 100, -30, 80, 0, Math.PI * 0.5, 0))
      beam.add(addShape(trapezoid, extrudeSettings4, 250, -30, 80, 0, Math.PI * 0.5, 0))

      group.add(beam)
      beam.position.set(x, y, z)
      beam.rotation.set(rx, ry, rz)
    }

    function baseplate (x, y, z, rx, ry, rz) {
      const roundedRectShape = new THREE.Shape();
      (function roundedRect (ctx, x, y, width, height, radius) {
        ctx.moveTo(x, y + radius)
        ctx.lineTo(x, y + height - radius)
        ctx.quadraticCurveTo(x, y + height, x + radius, y + height)
        ctx.lineTo(x + width - radius, y + height)
        ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius)
        ctx.lineTo(x + width, y + radius)
        ctx.quadraticCurveTo(x + width, y, x + width - radius, y)
        ctx.lineTo(x + radius, y)
        ctx.quadraticCurveTo(x, y, x, y + radius)

        const holePath = new THREE.Path()
          .moveTo(x + 120, y + 50)
          .lineTo(x + 120, y + height - 50)
          .lineTo(x + width - 120, y + height - 50)
          .lineTo(x + width - 120, y + 50)
          .lineTo(x + 120, y + 50)
        ctx.holes.push(holePath)
      })(roundedRectShape, 0, 0, 900, 380, 190)

      const mesh = addShape(roundedRectShape, extrudeSettings5, 0, 0, 0, 0, 0, 0)
      group.add(mesh)
      mesh.position.set(x, y, z)
      mesh.rotation.set(rx, ry, rz)
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

    onUnmounted(() => {
      window.removeEventListener('resize', onWindowResize)
    })

    return {}
  }
})
</script>
