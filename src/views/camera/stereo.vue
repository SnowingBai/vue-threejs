<template>
  <div id="StereoWrap"></div>
</template>

<script>
import * as THREE from 'three'
// import { StereoEffect } from 'three/examples/jsm/effects/StereoEffect.js'

import { defineComponent, onMounted, onUnmounted } from 'vue'
export default defineComponent({
  name: 'CameraStereo',
  setup () {
    let scene, camera, renderer
    // let effect
    const spheres = []
    let mouseX = 0
    let mouseY = 0
    let windowHalfX = window.innerWidth / 2
    let windowHalfY = window.innerHeight / 2

    function init () {
      const container = document.getElementById('StereoWrap')

      /**
       * camera
       * @param {number} fov 视椎体垂直视野角度
       * @param {number} aspect 视椎体长宽比
       * @param {number} near 视椎体近端面
       * @param {number} far 视椎体远端面
       */
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000)
      camera.position.z = 3200

      scene = new THREE.Scene()
      // CubeTextureLoader 立方纹理，右 6 个纹理组合而成，每个纹理都是立方体的一面
      scene.background = new THREE.CubeTextureLoader()
        .setPath('textures/cube/Park3Med/')
        .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'])

      // SphereGeometry 球体
      const geometry = new THREE.SphereGeometry(100, 32, 16)
      const textureCube = new THREE.CubeTextureLoader()
        .setPath('textures/cube/Park3Med/')
        .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'])
      /**
       * mapping -- 图像纹理将如何应用到物体对象上
       * CubeRefractionMapping -- cubeTexture 立方纹理映射模式
       */
      textureCube.mapping = THREE.CubeRefractionMapping

      /**
       * envMap: TextureCube -- 环境贴图
       * refractionRatio -- 空气折射率（默认值0.98），越趋近 1 越透明，需与环境映射模式 CubeRefractionMapping
       */
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        envMap: textureCube,
        refractionRatio: 0.95
      })

      for (let i = 0; i < 500; i++) {
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.x = Math.random() * 10000 - 5000
        mesh.position.y = Math.random() * 10000 - 5000
        mesh.position.z = Math.random() * 10000 - 5000
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1

        scene.add(mesh)
        spheres.push(mesh)
      }

      renderer = new THREE.WebGLRenderer()
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      container.appendChild(renderer.domElement)

      // 双屏渲染
      // effect = new StereoEffect(renderer)
      // effect.setSize(window.innerWidth, window.innerHeight)

      document.addEventListener('mousemove', onDocumentMouseMove)
      window.addEventListener('resize', onWindowResize)
    }

    function render () {
      const timer = 0.0001 * Date.now()

      camera.position.x += (mouseX - camera.position.x) * 0.05
      camera.position.y += (-mouseY - camera.position.y) * 0.05
      // lookAt(vector: Vector3): null 旋转物体使其在世界空间中面朝一个点
      camera.lookAt(scene.position)

      for (let i = 0; i < spheres.length; i++) {
        const sphere = spheres[i]
        sphere.position.x = 5000 * Math.cos(timer + i)
        sphere.position.y = 5000 * Math.sin(timer + i * 1.1)
      }

      // effect.render(scene, camera)
      renderer.render(scene, camera)
    }

    function animate () {
      requestAnimationFrame(animate)
      render()
    }

    function onDocumentMouseMove (event) {
      mouseX = (event.clientX - windowHalfX) * 10
      mouseY = (event.clientY - windowHalfY) * 10
    }

    function onWindowResize () {
      windowHalfX = window.innerWidth / 2
      windowHalfY = window.innerHeight / 2

      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      renderer.setSize(window.innerWidth, window.innerHeight)
      // effect.setSize(window.innerWidth, window.innerHeight)
    }

    onMounted(() => {
      init()
      animate()
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
