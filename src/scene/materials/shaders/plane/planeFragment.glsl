uniform sampler2D uTexture;
uniform float uUserMousePositionX;
uniform float uUserMousePositionY;

varying vec2 vUv;

void main() {
  vec4 color = texture2D(uTexture, vUv);

  float redChannel = texture2D(uTexture, vUv + vec2(0.05, 0.0)).r;
  float greenChannel = texture2D(uTexture, vUv + vec2(0.02, 0.0)).g;
  float blueChannel = texture2D(uTexture, vUv + vec2(0.01, 0.0)).b;

  color.r += redChannel * uUserMousePositionX * 0.8;
  color.g += greenChannel * uUserMousePositionY * 0.8;
  color.b += blueChannel * uUserMousePositionX * 0.8;

  gl_FragColor = vec4(color.r, color.g,color.b, color.a);
}