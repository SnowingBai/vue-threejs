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
    let mixer

    function init () {
      scene = new THREE.Scene()

      // camera
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
      camera.position.set(100, 100, 100)
      camera.lookAt(new THREE.Vector3(0, 0, 0))
      scene.add(camera)

      // light
      const light = new THREE.HemisphereLight(0xffffff)
      light.position.set(0, 0, 200)
      scene.add(light)

      // geometry
      const geometry = new THREE.SphereGeometry(40, 100, 100)

      // texture
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
      const shapePoint = new THREE.Shape()
      shapePoint.absarc(0, 0, r - 4, 0, 2 * Math.PI, false)
      const arcGeometry = new THREE.ShapeGeometry(shapePoint)
      const arcMaterial = new THREE.MeshBasicMaterial({ color: 0x008080 })
      const point = new THREE.Mesh(arcGeometry, arcMaterial)

      // 绘制圆弧
      const geometryLine = new THREE.Geometry()
      const arc = new THREE.ArcCurve(0, 0, r, 0, 2 * Math.PI)
      const points = arc.getPoints(40)
      geometryLine.setFromPoints(points)
      const LineMateri = new THREE.LineBasicMaterial({ color: 0x20b2aa })
      const line = new THREE.Line(geometryLine, LineMateri)

      // 位置设置
      position.set(pos.x, pos.y, pos.z)

      // 二维图形旋转至球面
      // Spherical 球坐标
      const spherical = new THREE.Spherical()
      spherical.setFromCartesianCoords(pos.x, pos.y, pos.z)

      // 设置位置点旋转
      Point.rotateX(spherical.phi - Math.PI / 2)
      Point.rotateY(spherical.theta)

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('EarthWrap')
      container.appendChild(renderer.domElement)

      controls = new OrbitControls(camera, renderer.domElement)
      controls.addEventListener('change', render)

      window.addEventListener('resize', onWindowResize)
    }

    // 经纬度 转为 坐标
    // 公式
    // x = rsinθcosφ
    // y = rsinθsinφ
    // z = rcosθ
    function getPosition (longitude, latitude, radius = 40) {
      const lg = THREE.Math.degToRad(longitude)
      const lt = THREE.Math.degToRad(latitude) // 获取x，y，z坐标
      const temp = radius * Math.cos(lt)
      const x = temp * Math.sin(lg)
      const y = radius * Math.sin(lt)
      const z = temp * Math.cos(lg)
      return new THREE.Vector3(x, y, z)
    }

    // 求两点的中点
    function getVCenter (v1, v2) {
      const v = v1.add(v2)
      return v.divideScalar(2)
    }

    function getLenVcetor (v1, v2, len) {
      const v1v2Len = v1.distanceTo(v2)
      return v1.lerp(v2, len / v1v2Len)
    }

    // 获取贝塞尔控制点
    function getBezierPoint (v0, v3) {
      const angle = (v0.angleTo(v3) * 180) / Math.PI // 0 ~ Math.PI 计算向量夹角
      const aLen = angle * 2.5
      const hLen = angle * angle * 50
      const p0 = new THREE.Vector3(0, 0, 0) // 法线向量
      const rayLine = new THREE.Ray(p0, getVCenter(v0.clone(), v3.clone())) // 顶点坐标
      const vtop = rayLine.at(hLen / rayLine.at(1).distanceTo(p0), vtop) // 位置
      // 控制点坐标
      const v1 = getLenVcetor(v0.clone(), vtop, aLen)
      const v2 = getLenVcetor(v3.clone(), vtop, aLen)
      return {
        v1,
        v2
      }
    }

    // 绘制三次贝塞尔曲线
    function drawLine (longitude, latitude, longitude2, latitude2) {
      const geometry = new THREE.Geometry() // 声明一个几何体对象Geometry
      const v0 = getPosition(longitude, latitude, radius)
      const v3 = getPosition(longitude2, latitude2, radius)
      const { v1, v2 } = getBezierPoint(v0, v3) // 三维二次贝赛尔曲线
      const curve = new THREE.CubicBezierCurve3(v0, v1, v2, v3)
      const curvePoints = curve.getPoints(100)
      geometry.setFromPoints(curvePoints)
      const material = new THREE.LineBasicMaterial({ color: 0xff7e41 })
      const line = new THREE.Line(geometry, material)
      group.add(line)
      sport(curvePoints)
    }

    // 绘制小球
    function drawSportPoint (position, name) {
      const box = new THREE.SphereGeometry(6, 6, 6)
      const material = new THREE.MeshLambertMaterial({ color: 0x00bfff }) // 材质对象
      const mesh = new THREE.Mesh(box, material)
      mesh.name = name
      mesh.position.set(position.x, position.y, position.z)
      groupBall.add(mesh)
      group.add(groupBall)
      return mesh
    }

    // 小球运动
    function sport (curvePoints, index) {
      const Ball = drawSportPoint(curvePoints[0])
      const arr = Array.from(Array(101), (v, k) => k) // 生成一个时间序列
      const times = new Float32Array(arr)
      const posArr = []
      curvePoints.forEach(elem => {
        posArr.push(elem.x, elem.y, elem.z)
      })
      // 创建一个和时间序列相对应的位置坐标系列
      const values = new Float32Array(posArr) // 创建一个帧动画的关键帧数据，曲线上的位置序列对应一个时间序列
      const posTrack = new THREE.KeyframeTrack('Ball.position', times, values)
      const duration = 101
      const clip = new THREE.AnimationClip('default', duration, [posTrack])
      mixer = new THREE.AnimationMixer(Ball)
      const AnimationAction = mixer.clipAction(clip)
      AnimationAction.timeScale = 20
      AnimationAction.play()
    }

    function render () {
      renderer.render(scene, camera)
    }

    function animate () {
      mixer.update(clock.getDelta())
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
