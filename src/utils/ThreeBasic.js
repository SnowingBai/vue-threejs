const THREE = require('three')
const Coordinate = require('./Coordinate')

/**
 * Func: Create a THREE Group
 *
 * @param {String} name Group Name
 * @param {String} displayName Display Name
 *
 * @return {Object} THREE.Group Object
 */
function AddGroup (name, displayName) {
  const g = new THREE.Group(); g.name = name; g.displayName = displayName; return g
}

/**
 * Func: GPS to Three World
 *
 * @param {Object} objPosi {lat: Latitude, lon: Longitude}
 * @param {Object} centerPosi {lat: Latitude, lon: Longitude}
 *
 * @return {Array} THREE.Vector3
 */

// 地图投影世界上没有完美计算方法，数字地图通用的是墨卡托投影法，但墨卡托投影法计算消耗太高。1和3都能用，3不精确，1比较均衡

// 1. WGS84 通过距离和角度，三角函数计算三角边，稍微快点
// function GPSRelativePosition(objPosi, centerPosi){

//     // Get GPS distance
//     let dis = GEOLIB.getDistance({ latitude: objPosi.lat, longitude: objPosi.lon}, {latitude: centerPosi.lat, longitude: centerPosi.lon})

//     // Get bearing angle
//     let bearing = GEOLIB.getRhumbLineBearing({ latitude: objPosi.lat, longitude: objPosi.lon}, {latitude: centerPosi.lat, longitude: centerPosi.lon})

//     // Calculate X by centerPosi.x + distance * cos(rad)
//     let x = centerPosi.lon + (dis * Math.cos(bearing * Math.PI / 180))

//     // Calculate Y by centerPosi.y + distance * sin(rad)
//     let y = centerPosi.lat + (dis * Math.sin(bearing * Math.PI / 180))

//     // Reverse X (it work)
//     return [x/100, y/100]
// }

// 2. 墨卡托投影计算法 性能消耗极高，精确
function GPSRelativePosition (objPosi, centerPosi) {
  const obj = Coordinate.GetXY(objPosi.latitude, objPosi.longitude)
  const center = Coordinate.GetXY(centerPosi.latitude, centerPosi.longitude)
  // console.log([(centerPosi.x - objPosi.x)/100, (centerPosi.y - objPosi.y)/100])
  return [(center.x - obj.x) / 100, (center.y - obj.y) / 100]
}

// 3. 直接相对位置计算法，忽略弧度不做投影，能用，整个斜的
// function GPSRelativePosition(objPosi = [0,0], centerPosi = [0,0]){
//     return [(centerPosi[0] - objPosi[0])*1000, (centerPosi[1] - objPosi[1])*1000]
//     //return [(objPosi[0]-centerPosi[0])*1000, (objPosi[1]-centerPosi[1])*1000]
// }

module.exports = {
  AddGroup: AddGroup,
  GPSRelativePosition: GPSRelativePosition
}
