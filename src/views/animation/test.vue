<template>
  <div id="TestWrap"></div>
</template>

<script lang='ts'>
import * as THREE from 'three'
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils'

import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'test',
  setup () {
    let scene, camera, webGLRenderer
    let spGroup, tubeMesh
    let step = 0
    function init () {
      // create a scene, that will hold all our elements such as objects, cameras and lights.
      scene = new THREE.Scene()

      // create a camera, which defines where we're looking at.
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

      // create a render and set the size
      webGLRenderer = new THREE.WebGLRenderer()
      webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0))
      webGLRenderer.setSize(window.innerWidth, window.innerHeight)
      webGLRenderer.shadowMapEnabled = true

      // position and point the camera to the center of the scene
      camera.position.x = -30
      camera.position.y = 40
      camera.position.z = 50
      camera.lookAt(new THREE.Vector3(10, 0, 0))

      // add the output of the renderer to the html element
      document.getElementById('TestWrap').appendChild(webGLRenderer.domElement)

      // setup the control gui
      var controls = new function () {
        this.numberOfPoints = 5
        this.segments = 64
        this.radius = 1
        this.radiusSegments = 8
        this.closed = false
        this.points = []
        // we need the first child, since it's a multimaterial

        this.newPoints = function () {
          var points = []
          for (var i = 0; i < controls.numberOfPoints; i++) {
            var randomX = -20 + Math.round(Math.random() * 50)
            var randomY = -15 + Math.round(Math.random() * 40)
            var randomZ = -20 + Math.round(Math.random() * 40)

            points.push(new THREE.Vector3(randomX, randomY, randomZ))
          }
          controls.points = points
          controls.redraw()
        }

        this.redraw = function () {
          scene.remove(spGroup)
          scene.remove(tubeMesh)
          generatePoints(controls.points, controls.segments, controls.radius, controls.radiusSegments, controls.closed)
        }
      }()

      controls.newPoints()

      render()

      function generatePoints (points, segments, radius, radiusSegments, closed) {
        // add n random spheres

        spGroup = new THREE.Object3D()
        var material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: false })
        points.forEach(function (point) {
          var spGeom = new THREE.SphereGeometry(0.2)
          var spMesh = new THREE.Mesh(spGeom, material)
          spMesh.position.copy(point)
          spGroup.add(spMesh)
        })
        // add the points as a group to the scene
        scene.add(spGroup)

        // use the same points to create a convexgeometry
        var tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), segments, radius, radiusSegments, closed)
        tubeMesh = createMesh(tubeGeometry)
        scene.add(tubeMesh)
      }

      function createMesh (geom) {
        // assign two materials
        // var meshMaterial = new THREE.MeshNormalMaterial();
        var meshMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.2 })

        var wireFrameMat = new THREE.MeshBasicMaterial()
        wireFrameMat.wireframe = true

        // create a multimaterial
        var mesh = SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat])

        return mesh
      }

      function render () {
        spGroup.rotation.y = step
        tubeMesh.rotation.y = step += 0.01

        // render using requestAnimationFrame
        requestAnimationFrame(render)
        webGLRenderer.render(scene, camera)
      }
    }

    onMounted(() => {
      init()
    })
    return {}
  }
})
</script>
