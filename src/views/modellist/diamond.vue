<template>
  <div id="DiamondWrap"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'Diamond',
  setup () {
    let scene, camera, renderer
    let gemBackMaterial, gemFrontMaterial
    let hdrCubeRenderTarget
    const objects = []
    const autoRotate = false

    function init () {
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0x000000)

      camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000)
      camera.position.set(0, -10, 20 * 3.5)

      renderer = new THREE.WebGLRenderer({ antialias: true })

      // 背部材质
      gemBackMaterial = new THREE.MeshPhysicalMaterial({
        map: null,
        color: 0x008800,
        metalness: 1,
        roughness: 0,
        opacity: 0.5,
        side: THREE.BackSide,
        transparent: true,
        envMapIntensity: 5,
        premultipliedAlpha: true,
        reflectivity: 1
      })

      // 前部材质
      gemFrontMaterial = new THREE.MeshPhysicalMaterial({
        map: null,
        color: 0x008800,
        metalness: 0, // 与金属相似度 0 - 1 非金属 - 金属
        roughness: 0, // 粗糙程度 0 - 1 镜面反射 - 漫反射
        opacity: 0.25,
        side: THREE.FrontSide, // 渲染哪一面
        transparent: true, // 材质是否透明
        envMapIntensity: 10, // 通过乘以环境贴图的颜色来缩放环境贴图的效果
        premultipliedAlpha: true, // 是否预乘 alpha
        reflectivity: 1 // 折射率，默认 1.5
      })

      const manager = new THREE.LoadingManager()
      manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total)
      }

      const loader = new OBJLoader(manager)
      loader.load('models/emerald.obj', obj => {
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = gemBackMaterial
            const second = child.clone()
            second.material = gemFrontMaterial

            const parent = new THREE.Group()
            parent.add(second)
            parent.add(child)
            scene.add(parent)

            objects.push(parent)
          }
        })
      })

      const pmremGenerator = new THREE.PMREMGenerator(renderer)
      // 预编译球面投影着色器（通过在纹理的网格获取期间调用此方法以提高并发性，可以加快启动速度）
      pmremGenerator.compileEquirectangularShader()

      new RGBELoader()
        .setDataType(THREE.UnsignedByteType) // 无符号型
        .load('textures/royal_esplanade_1k.hdr', (hdrEquirect) => {
          hdrCubeRenderTarget = pmremGenerator.fromEquirectangular(hdrEquirect)
          pmremGenerator.dispose()

          gemFrontMaterial.envMap = gemBackMaterial.envMap = hdrCubeRenderTarget.texture
          gemFrontMaterial.needsUpdate = gemBackMaterial.needsUpdate = true
          hdrEquirect.dispose()
        })

      // light
      scene.add(new THREE.AmbientLight(0x222222))

      const pointLight1 = new THREE.PointLight(0xffffff)
      pointLight1.position.set(150, 10, 0)
      pointLight1.castShadow = false
      scene.add(pointLight1)

      const pointLight2 = new THREE.PointLight(0xffffff)
      pointLight2.position.set(-150, 0, 0)
      scene.add(pointLight2)

      const pointLight3 = new THREE.PointLight(0xffffff)
      pointLight3.position.set(0, -10, -150)
      scene.add(pointLight3)

      const pointLight4 = new THREE.PointLight(0xffffff)
      pointLight4.position.set(0, 0, 150)
      scene.add(pointLight4)

      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('DiamondWrap')
      container.appendChild(renderer.domElement)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.addEventListener('change', render)

      renderer.outputEncoding = THREE.sRGBEncoding

      window.addEventListener('resize', onWindowResize)
    }

    function render () {
      renderer.toneMappingExposure = 1.0
      camera.lookAt(scene.position)
      if (autoRotate) {
        for (let i = 0; i < objects.length; i++) {
          const object = objects[i]
          object.rotation.y += 0.005
        }
      }
      renderer.render(scene, camera)
    }

    function animate () {
      requestAnimationFrame(animate)
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

<style lang='less' scoped>
</style>
