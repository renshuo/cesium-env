import * as Cesium from 'cesium';



export default class CesiumRain {

  scene: Cesium.Scene

  rain: Cesium.ParticleSystem

  constructor(scene: Cesium.Scene) {
    this.scene = scene
  }


  public setRain(isRain: boolean) {
    console.log('set rain: ', isRain)
    if (isRain) {
      this.startRain()
    } else {
      this.stopRain()
    }
  }

  rainParticleSize = 15.0;
  rainRadius = 100000.0;
  rainImageSize = new Cesium.Cartesian2(
    this.rainParticleSize,
    this.rainParticleSize * 2.0
  );

  private init(): Cesium.ParticleSystem {
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


  stopRain() {
    this.scene.primitives.remove(this.rain)
  }

  startRain() {
    this.scene.globe.depthTestAgainstTerrain = true;
    this.testCamera()
    this.rain = this.init()
    this.scene.primitives.removeAll();
    this.scene.primitives.add(this.rain);
    this.scene.skyAtmosphere.hueShift = -0.97;
    this.scene.skyAtmosphere.saturationShift = 0.25;
    this.scene.skyAtmosphere.brightnessShift = -0.4;
    this.scene.fog.density = 0.00025;
    this.scene.fog.minimumBrightness = 0.01;
  }

  private testCamera() {
    this.scene.camera.setView({
      destination: new Cesium.Cartesian3(
        277096.634865404,
        5647834.481964232,
        2985563.7039122293
      ),
      orientation: {
        heading: 4.731089976107251,
        pitch: -0.32003481981370063,
      },
    });
  }



}
