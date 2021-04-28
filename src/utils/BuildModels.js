// Import THREE
import * as THREE from 'three'
import { GPSRelativePosition } from './ThreeBasic'

export function CreateBuildingGeometry (shape, extrudeSettings) {
  const geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings)
  geometry.computeBoundingBox()

  return geometry
}

export function CreateShape (points, center) {
  const shape = new THREE.Shape()

  for (let i = 0; i < points.length; i++) {
    let point = points[i]

    // convert position from the center position
    point = GPSRelativePosition({ longitude: point[0], latitude: point[1] }, center)

    if (i === 0) {
      shape.moveTo(point[0], point[1])
    } else {
      shape.lineTo(point[0], point[1])
    }
  }

  return shape
}
