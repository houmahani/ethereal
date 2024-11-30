import * as THREE from 'three'
import Experience from '@/core/Experience.js'
import planeVertexShader from '@/scene/materials/shaders/plane/planeVertex.glsl'
import planeFragmentShader from '@/scene/materials/shaders/plane/planeFragment.glsl'

export default class Plane {
  constructor() {
    const experience = Experience.getInstance()
    this.scene = experience.scene
    this.sizes = experience.sizes
    this.time = experience.time
    this.tweakpane = experience.tweakpane

    this.debugParams = null
    this.debug()

    this.loadTexture()
    this.createPlane()

    this.userMousePosition = {
      clientX: null,
      clientY: null,
    }

    window.addEventListener('pointermove', (event) => {
      this.userMousePosition.clientX =
        (event.clientX / this.sizes.width) * 1.8 - 1 * this.planeAspectRatio
      this.userMousePosition.clientY =
        1 - (event.clientY / this.sizes.height) * this.planeAspectRatio * 1.8
    })
  }

  loadTexture() {
    this.loader = new THREE.TextureLoader()
    this.texture = this.loader.load('/textures/1.jpg')
    this.texture.wrapS = THREE.RepeatWrapping
    this.texture.wrapT = THREE.RepeatWrapping
  }

  createPlane() {
    const geometry = new THREE.PlaneGeometry(1.8, 2.8, 128, 128)
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
      },
    })

    this.mesh = new THREE.Mesh(geometry, material)
    this.scene.add(this.mesh)
  }

  debug() {
    this.tweakpane
      .addBlade({
        view: 'slider',
        label: 'uChromaticIntensity',
        min: 0,
        max: 1,
        value: 0.8,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uChromaticIntensity.value = event.value
      })

    this.tweakpane
      .addBlade({
        view: 'slider',
        label: 'uRedOffset',
        min: 0,
        max: 0.05,
        value: 0.01,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uRedOffset.value = event.value
      })

    this.tweakpane
      .addBlade({
        view: 'slider',
        label: 'uGreenOffset',
        min: 0,
        max: 0.05,
        value: 0.03,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uGreenOffset.value = event.value
      })

    this.tweakpane
      .addBlade({
        view: 'slider',
        label: 'uBlueOffset',
        min: 0,
        max: 0.05,
        value: 0.04,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uBlueOffset.value = event.value
      })

    this.tweakpane
      .addBlade({
        view: 'slider',
        label: 'uDistortionAmplitude',
        min: 0,
        max: 0.5,
        value: 0.09,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uDistortionAmplitude.value = event.value
      })

    this.tweakpane
      .addBlade({
        view: 'slider',
        label: 'uDistortionFrequency',
        min: 1,
        max: 10,
        value: 6.0,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uDistortionFrequency.value = event.value
      })

    this.tweakpane
      .addBlade({
        view: 'slider',
        label: 'uMaskDistortionInnerRadius',
        min: 0,
        max: 1.0,
        value: 0.21,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uMaskDistortionInnerRadius.value =
          event.value
      })

    this.tweakpane
      .addBlade({
        view: 'slider',
        label: 'uMaskDistortionOuterRadius',
        min: 0,
        max: 1.0,
        value: 0.3,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uMaskDistortionOuterRadius.value =
          event.value
      })

    this.tweakpane
      .addBlade({
        view: 'slider',
        label: 'uMaskChromaticInnerRadius',
        min: 0,
        max: 1.0,
        value: 0.31,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uMaskChromaticInnerRadius.value =
          event.value
      })

    this.tweakpane
      .addBlade({
        view: 'slider',
        label: 'uMaskChromaticOuterRadius',
        min: 0,
        max: 1.0,
        value: 0.4,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uMaskChromaticOuterRadius.value =
          event.value
      })

    this.tweakpane
      .addBlade({
        view: 'slider',
        label: 'uNoiseScaleX',
        min: 0.0,
        max: 2.0,
        step: 0.01,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uNoiseScaleX.value = event.value
      })

    this.tweakpane
      .addBlade({
        view: 'slider',
        label: 'uNoiseScaleY',
        min: 0.0,
        max: 2.0,
        step: 0.01,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uNoiseScaleY.value = event.value
      })
  }

  update() {
    this.mesh.material.uniforms.uTime.value = this.time.elapsed * 0.00001
    this.mesh.material.uniforms.uUserMousePositionX.value =
      this.userMousePosition.clientX
    this.mesh.material.uniforms.uUserMousePositionY.value =
      this.userMousePosition.clientY
  }
}
