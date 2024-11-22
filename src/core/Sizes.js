import Singleton from '@/utils/Singleton.js'

export default class Sizes extends Singleton {
  constructor() {
    super()

    this.width = window.innerWidth
    this.height = window.innerHeight

    window.addEventListener('resize', () => {
      this.width = window.innerWidth
      this.height = window.innerHeight

      if (this.onResize) {
        this.onResize()
      }
    })
  }

  on(callback) {
    this.onResize = callback
  }
}
