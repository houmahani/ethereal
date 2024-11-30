uniform sampler2D uTexture;
uniform float uTime;
uniform float uChromaticIntensity;
uniform float uRedOffset;
uniform float uGreenOffset;
uniform float uBlueOffset;
uniform float uDistortionAmplitude;
uniform float uDistortionFrequency;
uniform float uUserMousePositionX;
uniform float uUserMousePositionY;
uniform float uMaskDistortionInnerRadius;
uniform float uMaskDistortionOuterRadius;
uniform float uMaskChromaticInnerRadius;
uniform float uMaskChromaticOuterRadius;
uniform float uNoiseScaleX;
uniform float uNoiseScaleY;


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
 vec2 noiseInput = vec2(
    vUv.x * uDistortionFrequency + uTime, 
    vUv.y * uDistortionFrequency
  );

  // Apply noise to distort the UVs
  float noiseValue = snoise(noiseInput);


  // Use the noise to offset UVs in a smooth, irregular way
  vec2 distortedUvNoise = vec2(
      vUv.x + noiseValue * uNoiseScaleX, 
      vUv.y + noiseValue * uNoiseScaleY
  );

  // Calculate the distance from the distorted mouse position
  vec2 distortedMousePosition = vec2(
      uUserMousePositionX + snoise(vec2(uUserMousePositionX, uTime * 0.02)) * 0.05,
      uUserMousePositionY + sin(vec2(uUserMousePositionY, uTime * 0.02)) * 0.05
  );

  float distance = length(distortedUvNoise - distortedMousePosition);

  float smoothingDistortion = 1.0 - smoothstep(uMaskDistortionInnerRadius, uMaskDistortionOuterRadius, distance);
  float smoothingChromatic = 1.0 - smoothstep(uMaskChromaticInnerRadius, uMaskChromaticOuterRadius, distance);
  
  // Distortion
  float wavyX = smoothingDistortion *  sin(vUv.x * uDistortionFrequency + uTime) * uDistortionAmplitude;
  float wavyY = smoothingDistortion * cos(vUv.y * uDistortionFrequency + uTime)  * uDistortionAmplitude;
  vec2 distortedUv = vUv + vec2(wavyX, wavyY);

  // Chromatic effect with distortion
  vec4 originalImage = texture2D(uTexture, vUv);
  vec4 distortedImage = texture2D(uTexture, distortedUv);
  vec4 blurredImage = texture2D(uTexture, distortedUv + vec2(0.01, 0.01));  // Apply a small offset for blur effect

  // Calculate chromatic offsets for each channel
  float redChannel = smoothingChromatic * texture2D(uTexture, distortedUv + vec2(uRedOffset, 0.0)).r;
  float greenChannel = smoothingChromatic * texture2D(uTexture, distortedUv + vec2(uGreenOffset, 0.0)).g;
  float blueChannel = smoothingChromatic * texture2D(uTexture, distortedUv + vec2(uBlueOffset, 0.0)).b;

  // Blend chromatic shifts with distorted image
  distortedImage.r = mix(distortedImage.r, redChannel, uChromaticIntensity);
  distortedImage.g = mix(distortedImage.g, greenChannel, uChromaticIntensity);
  distortedImage.b = mix(distortedImage.b, blueChannel, uChromaticIntensity);

  // Clamp the distorted image's color channels to avoid artifacts
  distortedImage.r = clamp(distortedImage.r, 0.0, 1.0);
  distortedImage.g = clamp(distortedImage.g, 0.0, 1.0);
  distortedImage.b = clamp(distortedImage.b, 0.0, 1.0);



// Step 1: Apply shimmer only on the chromatic distorted image
vec2 shimmerMovement = vec2(uTime * 0.1, uTime * 0.1);  // Adjust shimmer movement speed
vec2 shimmerInput = distortedUv + shimmerMovement; // Movement for shimmer effect

// Step 2: Create finer noise for shimmer particles
vec2 shimmerNoiseInput = distortedUv * 20.0 + uTime * 0.5; // Higher frequency for particles
float shimmerNoiseValue = snoise(shimmerNoiseInput);  // Apply Perlin noise for randomness

// Step 3: Create particle flicker (shimmer intensity)
float particleFlicker = fract(shimmerNoiseValue * 50.0);  // Flickering effect for particles
float shimmerIntensity = 1.0 + particleFlicker * 0.2; // Shimmer intensity

// Step 4: Apply shimmer effect
vec4 shimmeredDistortedImage = distortedImage * shimmerIntensity;  // Brighten shimmered image

// Step 5: Add a soft blur to create a glow effect
vec4 blurredShimmeredImage = texture2D(uTexture, distortedUv * 1.02);  // Slightly offset UV for blur effect
blurredShimmeredImage *= 0.3;  // Decrease intensity of blur

// Step 6: Combine shimmered image with its blurred version for a glow effect
vec4 glowingShimmer = shimmeredDistortedImage + blurredShimmeredImage;  // Combine shimmer with glow

// Step 7: Final blending (mix with original image and distorted versions)
vec4 finalColor = mix(originalImage, blurredImage, smoothingDistortion * 1.5);  // Original + blurred effect
finalColor = mix(finalColor, glowingShimmer, smoothingDistortion);  // Add glow to the final color

// Step 8: Output the final result
gl_FragColor = finalColor;
}