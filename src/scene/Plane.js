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
        (event.clientX / this.sizes.width) * 2 - 1 * this.planeAspectRatio
      this.userMousePosition.clientY =
        1 - (event.clientY / this.sizes.height) * this.planeAspectRatio * 2
    })
  }

  loadTexture() {
    this.loader = new THREE.TextureLoader()
    this.texture = this.loader.load('/textures/1.jpg')
    this.texture.wrapS = THREE.RepeatWrapping
    this.texture.wrapT = THREE.RepeatWrapping
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

  debug() {
    const chromaticFolder = this.tweakpane.addFolder({
      title: 'chromatic',
      expanded: false,
    })
    const chromaticColorFolder = chromaticFolder.addFolder({
      title: 'colors',
      expanded: false,
    })
    const chromaticDistortionFolder = chromaticFolder.addFolder({
      title: 'distortion',
      expanded: false,
    })
    const chromaticGlowFolder = chromaticFolder.addFolder({
      title: 'shimmer',
      expanded: false,
    })
    const maskFolder = this.tweakpane.addFolder({
      title: 'shape',
      expanded: false,
    })
    chromaticColorFolder
      .addBlade({
        view: 'slider',
        label: 'intensity',
        min: 0,
        max: 1,
        value: 0.8,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uChromaticIntensity.value = event.value
      }),
      chromaticGlowFolder
        .addBlade({
          view: 'slider',
          label: 'glowIntensity',
          min: 0,
          max: 1,
          value: 0.31,
        })
        .on('change', (event) => {
          this.mesh.material.uniforms.uGlowIntensity.value = event.value
        }),
      chromaticGlowFolder
        .addBlade({
          view: 'slider',
          label: 'noiseIntensity',
          min: 0,
          max: 1,
          value: 0.4,
        })
        .on('change', (event) => {
          this.mesh.material.uniforms.uShimmerNoiseIntensity.value = event.value
        }),
      chromaticColorFolder
        .addBlade({
          view: 'slider',
          label: 'redOffset',
          min: 0,
          max: 0.05,
          value: 0.01,
        })
        .on('change', (event) => {
          this.mesh.material.uniforms.uRedOffset.value = event.value
        })

    chromaticColorFolder
      .addBlade({
        view: 'slider',
        label: 'greenOffset',
        min: 0,
        max: 0.05,
        value: 0.03,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uGreenOffset.value = event.value
      })

    chromaticColorFolder
      .addBlade({
        view: 'slider',
        label: 'blueOffset',
        min: 0,
        max: 0.05,
        value: 0.04,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uBlueOffset.value = event.value
      })

    chromaticDistortionFolder
      .addBlade({
        view: 'slider',
        label: 'amplitude',
        min: 0,
        max: 0.5,
        value: 0.09,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uDistortionAmplitude.value = event.value
      })

    maskFolder
      .addBlade({
        view: 'slider',
        label: 'frequency',
        min: 1,
        max: 10,
        value: 6.0,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uDistortionFrequency.value = event.value
      })

    maskFolder
      .addBlade({
        view: 'slider',
        label: 'innerRadius',
        min: 0,
        max: 1.0,
        value: 0.21,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uMaskDistortionInnerRadius.value =
          event.value
      })

    maskFolder
      .addBlade({
        view: 'slider',
        label: 'outerRadius',
        min: 0,
        max: 1.0,
        value: 0.3,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uMaskDistortionOuterRadius.value =
          event.value
      })

    maskFolder
      .addBlade({
        view: 'slider',
        label: 'innerRadius',
        min: 0,
        max: 1.0,
        value: 0.31,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uMaskChromaticInnerRadius.value =
          event.value
      })

    maskFolder
      .addBlade({
        view: 'slider',
        label: 'outerRadius',
        min: 0,
        max: 1.0,
        value: 0.4,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uMaskChromaticOuterRadius.value =
          event.value
      })

    maskFolder
      .addBlade({
        view: 'slider',
        label: 'noiseScaleX',
        min: 0.0,
        max: 2.0,
        step: 0.01,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uNoiseScaleX.value = event.value
      })

    maskFolder
      .addBlade({
        view: 'slider',
        label: 'noiseScaleY',
        min: 0.0,
        max: 2.0,
        step: 0.01,
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uNoiseScaleY.value = event.value
      })

    this.tweakpane
      .addBinding({ fullEffect: false }, 'fullEffect', {
        view: 'checkbox',
        label: 'fullEffect',
      })
      .on('change', (event) => {
        this.mesh.material.uniforms.uIsFullEffect.value = event.value
      })

    this.tweakpane.addBlade({
      view: 'separator',
    })

    this.tweakpane
      .addButton({
        title: 'Reset',
      })
      .on('click', () => {
        window.location.reload()
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
