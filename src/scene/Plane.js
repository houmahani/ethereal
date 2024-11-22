import * as THREE from 'three'
import Experience from '@/core/Experience.js'
import planeVertexShader from '@/scene/materials/shaders/plane/planeVertex.glsl'
import planeFragmentShader from '@/scene/materials/shaders/plane/planeFragment.glsl'

export default class Plane {
  constructor() {
    const experience = Experience.getInstance()
    this.scene = experience.scene
    this.sizes = experience.sizes
    this.tweakpane = experience.tweakpane

    this.debugParams = null
    // this.debug()

    this.loadTexture()
    this.createPlane()

    this.userMousePosition = {
      clientX: null,
      clientY: null,
    }

    window.addEventListener('pointermove', (event) => {
      this.userMousePosition.clientX = event.clientX / this.sizes.width
      this.userMousePosition.clientY = event.clientY / this.sizes.height
    })
  }

  loadTexture() {
    this.loader = new THREE.TextureLoader()
    this.texture = this.loader.load('/textures/notre-dame-de-paris.jpg')
    this.texture.wrapS = THREE.RepeatWrapping
    this.texture.wrapT = THREE.RepeatWrapping
  }

  createPlane() {
    const geometry = new THREE.PlaneGeometry(3, 2, 128, 128)
    const material = new THREE.ShaderMaterial({
      vertexShader: planeVertexShader,
      fragmentShader: planeFragmentShader,
      uniforms: {
        uTexture: new THREE.Uniform(this.texture),
        uUserMousePositionX: new THREE.Uniform(0),
        uUserMousePositionY: new THREE.Uniform(0),
      },
    })

    this.mesh = new THREE.Mesh(geometry, material)
    this.scene.add(this.mesh)
  }

  debug() {
    this.debugParams = {
      rotationSpeed: 0.01,
      cubeColor: '#00ff00',
    }

    this.tweakpane.addBinding(this.debugParams, 'rotationSpeed', {
      min: 0,
      max: 0.1,
    })

    this.tweakpane
      .addBinding(this.debugParams, 'cubeColor')
      .on('change', (ev) => {
        this.mesh.material.color.set(ev.value)
      })
  }

  update() {
    this.mesh.material.uniforms.uUserMousePositionX.value =
      this.userMousePosition.clientX
    this.mesh.material.uniforms.uUserMousePositionY.value =
      this.userMousePosition.clientY
  }
}
