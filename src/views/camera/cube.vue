<template>
  <div id="CubeWrap"></div>
</template>

<script>
import * as THREE from 'three'

import { defineComponent, onMounted, onUnmounted } from 'vue'
export default defineComponent({
  name: 'CameraCube',
  setup () {
    let scene, camera, renderer
    let cube, sphere, torus, material
    let count = 0
    let cubeCamera1
    let cubeCamera2
    let cubeRenderTarget1

    let lon = 0; let lat = 0
    let phi = 0; let theta = 0

    function init (texture) {
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.outputEncoding = THREE.sRGBEncoding
      const container = document.getElementById('CubeWrap')
      container.appendChild(renderer.domElement)

      scene = new THREE.Scene()
      scene.background = texture

      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)

      /**
       * 缓冲
       * width - renderTarget 宽
       * height - renderTarget 高
       */
      cubeRenderTarget1 = new THREE.WebGLCubeRenderTarget(256, {
        format: THREE.RGBFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
        encoding: THREE.sRGBEncoding
      })

      cubeCamera1 = new THREE.CubeCamera(1, 1000, cubeRenderTarget1)
      cubeCamera2 = new THREE.CubeCamera(1, 1000, cubeRenderTarget1)

      material = new THREE.MeshBasicMaterial({
        envMap: cubeRenderTarget1.texture,
        combine: THREE.MultiplyOperation,
        reflectivity: 1
      })

      // 球几何体
      sphere = new THREE.Mesh(new THREE.SphereGeometry(20, 20, 20), material)
      scene.add(sphere)

      // 立方几何体
      cube = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), material)
      scene.add(cube)

      // 圆环扭结几何体
      torus = new THREE.Mesh(new THREE.TorusKnotGeometry(10, 5, 128, 16), material)
      scene.add(torus)

      window.addEventListener('resize', onWindowResize)
    }

    function onWindowResize () {
      renderer.setSize(window.innerWidth, window.innerHeight)

      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
    }

    function render () {
      const time = Date.now()

      lon += 0.15
      lat = Math.max(-85, Math.min(85, lat))
      phi = THREE.MathUtils.degToRad(90 - lat)
      theta = THREE.MathUtils.degToRad(lon)

      cube.position.x = Math.cos(time * 0.001) * 30
      cube.position.y = Math.sin(time * 0.001) * 30
      cube.position.z = Math.sin(time * 0.001) * 30

      cube.rotation.x += 0.02
      cube.rotation.y += 0.03

      torus.position.x = Math.cos(time * 0.001 + 10) * 30
      torus.position.y = Math.sin(time * 0.001 + 10) * 30
      torus.position.z = Math.sin(time * 0.001 + 10) * 30

      torus.rotation.x += 0.02
      torus.rotation.y += 0.03

      camera.position.x = 100 * Math.sin(phi) * Math.cos(theta)
      camera.position.y = 100 * Math.cos(phi)
      camera.position.z = 100 * Math.sin(phi) * Math.sin(theta)

      camera.lookAt(scene.position)

      // pingpong
      if (count % 2 === 0) {
        cubeCamera1.update(renderer, scene)
        material.envMap = cubeRenderTarget1.texture
      } else {
        cubeCamera2.update(renderer, scene)
        material.envMap = cubeRenderTarget1.texture
      }

      count++
      renderer.render(scene, camera)
    }

    function animate () {
      requestAnimationFrame(animate)
      render()
    }

    onMounted(() => {
      const textureLoader = new THREE.TextureLoader()
      textureLoader.load('textures/cube/cubeHouse.jpg', texture => {
        /**
         * encoding: 纹理的 encoding 编码
         * sRGBEncoding: 在导入材质时，会默认将贴图编码格式定义为Three.LinearEncoding，故需将带颜色信息的贴图(baseColorTexture, emissiveTexture, 和 specularGlossinessTexture)手动指定为Three.sRGBEncoding
         */
        texture.encoding = THREE.sRGBEncoding
        /**
         * mapping: 图像将如何应用到物体对象上
         * EquirectangularReflectionMapping: 用于等距圆柱投影的环境贴图，也叫经纬线映射贴图
         */
        texture.mapping = THREE.EquirectangularReflectionMapping
        init(texture)
        animate()
      })
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
