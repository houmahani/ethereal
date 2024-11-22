import * as THREE from 'three'
import Singleton from '@/utils/Singleton.js'
import Camera from '@/core/Camera.js'
import Renderer from '@/core/Renderer.js'
import Sizes from '@/core/Sizes.js'
import Time from '@/core/Time.js'
import Plane from '@/scene/Plane.js'
import { Pane } from 'tweakpane'

export default class Experience extends Singleton {
  constructor(canvas) {
    super()

    if (!canvas) {
      throw new Error('Canvas is required for Experience!')
    }

    this.canvas = canvas

    // Core elements
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new THREE.Scene()
    this.camera = new Camera()
    this.renderer = new Renderer()

    // Debug pane
    this.tweakpane = new Pane()

    // Add obects to the scene
    this.plane = new Plane()

    // Handle resizeing
    this.sizes.on(() => this.resize())

    // Start animation loop
    this.animate()
  }

  resize() {
    // Update camera and renderer on resize
    this.camera.resize()
    this.renderer.resize()
  }

  animate = () => {
    this.update()

    requestAnimationFrame(this.animate)
  }

  update() {
    this.renderer.render()

    this.plane.update()
  }
}
