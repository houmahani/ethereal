import Tweakpane from 'tweakpane'

export default class Pane {
  constructor() {
    this.pane = new Tweakpane()
  }

  addFolder(name) {
    return this.pane.addFolder({ title: name })
  }

  getInstance() {
    return this.pane
  }
}
