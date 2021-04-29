import * as THREE from 'three'
import { GPSRelativePosition } from './ThreeBasic'

/**
 * 挤压几何体
 * @param {array} shape
 * @param {object} extrudeSettings
 * @return {array} THREE.Vector3
 */
export function CreateBuildingGeometry (shape, extrudeSettings) {
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
  geometry.computeBoundingBox()

  return geometry
}

/**
 * 绘制形状
 * @param {array} points
 * @param {array} center
 * @return {array} THREE.Vector2
 */
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
