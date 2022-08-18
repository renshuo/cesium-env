import * as Cesium from 'cesium';

export enum LightType {
  Sun,
  Moon,
  Flash,
  Direct,
  Color
}


export class CesiumLight {

  viewer: Cesium.Viewer
  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer
  }

  public setLightType(light: LightType) {
    console.log("set map env: light: ", light)
    let scene = this.viewer.scene
    scene.globe.enableLighting = true;
    switch (light) {

      case LightType.Sun: {
        scene.light = new Cesium.SunLight()
        scene.globe.dynamicAtmosphereLighting = true;
        scene.globe.dynamicAtmosphereLightingFromSun = false;
        break;
      }

      case LightType.Moon: {
        scene.light = new Cesium.DirectionalLight({
          direction: this.getMoonDirection(), // Updated every frame
          color: new Cesium.Color(0.9, 0.925, 1.0),
          intensity: 0.5,
        });
        scene.globe.dynamicAtmosphereLightingFromSun = true;
        break;
      }

      case LightType.Flash: {
        scene.light = new Cesium.DirectionalLight({
          direction: scene.camera.directionWC, // Updated every frame
        });
        scene.globe.dynamicAtmosphereLighting = false;
        scene.globe.dynamicAtmosphereLightingFromSun = false;
        break;
      }

      case LightType.Direct: {
        scene.light = new Cesium.DirectionalLight({
          direction: new Cesium.Cartesian3(
            0.2454278300540191,
            0.8842635425193919,
            0.39729481195458805
          ),
        });
        break;
      }

      case LightType.Color: {
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
  private getMoonDirection(result: Cesium.Cartesian3): Cesium.Cartesian3 {
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
