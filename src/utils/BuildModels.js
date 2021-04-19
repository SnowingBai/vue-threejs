// Import THREE
const THREE = require('three')
const ThreeBasic = require('./ThreeBasic')

function GenBuilding (coordinates, center, height) {
  // // Create Shape
  const shape = GenShape(coordinates, center)

  // Extrude Shape to Geometry
  const geometry = GenBuildingGeometry(shape, {
    curveSegments: 2, // curves
    steps: 1, // subdividing segments
    depth: 0.05 * height, // Height
    bevelEnabled: false // Bevel (round corner)
  })

  // var geometry = new THREE.ShapeBufferGeometry( shape )
  // console.log(geometry)

  return geometry
}

// Render building by geojson->geometry->coordinates points data, a set 2-d array
function GenBuildingGeometry (shape, extrudeSettings) {
  const geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings)
  geometry.computeBoundingBox()

  return geometry
}

function GenShape (points, center) {
  // Create a shape object for create model after
  const shape = new THREE.Shape()

  // Get deeper layer of point data
  for (let ii = 0; ii < points.length; ii++) {
    let elp = points[ii]

    // convert position from the center position
    elp = ThreeBasic.GPSRelativePosition({ latitude: elp[1], longitude: elp[0] }, center)

    // Draw shape
    if (ii === 0) {
      shape.moveTo(elp[0], elp[1])
    } else {
      shape.lineTo(elp[0], elp[1])
    }
  }

  return shape
}

function GenWaterGeometry (shape, config) {
  const geometry = new THREE.ExtrudeBufferGeometry(shape, config)
  geometry.computeBoundingBox()

  return geometry
  // return new THREE.PlaneBufferGeometry(shape)
}

module.exports = {
  GenShape: GenShape,
  GenBuildingGeometry: GenBuildingGeometry,
  GenWaterGeometry: GenWaterGeometry,
  GenBuilding: GenBuilding
}
