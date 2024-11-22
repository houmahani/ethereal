import * as THREE from 'three'
import Singleton from '@/utils/Singleton.js'
import Experience from '@/core/Experience.js'

export default class Camera extends Singleton {
  constructor() {
    super()

    const experience = Experience.getInstance()
    this.sizes = experience.sizes

    this.instance = new THREE.PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.1,
      1000
    )
    this.instance.position.z = 2
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }
}
