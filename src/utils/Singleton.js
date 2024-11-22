export default class Singleton {
  constructor() {
    if (this.constructor.instance) {
      return this.constructor.instance
    }
    this.constructor.instance = this
  }

  static getInstance() {
    if (!this.instance) {
      throw new Error(`Instance of ${this.name} is not yet created.`)
    }
    return this.instance
  }
}
