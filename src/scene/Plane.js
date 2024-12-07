import * as THREE from 'three'
import Experience from '@/core/Experience.js'
import planeVertexShader from '@/scene/materials/shaders/plane/planeVertex.glsl'
import planeFragmentShader from '@/scene/materials/shaders/plane/planeFragment.glsl'
import Debug from './Debug.js'

export default class Plane {
  constructor() {
    const experience = Experience.getInstance()
    this.scene = experience.scene
    this.sizes = experience.sizes
    this.time = experience.time
    this.tweakpane = experience.tweakpane

    this.loadTexture()
    this.createPlane()
    this.handleMouse()

    this.debug = new Debug(this.mesh, this.tweakpane)
  }

  handleMouse() {
    this.userMousePosition = {
      clientX: null,
      clientY: null,
    }

    window.addEventListener('pointermove', (event) => {
      this.userMousePosition.clientX =
        (event.clientX / this.sizes.width) * 2 - 1 * this.planeAspectRatio
      this.userMousePosition.clientY =
        1 - (event.clientY / this.sizes.height) * this.planeAspectRatio * 2
    })
  }

  loadTexture() {
    this.loader = new THREE.TextureLoader()
    this.texture = this.loader.load('/textures/1.jpg')
    this.texture.wrapS = THREE.MirroredRepeatWrapping
    this.texture.wrapT = THREE.MirroredRepeatWrapping
  }

  createPlane() {
    const geometry = new THREE.PlaneGeometry(1.6, 2.5, 128, 128)

    this.planeAspectRatio =
      geometry.parameters.width / geometry.parameters.height

    const material = new THREE.ShaderMaterial({
      vertexShader: planeVertexShader,
      fragmentShader: planeFragmentShader,
      uniforms: {
        uTexture: new THREE.Uniform(this.texture),
        uTime: new THREE.Uniform(0),
        uChromaticIntensity: new THREE.Uniform(0.8),
        uRedOffset: new THREE.Uniform(0.01),
        uGreenOffset: new THREE.Uniform(0.03),
        uBlueOffset: new THREE.Uniform(0.04),
        uDistortionAmplitude: new THREE.Uniform(0.09),
        uDistortionFrequency: new THREE.Uniform(1.7),
        uUserMousePositionX: new THREE.Uniform(0),
        uUserMousePositionY: new THREE.Uniform(0),
        uMaskDistortionOuterRadius: new THREE.Uniform(0.3),
        uMaskDistortionInnerRadius: new THREE.Uniform(0.21),
        uMaskChromaticOuterRadius: new THREE.Uniform(0.4),
        uMaskChromaticInnerRadius: new THREE.Uniform(0.31),
        uNoiseScaleX: new THREE.Uniform(0.5),
        uNoiseScaleY: new THREE.Uniform(0.1),
        uIsFullEffect: new THREE.Uniform(false),
        uGlowIntensity: new THREE.Uniform(0.31),
        uShimmerNoiseIntensity: new THREE.Uniform(0.4),
      },
    })

    this.mesh = new THREE.Mesh(geometry, material)
    this.scene.add(this.mesh)
  }

  update() {
    this.mesh.material.uniforms.uTime.value = this.time.elapsed * 0.001
    this.mesh.material.uniforms.uUserMousePositionX.value =
      this.userMousePosition.clientX
    this.mesh.material.uniforms.uUserMousePositionY.value =
      this.userMousePosition.clientY
  }
}
