uniform float uTime;
uniform float uUserMousePositionX;
uniform float uUserMousePositionY;

varying vec2 vUv;

// Simplex 2D noise
//
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}


void main() {
    // Map the mouse position to [-1, 1] range
    vec2 mousePosition = vec2(uUserMousePositionX * 2.0 , 1.0 - uUserMousePositionY * 2.0);

    // Transform the position to model space
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Calculate distance from the mouse position
    float distance = length(vec2(modelPosition.x, modelPosition.y) - mousePosition);

    // Add smooth noise for more organic movement (use a lower influence here)
    vec2 noiseInput = vec2(modelPosition.x * 1.5 + uTime, modelPosition.y * 0.5 + uTime);
    float noiseValue = snoise(noiseInput) * 0.2; // Reduced noise influence

    // Calculate wave intensity based on distance from the mouse position
    // Using smoothstep to avoid sharp distortions near the mouse
    float waveIntensity = smoothstep(0.0, 1.0, 1.0 - distance);  


    // Apply a smaller scaling factor for a softer effect
    float amplitude = 0.03;  // Reduced amplitude for less intense movement

    // Modify the wave displacement with smoother noise and wave intensity
    modelPosition.x -= sin(modelPosition.y * 1.5 + uTime * 2.0) * waveIntensity * amplitude * (1.0 + noiseValue);
    modelPosition.y -= cos(modelPosition.x * 1.5 - uTime * 2.0) * waveIntensity * amplitude * (1.0 + noiseValue);

    // Convert from model space to view space
    vec4 viewPosition = viewMatrix * modelPosition;

    // Project the position to clip space
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // Set the final position
    gl_Position = projectedPosition;

    // Pass UV coordinates to the fragment shader
    vUv = uv;
}
