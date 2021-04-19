export const vertexShader = `
  precision mediump float;
  precision mediump int;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  attribute vec3 position;
  varying vec3 vPosition;

  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`

export const fragmentShader = `
  precision mediump float;
  precision mediump int;
  uniform float ratio;
  varying vec3 vPosition;

  void main() {
    vec3 center = vec3( 0.0,0.0,0.0 );
    float dist=  distance(vPosition,center)/100.0;
    dist = clamp(dist,0.0,1.0);
    float color = 1.0-dist ;
    gl_FragColor =  vec4( color*ratio, color*ratio,0.0,dist );
  }
`
