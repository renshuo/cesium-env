import * as Cesium from 'cesium';

export enum Light {
  SunLight,
  moonLight,
  FlashLight,
  DirectLight,
  ColorLight
}

export default class CesiumEnv {

  private env = {
    isRain: false,
    isSnow: false,
    isFog: false,
    showConstellation: false,
    showAir: false,
    showLight: false,

    showCredit: false,
  }

  private viewer: Cesium.Viewer
  constructor(viewer: Cesium.Viewer, env: {}) {
    this.viewer = viewer
    Object.assign(this.env, env)
    if (!this.env.showCredit) {
      viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏logo
    }
  }

  public toggleRain(isRain: boolean): void {
    console.log("toggle rain", isRain)
  }

  public setLight(light: Light) {
    console.log("set map env: light: ", light)
    let scene = this.viewer.scene
    scene.globe.enableLighting = true;
    switch (Light[light]) {

      case Light.SunLight: {
        scene.light = new Cesium.SunLight()
        scene.globe.dynamicAtmosphereLighting = true;
        scene.globe.dynamicAtmosphereLightingFromSun = false;
        break;
      }

      case Light.MoonLight: {
        scene.light = new Cesium.DirectionalLight({
          direction: this.getMoonDirection(), // Updated every frame
          color: new Cesium.Color(0.9, 0.925, 1.0),
          intensity: 0.5,
        });
        scene.globe.dynamicAtmosphereLightingFromSun = true;
        break;
      }

      case Light.FlashLight: {
        scene.light = new Cesium.DirectionalLight({
          direction: scene.camera.directionWC, // Updated every frame
        });
        scene.globe.dynamicAtmosphereLighting = false;
        scene.globe.dynamicAtmosphereLightingFromSun = false;
        break;
      }

      case Light.DirectLight: {
        scene.light = new Cesium.DirectionalLight({
          direction: new Cesium.Cartesian3(
            0.2454278300540191,
            0.8842635425193919,
            0.39729481195458805
          ),
        });
        break;
      }

      case Light.ColorLight: {
        scene.light = new Cesium.DirectionalLight({
          direction: new Cesium.Cartesian3(
            -0.2454278300540191,
            0.8842635425193919,
            0.39729481195458805
          ),
          color: Cesium.Color.fromCssColorString("#deca7c"),
        });
        break;
      }

      default: {
        scene.light = new Cesium.SunLight();
        scene.globe.dynamicAtmosphereLighting = true;
        scene.globe.dynamicAtmosphereLightingFromSun = false;
      }
    }
  }

  private scratchIcrfToFixed = new Cesium.Matrix3();
  private scratchMoonPosition = new Cesium.Cartesian3();
  private scratchMoonDirection = new Cesium.Cartesian3();
  private getMoonDirection(result) {
    result = Cesium.defined(result) ? result : new Cesium.Cartesian3();
    const icrfToFixed = this.scratchIcrfToFixed;
    const date = this.viewer.clock.currentTime;
    if (
      !Cesium.defined(
        Cesium.Transforms.computeIcrfToFixedMatrix(date, icrfToFixed)
      )
    ) {
      Cesium.Transforms.computeTemeToPseudoFixedMatrix(date, icrfToFixed);
    }
    const moonPosition = Cesium.Simon1994PlanetaryPositions.computeMoonPositionInEarthInertialFrame(
      date,
      this.scratchMoonPosition
    );
    Cesium.Matrix3.multiplyByVector(
      icrfToFixed,
      moonPosition,
      moonPosition
    );
    const moonDirection = Cesium.Cartesian3.normalize(
      moonPosition,
      this.scratchMoonDirection
    );
    return Cesium.Cartesian3.negate(moonDirection, result);
  }
}
