export default class Debug {
  constructor(mesh, tweakpane) {
    this.mesh = mesh
    this.tweakpane = tweakpane

    this.initFolders()
    this.initControls()
  }

  initFolders() {
    this.chromaticFolder = this.tweakpane.addFolder({
      title: 'chromatic',
      expanded: false,
    })

    this.chromaticColorFolder = this.chromaticFolder.addFolder({
      title: 'colors',
      expanded: false,
    })

    this.chromaticDistortionFolder = this.chromaticFolder.addFolder({
      title: 'distortion',
      expanded: false,
    })

    this.chromaticGlowFolder = this.chromaticFolder.addFolder({
      title: 'shimmer',
      expanded: false,
    })

    this.maskFolder = this.tweakpane.addFolder({
      title: 'shape',
      expanded: false,
    })
  }

  initControls() {
    this.chromaticColorFolder
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
      this.chromaticGlowFolder
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
      this.chromaticGlowFolder
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
      this.chromaticColorFolder
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

    this.chromaticColorFolder
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

    this.chromaticColorFolder
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

    this.chromaticDistortionFolder
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

    this.maskFolder
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

    this.maskFolder
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

    this.maskFolder
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

    this.maskFolder
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

    this.maskFolder
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

    this.maskFolder
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

    this.maskFolder
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
}
