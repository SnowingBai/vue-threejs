<template>
  <div id="MirrorWrap"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ReflectorRTT } from 'three/examples/jsm/objects/ReflectorRTT'
import {
  NodeFrame,
  ExpressionNode,
  PhongNodeMaterial,
  MathNode,
  OperatorNode,
  TextureNode,
  BlurNode,
  FloatNode,
  ReflectorNode,
  SwitchNode,
  NormalMapNode
} from 'three/examples/jsm/nodes/Nodes'

import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'Mirror',
  setup () {
    const decalNormal = new THREE.TextureLoader().load('textures/decal/decal-normal.jpg')
    const decalDiffuse = new THREE.TextureLoader().load('textures/decal/decal-diffuse.png')
    decalDiffuse.wrapS = decalDiffuse.wrapT = THREE.RepeatWrapping

    let camera, scene, renderer
    const clock = new THREE.Clock()

    let cameraControls

    let sphereGroup
    let groundMirrorMaterial

    const frame = new NodeFrame()

    let groundMirror
    let blurMirror

    function init () {
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500)
      camera.position.set(0, 75, 160)

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('MirrorWrap')
      container.appendChild(renderer.domElement)

      cameraControls = new OrbitControls(camera, renderer.domElement)
      cameraControls.target.set(0, 40, 0)
      cameraControls.maxDistance = 400
      cameraControls.minDistance = 10
      cameraControls.update()

      window.addEventListener('resize', onWindowResize)
    }

    function render () {
      renderer.render(scene, camera)
    }

    function onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      renderer.setSize(window.innerWidth, window.innerHeight)

      groundMirror.getRenderTarget().setSize(
        window.innerWidth * window.devicePixelRatio,
        window.innerHeight * window.devicePixelRatio
      )

      blurMirror.size.set(
        window.innerWidth * window.devicePixelRatio,
        window.innerHeight * window.devicePixelRatio
      )
      blurMirror.updateFrame()
    }

    function fillScene () {
      const planeGeo = new THREE.PlaneGeometry(100.1, 100.1)

      let geometry, material

      // reflector/mirror plane
      geometry = new THREE.PlaneGeometry(100, 100)
      groundMirror = new ReflectorRTT(geometry, {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio
      })

      const mask = new SwitchNode(new TextureNode(decalDiffuse), 'w')

      const mirror = new ReflectorNode(groundMirror)

      const normalMap = new TextureNode(decalNormal)
      const normalXY = new SwitchNode(normalMap, 'xy')
      const normalXYFlip = new MathNode(
        normalXY,
        MathNode.INVERT
      )

      const offsetNormal = new OperatorNode(
        normalXYFlip,
        new FloatNode(0.5),
        OperatorNode.SUB
      )

      mirror.offset = new OperatorNode(
        offsetNormal, // normal
        new FloatNode(6), // scale
        OperatorNode.MUL
      )

      blurMirror = new BlurNode(mirror)
      blurMirror.size = new THREE.Vector2(
        window.innerWidth * window.devicePixelRatio,
        window.innerHeight * window.devicePixelRatio
      )
      blurMirror.uv = new ExpressionNode('projCoord.xyz / projCoord.q', 'vec3')
      blurMirror.uv.keywords.projCoord = new OperatorNode(mirror.offset, mirror.uv, OperatorNode.ADD)
      blurMirror.radius.x = blurMirror.radius.y = 0

      groundMirrorMaterial = new PhongNodeMaterial()
      groundMirrorMaterial.environment = blurMirror // or add "mirror" variable to disable blur
      groundMirrorMaterial.environmentAlpha = mask
      groundMirrorMaterial.normal = new NormalMapNode(normalMap)

      const mirrorMesh = new THREE.Mesh(planeGeo, groundMirrorMaterial)
      // add all alternative mirror materials inside the ReflectorRTT to prevent:
      // glDrawElements: Source and destination textures of the draw are the same.
      groundMirror.add(mirrorMesh)
      groundMirror.rotateX(-Math.PI / 2)
      scene.add(groundMirror)

      sphereGroup = new THREE.Object3D()
      scene.add(sphereGroup)

      geometry = new THREE.SphereGeometry(15, 24, 24, Math.PI / 2, Math.PI * 2, 0, Math.PI / 180 * 120)
      const halfSphere = new THREE.Mesh(geometry, material)
      halfSphere.rotateX(-Math.PI / 180 * 135)
      halfSphere.rotateZ(-Math.PI / 180 * 20)
      halfSphere.position.y = 7.5 + 15 * Math.sin(Math.PI / 180 * 30)

      sphereGroup.add(halfSphere)

      // lights
      const mainLight = new THREE.PointLight(0xcccccc, 1.5, 250)
      mainLight.position.y = 60
      scene.add(mainLight)
    }

    function update () {
      requestAnimationFrame(update)

      const delta = clock.getDelta()
      frame.update(delta).updateNode(groundMirrorMaterial)

      render()
    }

    onMounted(() => {
      init()
      fillScene()
      update()
    })
    return {}
  }
})
</script>
