import * as Cesium from 'cesium';
import {Light, CesiumLight} from './Light';

export {Light}

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
  private cl: CesiumLight
  constructor(viewer: Cesium.Viewer, env: {}) {
    this.viewer = viewer
    this.cl = new CesiumLight(viewer)
    Object.assign(this.env, env)
    if (!this.env.showCredit) {
      viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏logo
    }
  }

  public toggleRain(isRain: boolean): void {
    console.log("toggle rain", isRain)
  }

  public setLight(light: string): void {
    this.cl.setLight(Light[light])
  }

  public setAtmosphere(isShow: boolean) {
    console.log('set atmosphere: ', isShow)
    if (isShow === undefined) {
      this.viewer.scene.skyAtmosphere.show = !this.viewer.scene.skyAtmosphere.show
    } else {
      this.viewer.scene.skyAtmosphere.show = isShow
    }
  }
}
