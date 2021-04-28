import * as THREE from 'three'

/**
 * Create a THREE Group
 * @param {String} name Group Name
 * @param {String} displayName Display Name
 * @return {Object} THREE.Group Object
 */
export function AddGroup (name, displayName) {
  const g = new THREE.Group()
  g.name = name
  g.displayName = displayName
  return g
}

/**
 * Mercator projection WGS84 > X,Y
 * @param lat latitude
 * @param lon lontitude
 * @return {object} {x: x, y: y}
 * @public
 */
export function GetXY (lat, lon) {
  var mercator = {}
  var earthRad = 6378137
  mercator.x = lon * Math.PI / 180 * earthRad
  var a = lat * Math.PI / 180
  mercator.y = earthRad / 2 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)))
  return mercator
}

/**
 * GPS to Three World
 * @param {Object} objPosi {lat: Latitude, lon: Longitude}
 * @param {Object} centerPosi {lat: Latitude, lon: Longitude}
 * @return {Array} THREE.Vector3
 */
export function GPSRelativePosition (objPosi, centerPosi) {
  const obj = GetXY(objPosi.latitude, objPosi.longitude)
  const center = GetXY(centerPosi.latitude, centerPosi.longitude)
  return [(center.x - obj.x) / 100, (center.y - obj.y) / 100]
}
