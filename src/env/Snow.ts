import * as Cesium from 'cesium';
import img from './snowflake_particle.png'

export default class CesiumSnow {

  scene: Cesium.Scene

  snow: Cesium.ParticleSystem | undefined

  constructor(scene: Cesium.Scene) {
    this.scene = scene
  }

  public setSnow(isSnow: boolean) {
    console.log('set snow: ', isSnow)
    if (isSnow) {
      this.start()
    } else {
      this.stop()
    }
  }

  public toggleSnow() {
    if (this.snow) {
      this.stop()
    } else {
      this.start()
    }
  }

  private stop() {
    if (this.snow) {
      this.scene.primitives.remove(this.snow)
    } else {
      console.log("no snow")
    }
  }

  private start() {
    if (this.snow) {
      console.log("snow setted")
    }
    this.scene.globe.depthTestAgainstTerrain = true;
    this.snow = this.init()
    // this.scene.primitives.removeAll();
    this.scene.primitives.add(this.snow);
    //this.setSnowAtmosphere()
  }

  snowParticleSize = 12.0;
  snowRadius = 100000.0;
  minimumSnowImageSize = new Cesium.Cartesian2(
    this.snowParticleSize,
    this.snowParticleSize
  );
  maximumSnowImageSize = new Cesium.Cartesian2(
    this.snowParticleSize * 2.0,
    this.snowParticleSize * 2.0
  );


  private init(): Cesium.ParticleSystem {
    return new Cesium.ParticleSystem({
      modelMatrix: new Cesium.Matrix4.fromTranslation(this.scene.camera.position),
      minimumSpeed: -1.0,
      maximumSpeed: 0.0,
      lifetime: 15.0,
      emitter: new Cesium.SphereEmitter(this.snowRadius),
      startScale: 0.5,
      endScale: 1.0,
      image: img,
      emissionRate: 7000.0,
      startColor: Cesium.Color.WHITE.withAlpha(0.0),
      endColor: Cesium.Color.WHITE.withAlpha(1.0),
      minimumImageSize: this.minimumSnowImageSize,
      maximumImageSize: this.maximumSnowImageSize,
      updateCallback: (particle, dt) => {
        let snowGravityScratch = new Cesium.Cartesian3();
        snowGravityScratch = Cesium.Cartesian3.normalize(
          particle.position,
          snowGravityScratch
        );
        Cesium.Cartesian3.multiplyByScalar(
          snowGravityScratch,
          Cesium.Math.randomBetween(-30.0, -300.0),
          snowGravityScratch
        );
        particle.velocity = Cesium.Cartesian3.add(particle.velocity, snowGravityScratch, particle.velocity);
        const distance = Cesium.Cartesian3.distance(this.scene.camera.position, particle.position);
        if (distance > this.snowRadius) {
          particle.endColor.alpha = 0.0;
        } else {
          particle.endColor.alpha = 1.0 / (distance / this.snowRadius + 0.1);
        }
      }
    })
  }

  private setSnowAtmosphere() {
    this.scene.skyAtmosphere.hueShift = -0.8;
    this.scene.skyAtmosphere.saturationShift = -0.7;
    this.scene.skyAtmosphere.brightnessShift = -0.33;
    this.scene.fog.density = 0.001;
    this.scene.fog.minimumBrightness = 0.8;
  }

}
