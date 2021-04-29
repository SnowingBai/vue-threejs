import * as THREE from 'three'

/**
 * Create a THREE Group
 * @param {string} name
 * @param {string} displayName
 * @return {object} THREE.Group Object
 */
export function AddGroup (name, displayName) {
  const g = new THREE.Group()
  g.name = name
  g.displayName = displayName
  return g
}

/**
 * 墨卡托坐标
 * @param lat latitude
 * @param lon lontitude
 * @return {object} {x, y}
 */
export function GetMercator (lat, lon) {
  var mercator = {}
  var earthRad = 6378137
  mercator.x = lon * Math.PI / 180 * earthRad
  var a = lat * Math.PI / 180
  mercator.y = earthRad / 2 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)))
  return mercator
}

/**
 * 相对中心点坐标
 * @param {object} objPosi {latitude, longitude}
 * @param {object} centerPosi {latitude, longitude}
 * @return {array} THREE.Vector3
 */
export function GPSRelativePosition (objPosi, centerPosi) {
  const obj = GetMercator(objPosi.latitude, objPosi.longitude)
  const center = GetMercator(centerPosi.latitude, centerPosi.longitude)
  return [(center.x - obj.x) / 100, (center.y - obj.y) / 100]
}
