uniform sampler2D uTexture;
uniform float uTime;
uniform float uChromaticIntensity;
uniform float uGlowIntensity;
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
uniform float uShimmerNoiseIntensity;
uniform bool uIsFullEffect;

varying vec2 vUv;

#include ./includes/simplex2DNoise.glsl

void main() {
  // Noise and distortion
  vec2 noiseInput = vec2(vUv.x * uDistortionFrequency + uTime * 0.002, vUv.y * uDistortionFrequency);
  float noiseValue = snoise(noiseInput);
  vec2 distortedUv = vUv + noiseValue * vec2(uNoiseScaleX, uNoiseScaleY);

  // Mouse interaction
  vec2 distortedMousePosition = vec2(
      uUserMousePositionX + snoise(vec2(uUserMousePositionX, uTime * 0.002)) * 0.5,
      uUserMousePositionY + sin(uUserMousePositionY + uTime * 0.002) * 0.0
  );

  // Distance-based masks
  float distance = length(distortedUv - distortedMousePosition);
  float smoothingDistortion = uIsFullEffect 
    ? 1.0 
    : 1.0 - smoothstep(uMaskDistortionInnerRadius, uMaskDistortionOuterRadius, distance);
  float smoothingChromatic = uIsFullEffect 
    ? 1.0 
    : 1.0 - smoothstep(uMaskChromaticInnerRadius, uMaskChromaticOuterRadius, distance);

  
  // Wavy Distortion
  float wavyX = smoothingDistortion * sin(vUv.x * uDistortionFrequency + uTime * 0.02) * uDistortionAmplitude;
  float wavyY = smoothingDistortion * cos(vUv.y * uDistortionFrequency + uTime * 0.002) * uDistortionAmplitude;
  vec2 finalUv = vUv + vec2(wavyX, wavyY);

  /*
  * Chromatic aberration
  */ 
  vec4 originalImage = texture2D(uTexture, vUv);
  vec4 distortedImage = texture2D(uTexture, finalUv);
  float redChannel = smoothingChromatic * texture2D(uTexture, finalUv + vec2(uRedOffset, 0.0)).r;
  float greenChannel = smoothingChromatic * texture2D(uTexture, finalUv + vec2(uGreenOffset, 0.0)).g;
  float blueChannel = smoothingChromatic * texture2D(uTexture, finalUv + vec2(uBlueOffset, 0.0)).b;

  // Blend chromatic shifts with distorted image
  distortedImage.r = mix(distortedImage.r, redChannel, uChromaticIntensity);
  distortedImage.g = mix(distortedImage.g, greenChannel, uChromaticIntensity);
  distortedImage.b = mix(distortedImage.b, blueChannel, uChromaticIntensity);

  // Clamp the distorted image's color channels
  distortedImage.r = clamp(distortedImage.r, 0.0, 1.0);
  distortedImage.g = clamp(distortedImage.g, 0.0, 1.0);
  distortedImage.b = clamp(distortedImage.b, 0.0, 1.0);
  
  // Shimmer effect
  vec2 shimmerInput = finalUv * 20.0 + uTime * 0.001;
  float shimmerNoise = snoise(shimmerInput);
  float particleFlicker = fract(shimmerNoise * 50.0); 
  float shimmerIntensity = 1.0 + particleFlicker * uShimmerNoiseIntensity;
  vec4 shimmeredImage = distortedImage * shimmerIntensity;

  // Glow
  vec4 blurredShimmer = texture2D(uTexture, finalUv * 1.02) * uGlowIntensity;
  vec4 glowingShimmer = shimmeredImage + blurredShimmer;

  // Output
  vec4 finalColor = mix(originalImage, distortedImage, smoothingDistortion * 1.5);  
  finalColor = mix(finalColor, glowingShimmer, smoothingDistortion); 

  gl_FragColor = finalColor;
}