<template>
  <div id="DemoWrap"></div>
</template>

<script>
import * as THREE from 'three'

import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'Demo',
  setup () {
    let scene, camera, renderer, cube

    function init () {
      // step1：创建场景
      scene = new THREE.Scene()
      /**
       * 透视摄像机 PerspectiveCamera
       * 属性一： 视野角度（FOV）：在显示器上所能看到的范围，值为一个角度
       * 属性二：长宽比（aspect ratio）
       * 属性三：远剪切面
       * 属性四：近剪切面 [当物体所在的位置比摄像机的远剪切面远或比近剪切面近时，该超出物体所在的位置将不被渲染到场景中]
       */
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      // 渲染器，当前为 WebGLRenderer 渲染器
      renderer = new THREE.WebGLRenderer()
      // 设置渲染器大小，如果想以较低分别率来渲染，可以设置第三个参数 updateStyle: false
      renderer.setSize(window.innerWidth, window.innerHeight)
      // 将渲染器添加到 dom 中
      const container = document.getElementById('DemoWrap')
      container.appendChild(renderer.domElement)

      // 创建立方体
      var geometry = new THREE.BoxGeometry(1, 1, 1)
      // MeshBasicMaterial 材质 [所有材质都是一个将会被应用于立方体的属性对象]
      var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      // Mesh 网格 [是包含一个几何体以及应用在此几何体上的材质的对象，可直接将网格对象放入到场景中]
      cube = new THREE.Mesh(geometry, material)
      // 默认将添加到坐标(0,0,0)的位置
      scene.add(cube)
      // 摄像机位置默认也为 (0,0,0)，避免与立方体重叠，即位于立方体中，应需将摄像机向外移动
      camera.position.z = 5
    }

    // step2：渲染场景
    function animate () {
      requestAnimationFrame(animate)
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      renderer.render(scene, camera)
    }

    onMounted(() => {
      init()
      animate()
    })
    return {}
  }
})
</script>
