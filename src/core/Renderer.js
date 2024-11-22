import * as THREE from 'three'
import Singleton from '@/utils/Singleton.js'
import Experience from '@/core/Experience.js'

export default class Renderer extends Singleton {
  constructor() {
    super()

    const experience = Experience.getInstance()
    this.canvas = experience.canvas
    this.scene = experience.scene
    this.camera = experience.camera.instance

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
    this.renderer.setClearColor(0xd9d9d9)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }
}
