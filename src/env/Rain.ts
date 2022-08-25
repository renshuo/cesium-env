import * as Cesium from 'cesium';



export default class CesiumRain {

  scene: Cesium.Scene

  rain: Cesium.ParticleSystem | undefined

  constructor(scene: Cesium.Scene) {
    this.scene = scene
  }

  public setRain(isRain: boolean) {
    console.log('set rain: ', isRain)
    if (isRain) {
      this.start()
    } else {
      this.stop()
    }
  }

  public toggleRain() {
    if (this.rain) {
      this.stop()
    } else {
      this.start()
    }
  }

  private stop() {
    if (this.rain) {
      this.scene.primitives.remove(this.rain)
      this.rain = undefined
    } else {
      console.log('no rain')
    }
  }

  private start() {
    if (this.rain) {
      console.log("rain setted")
    } else {
      this.scene.globe.depthTestAgainstTerrain = true;
      this.rain = this.init()
      //this.scene.primitives.removeAll();
      this.scene.primitives.add(this.rain);
      //this.setRainAtmosphere()
    }
  }

  rainParticleSize = 15.0;
  rainRadius = 100000.0;
  rainImageSize = new Cesium.Cartesian2(
    this.rainParticleSize,
    this.rainParticleSize * 2.0
  );

  private init(): Cesium.ParticleSystem {
    console.log("init rain")
    return new Cesium.ParticleSystem({
      modelMatrix: new Cesium.Matrix4.fromTranslation(this.scene.camera.position),
      speed: -1.0,
      lifetime: 15.0,
      emitter: new Cesium.SphereEmitter(this.rainRadius),
      startScale: 1.0,
      endScale: 0.0,
      image: "/circular_particle.png",
      emissionRate: 9000.0,
      startColor: new Cesium.Color(0.27, 0.5, 0.7, 0.0),
      endColor: new Cesium.Color(0.27, 0.5, 0.7, 0.98),
      imageSize: this.rainImageSize,
      updateCallback: (particle, dt) => {
        let rainGravityScratch = new Cesium.Cartesian3();
        rainGravityScratch = Cesium.Cartesian3.normalize(particle.position, rainGravityScratch);
        rainGravityScratch = Cesium.Cartesian3.multiplyByScalar(rainGravityScratch, -1050.0, rainGravityScratch);
        particle.position = Cesium.Cartesian3.add(
          particle.position,
          rainGravityScratch,
          particle.position
        );

        const distance = Cesium.Cartesian3.distance(
          this.scene.camera.position,
          particle.position
        );
        if (distance > this.rainRadius) {
          particle.endColor.alpha = 0.0;
        } else {
          particle.endColor.alpha =
            Cesium.Color.BLUE.alpha / (distance / this.rainRadius + 0.1);
        }
      }
    })
  }

  private setRainAtmosphere() {
    this.scene.skyAtmosphere.hueShift = -0.97;
    this.scene.skyAtmosphere.saturationShift = 0.25;
    this.scene.skyAtmosphere.brightnessShift = -0.4;
    this.scene.fog.density = 0.00025;
    this.scene.fog.minimumBrightness = 0.01;
  }
}
