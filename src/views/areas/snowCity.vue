<template>
  <div id="SnowCityWrap"></div>
</template>

<script>
import * as THREE from 'three'

import { defineComponent, onMounted } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Stats from 'three/examples/jsm/libs/stats.module'

export default defineComponent({
  name: 'SnowCity',
  setup () {
    let camera, scene, renderer, parameters, stats
    const materials = []
    let ambientLight, pointLight
    let textureLine

    function init () {
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000)
      camera.position.z = 1000

      scene = new THREE.Scene()
      // scene.fog = new THREE.FogExp2(0x000000, 0.0008)
      scene.background = new THREE.Color(0x001228)

      ambientLight = new THREE.AmbientLight(0x404040)
      pointLight = new THREE.PointLight(0xffffff, 0.6)
      scene.add(ambientLight)
      scene.add(pointLight)

      const geometry = new THREE.BufferGeometry()
      const vertices = []

      const textureLoader = new THREE.TextureLoader()

      const sprite1 = textureLoader.load('textures/sprites/snowflake1.png')
      const sprite2 = textureLoader.load('textures/sprites/snowflake2.png')
      const sprite3 = textureLoader.load('textures/sprites/snowflake3.png')
      const sprite4 = textureLoader.load('textures/sprites/snowflake4.png')
      const sprite5 = textureLoader.load('textures/sprites/snowflake5.png')

      for (let i = 0; i < 1000; i++) {
        const x = Math.random() * 2000 - 1000
        const y = Math.random() * 2000 - 1000
        const z = Math.random() * 2000 - 1000

        vertices.push(x, y, z)
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

      parameters = [
        [[1.0, 0.2, 0.5], sprite2, 4],
        [[0.95, 0.1, 0.5], sprite3, 3],
        [[0.90, 0.05, 0.5], sprite1, 4],
        [[0.85, 0, 0.5], sprite5, 3],
        [[0.80, 0, 0.5], sprite4, 5]
      ]

      for (let i = 0; i < parameters.length; i++) {
        const color = parameters[i][0]
        const sprite = parameters[i][1]
        const size = parameters[i][2]

        materials[i] = new THREE.PointsMaterial({ size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent: true })
        materials[i].color.setHSL(color[0], color[1], color[2])

        const particles = new THREE.Points(geometry, materials[i])

        particles.rotation.x = Math.random() * 6
        particles.rotation.y = Math.random() * 6
        particles.rotation.z = Math.random() * 6

        scene.add(particles)
      }

      const onProgress = (xhr) => {
        if (xhr.lengthComputable) {
          const percentComplete = (xhr.loaded / xhr.total)
          console.log(percentComplete + '% download')
        }
      }

      const onError = () => {
        console.log('error')
      }

      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x4da1f6,
        transparent: true,
        opacity: 0.2,
        linewidth: 4,
        depthFunc: THREE.AlwaysDepth
      })

      const loader = new GLTFLoader()
      loader.load('models/city.gltf', (gltf) => {
        const elem = gltf.scene
        elem.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = lineMaterial
          }
        })
        elem.scale.set(0.1, 0.1, 0.1)
        elem.position.set(0, 600, 0)
        elem.rotation.set(Math.PI * 0.5, -Math.PI * 0.5, 0)
        scene.add(elem)
      }, onProgress, onError)

      textureLine = new THREE.TextureLoader().load('textures/building/moveLine.png')
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-240, 320, 0),
        new THREE.Vector3(520, 270, 0),
        new THREE.Vector3(320, 0, 0)
      ])

      const tubeGeometry = new THREE.TubeGeometry(curve, 2, 8, 50)
      textureLine.wrapS = THREE.RepeatWrapping
      textureLine.wrapT = THREE.RepeatWrapping
      const tubeMaterial = new THREE.MeshPhongMaterial({
        map: textureLine,
        transparent: true
      })
      const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial)
      scene.add(tubeMesh)

      renderer = new THREE.WebGLRenderer()
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('SnowCityWrap')
      container.appendChild(renderer.domElement)
      container.style.touchAction = 'none'

      stats = new Stats()
      container.appendChild(stats.dom)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.addEventListener('change', render)

      window.addEventListener('resize', onWindowResize)
    }

    function onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    function animate () {
      textureLine.offset.x -= 0.003
      requestAnimationFrame(animate)
      stats.update()
      render()
    }

    function render () {
      const time = Date.now() * 0.00005

      for (let i = 0; i < scene.children.length; i++) {
        const object = scene.children[i]

        if (object instanceof THREE.Points) {
          object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1))
        }
      }

      for (let i = 0; i < materials.length; i++) {
        const color = parameters[i][0]

        const h = (360 * (color[0] + time) % 360) / 360
        materials[i].color.setHSL(h, color[1], color[2])
      }

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
