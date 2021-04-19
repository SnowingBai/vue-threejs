<template>
  <div id="MineWrap"></div>
</template>
<!-- 矿山 -->
<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import { vertexShader, fragmentShader } from './mineShader/lines'

import { defineComponent, onMounted, onUnmounted } from 'vue'
export default defineComponent({
  name: 'Mine',
  setup () {
    let scene, camera, renderer, controls
    let model
    let selectObject, intersects
    let boxLine
    let next = 0
    let isIncress = true
    // let gui

    const excludes = ['1_2', '2_1', '科技线条', '平面2', '管道', '中间件_1', '2_2', '立方体3', '立方体', '立方体7', '立方体7_01', '立方体1_1', '立方体7_0', '扫描1_2', '扫描_1', '立方体2_1', '扫描1_3']
    const carElem = ['扫描1_4', '扫描1_5', '扫描1_6', '扫描1_7', '扫描1_8']
    const fenceArr = ['110', '10', '1', '17']
    const baseplates = ['立方体8', '立方体9', '1_3', '11', '19', '18', '16', '14', '13', '12', '管道1', '15', '立方体17', '扫描1_3', '立方体2', '铁轨物体', '立方体3_1', '立方体23', '立方体22', '立方体21']
    const boxLines = ['圆柱体2', '圆柱体1', '立方体13', '立方体12', '立方体11', '立方体10', '立方体16', '立方体15', '立方体14']
    const boxes = ['立方体20', '立方体4', '立方体3', '立方体', '立方体18', '立方体19']
    const slotColor = ['集装箱1', '立方体2_1', '立方体1', '立方体1_1', '立方体_1', '立方体_2']
    const towers = ['1_1', '2', '水塔']
    const windowColors = ['立方体6', '立方体5']
    const roofBoxs = ['圆柱体', '圆柱体_1', '支柱1', '扫描2', '立方体1_2', '支柱', '扫描_2', '立方体_3']
    const roofs = ['球体', '球体1']
    const hideArr = ['地面', '平面1', '平面2']

    function init () {
      scene = new THREE.Scene()
      // scene.fog = new THREE.FogExp2(0x000000, 0.0004)
      console.log('常用 GLSL 代码片段')
      console.log(THREE.ShaderChunk)
      console.log('常用制服定义')
      console.log(THREE.UniformsLib)
      console.log('着色器定义')
      console.log(THREE.ShaderLib)

      // camera
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
      camera.position.set(1, 1, 1100)
      camera.lookAt(new THREE.Vector3(0, 0, 0))

      // light
      const dirLight = new THREE.DirectionalLight(0xffffff)
      dirLight.position.set(0, 20, 0)
      scene.add(dirLight)
      const pointLight = new THREE.PointLight(0xffffff, 1)
      pointLight.position.set(0, 150, 300)
      scene.add(pointLight)

      // material
      // const green = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      const shelf = new THREE.MeshPhysicalMaterial({ color: 0x444539 })
      const carHandle = new THREE.MeshPhysicalMaterial({ color: 0xd7d5c1 })
      const carThr = new THREE.MeshPhysicalMaterial({ color: 0x2d2e1f })
      const carShanye = new THREE.MeshPhysicalMaterial({ color: 0x6a6948 })
      const carSlot = new THREE.MeshPhysicalMaterial({
        color: 0x696d57,
        metalness: 1.0,
        roughness: 0.8
      })
      const carTop = new THREE.MeshPhysicalMaterial({ color: 0xaca693 })
      // 河流
      const track = new THREE.MeshBasicMaterial({ color: 0x84d6e9 })
      // boxLine = new THREE.MeshBasicMaterial({ color: 0xfff298 })
      // 围栏
      const fence = new THREE.MeshBasicMaterial({ color: 0xf69f0f })
      // 发光底盘
      const baseplate = new THREE.MeshPhongMaterial({
        color: 0xeb870e,
        opacity: 0.4,
        shininess: 4
      })
      // 发光盒子
      const box = new THREE.MeshPhongMaterial({
        color: 0xbbaa99,
        emissive: 0xbbaa99,
        specular: 0x22842c,
        shininess: 10,
        flatShading: true,
        transparent: true,
        opacity: 0.5
      })
      // 塔
      const tower = new THREE.TextureLoader().load('/textures/car/metal.jpg')

      // 架子
      const frames = new THREE.MeshPhysicalMaterial({ color: 0x969786 })
      // 管道
      const pipeline = new THREE.MeshPhysicalMaterial({ color: 0x716c5a })
      // 窗口
      const windowColor = new THREE.MeshBasicMaterial({ color: 0xe6e6d9 })
      // 屋顶盒子
      const roofBox = new THREE.MeshBasicMaterial({ color: 0x161814 })
      // 屋顶
      const roof = new THREE.MeshPhysicalMaterial({
        color: 0xc9c7b4,
        metalness: 1.0, // 与金属相似度
        roughness: 0.56 // 粗糙程度 0: 镜面反射 1: 漫反射
      })
      // 机械车
      const vehicle = new THREE.MeshPhysicalMaterial({
        color: 0x313227,
        metalness: 1.0,
        roughness: 0.56
      })
      // 地板
      const groundTexture = new THREE.TextureLoader().load('textures/ground.png')
      groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping
      groundTexture.repeat.set(2.2, 2.2)

      // 矿山
      const hill = new THREE.MeshPhysicalMaterial({
        color: 0x2d2d2d,
        metalness: 1.0,
        roughness: 0.56
      })

      // const boxLine = new THREE.ShaderMaterial({
      //   uniforms: {},
      //   vertexShader: document.getElementById('vertexShader').textContent,
      //   fragmentShader: document.getElementById('fragmentShader').textContent,
      //   side: THREE.BackSide,
      //   blending: THREE.AdditiveBlending,
      //   transparent: true
      // })

      // const boxLine = new THREE.ShaderMaterial({
      //   uniforms:
      //   {
      //     s: { type: 'f', value: -1.0 },
      //     b: { type: 'f', value: 5.0 },
      //     p: { type: 'f', value: 2.0 },
      //     glowColor: { type: 'c', value: new THREE.Color(0xf5e265) }
      //   },
      //   vertexShader: document.getElementById('vertexShader').textContent,
      //   fragmentShader: document.getElementById('fragmentShader').textContent,
      //   side: THREE.DoubleSide,
      //   blending: THREE.AdditiveBlending,
      //   transparent: true
      // })

      boxLine = new THREE.RawShaderMaterial({
        uniforms: {
          ratio: {
            value: 0.0
          }
        },
        vertexShader,
        fragmentShader
      })

      // model
      const loader = new GLTFLoader()
      loader.load('models/mine.gltf', gltf => {
        model = gltf.scene
        model.traverse(child => {
          if (child instanceof THREE.Mesh) {
            if (
              !excludes.includes(child.name) &&
              !carElem.includes(child.name) &&
              !fenceArr.includes(child.name) &&
              !baseplates.includes(child.name) &&
              !boxLines.includes(child.name) &&
              !boxes.includes(child.name) &&
              !slotColor.includes(child.name) &&
              !windowColors.includes(child.name) &&
              !roofBoxs.includes(child.name) &&
              !towers.includes(child.name) &&
              !roofs.includes(child.name) &&
              !hideArr.includes(child.name) &&
              child.name.indexOf('钉柱') === -1 &&
              child.name.indexOf('右把手') === -1 &&
              child.name.indexOf('角架') === -1 &&
              child.name.indexOf('螺丝钉') === -1 &&
              child.name.indexOf('三角铁') === -1 &&
              child.name.indexOf('方铁条') === -1 &&
              child.name.indexOf('轮毂') === -1 &&
              child.name.indexOf('方柱') === -1 &&
              child.name.indexOf('轮轴') === -1 &&
              child.name.indexOf('中梁') === -1 &&
              child.name.indexOf('中方柱') === -1 &&
              child.name.indexOf('底盘') === -1 &&
              child.name.indexOf('扇页') === -1 &&
              child.name.indexOf('货斗') === -1 &&
              child.name.indexOf('立方体4') === -1 &&
              child.name.indexOf('立方体7') === -1
            ) {
              // console.log(child)
            }

            if (child.name === '立方体7_01' || child.name === '立方体7_0') {
              child.material = shelf
            }

            if (
              child.name.indexOf('右把手') > -1 ||
              child.name.indexOf('钉柱') > -1 ||
              child.name.indexOf('螺丝钉') > -1 ||
              child.name.indexOf('三角铁') > -1
            ) {
              child.material = carHandle
            }

            if (
              child.name.indexOf('角架') > -1 ||
              child.name.indexOf('方铁条') > -1 ||
              child.name.indexOf('轮毂') > -1 ||
              child.name.indexOf('方柱') > -1 ||
              child.name.indexOf('轮轴') > -1 ||
              child.name.indexOf('中梁') > -1 ||
              child.name.indexOf('中方柱') > -1 ||
              child.name.indexOf('底盘') > -1 ||
              carElem.includes(child.name)
            ) {
              child.material = carThr
            }

            if (child.name === '扇页') {
              child.material = carShanye
            }

            if (child.name.indexOf('货斗') > -1 || slotColor.includes(child.name)) {
              child.material = carSlot
            }

            if (child.name === '扫描1_2' || child.name === '扫描_1') {
              child.material = track
            }

            if (child.name.indexOf('立方体4_') > -1 || child.name === '立方体7') {
              child.material = carTop
            }

            if (fenceArr.includes(child.name)) {
              child.material = fence
            }

            if (baseplates.includes(child.name)) {
              child.material = baseplate
            }

            if (boxes.includes(child.name)) {
              child.material = box
            }

            if (boxLines.includes(child.name)) {
              child.material = boxLine
            }

            if (towers.includes(child.name)) {
              child.material.map = tower
            }

            // 金属材质
            if (child.name === '1_2' || child.name === '2_1') {
              child.material = hill
            }

            if (child.name.indexOf('立方体7') > -1) {
              child.material = frames
            }

            if (child.name === '管道' || child.name === '中间件_1') {
              child.material = pipeline
            }

            if (windowColors.includes(child.name)) {
              child.material = windowColor
            }

            if (roofBoxs.includes(child.name)) {
              child.material = roofBox
            }

            if (roofs.includes(child.name)) {
              child.material = roof
            }

            if (child.name === '2_2') {
              child.material = vehicle
            }

            if (child.name === '科技线条') {
              child.material = new THREE.MeshPhongMaterial({
                map: groundTexture,
                reflectivity: 1
              })
            }

            if (hideArr.includes(child.name)) {
              child.material.visible = false
            }
          }
        })

        model.position.set(-100, 100, 0)
        model.rotation.set(Math.PI * 0.1, Math.PI * 0.3, 0)
        scene.add(model)
      })

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('MineWrap')
      container.appendChild(renderer.domElement)

      controls = new OrbitControls(camera, renderer.domElement)
      // 开启旋转有惯性
      controls.enableDamping = true
      // 最大 vertical 旋转角度
      controls.maxPolarAngle = Math.PI * 0.5
      // 相机最近/最远距离
      controls.minDistance = 1000
      controls.maxDistance = 2000
      controls.addEventListener('change', render)

      window.addEventListener('resize', onWindowResize)
      window.addEventListener('dblclick', onMouseDblclick, false)
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
      // enableDamping: true 时需更新
      controls.update()
      requestAnimationFrame(animate)

      if (isIncress) {
        next += 0.01
        if (next > 2) {
          isIncress = false
        }
      } else {
        next -= 0.01
        if (next < 0) {
          isIncress = true
        }
      }

      boxLine.uniforms.ratio.value = next
      render()
    }

    function onMouseDblclick (event) {
      // 获取 raycaster 和所有模型相交的数组，其中的元素按照距离排序
      intersects = getIntersects(event)
      if (intersects.length !== 0 && intersects[0].object instanceof THREE.Mesh) {
        selectObject = intersects[0].object
        console.log(selectObject.name)
      } else {
        console.log('未选中 Mesh')
      }
    }

    // 获取与射线相交的对象数组
    function getIntersects (event) {
      event.preventDefault()

      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      // 通过鼠标点击的位置和当前相机的矩阵计算出射线位置
      raycaster.setFromCamera(mouse, camera)

      intersects = raycaster.intersectObjects(model.children)
      return intersects
    }

    // function buildGui () {
    //   gui = new GUI()
    //   const params = {
    //     'light color': pointLight.color.getHex(),
    //     'light positionX': pointLight.position.x,
    //     'light positionY': pointLight.position.y,
    //     'light positionZ': pointLight.position.z
    //   }

    //   gui.addColor(params, 'light color').onChange((val) => {
    //     pointLight.color.setHex(val)
    //     render()
    //   })

    //   gui.add(params, 'light positionX', -1000, 1000).onChange((val) => {
    //     pointLight.position.x = val
    //     render()
    //   })

    //   gui.add(params, 'light positionY', -1000, 1000).onChange((val) => {
    //     pointLight.position.y = val
    //     render()
    //   })

    //   gui.add(params, 'light positionZ', -1000, 1000).onChange((val) => {
    //     pointLight.position.z = val
    //     render()
    //   })

    //   gui.open()
    // }

    onMounted(() => {
      init()
      animate()
      // buildGui()
    })

    onUnmounted(() => {
      const gl = document.getElementById('MineWrap')
      gl && gl.getExtension('WEBGL_lose_context').loseContext()
    })
    return {}
  }
})
</script>
