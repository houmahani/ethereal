import * as THREE from 'three'
import Experience from '@/core/Experience.js'

export default class Cube {
  constructor() {
    const experience = Experience.getInstance()
    this.scene = experience.scene
    this.tweakpane = experience.tweakpane // Use a shared Tweakpane instance
    console.log(this.tweakpane)

    this.debugParams = null
    this.debug()

    this.createCube()
  }

  createCube() {
    // Create geometry and material
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })

    // Create the cube
    this.mesh = new THREE.Mesh(geometry, material)

    // Add the cube to the scene
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
    this.mesh.rotation.x += this.debugParams.rotationSpeed // Use tweakable rotationSpeed
    this.mesh.rotation.y += this.debugParams.rotationSpeed
  }
}
