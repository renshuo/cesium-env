import * as Cesium from 'cesium';
import {LightType, CesiumLight} from './Light';

import CesiumSnow from './Snow';
import CesiumRain from './Rain';

export {LightType}

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
  private snow: CesiumSnow
  private rain: CesiumRain

  constructor(viewer: Cesium.Viewer, env: {}) {
    this.viewer = viewer
    this.cl = new CesiumLight(viewer)
    this.snow = new CesiumSnow(viewer.scene)
    this.rain = new CesiumRain(viewer.scene)

    Object.assign(this.env, env)
    if (!this.env.showCredit) {
      viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏logo
    }
  }

  /**
    设置是否下雨
  */
  public setRain(isShow: boolean) {
    this.rain.setRain(isShow)
  }
  /**
    设置是否下雪
  */
  public setSnow(isShow: boolean) {
    this.snow.setSnow(isShow)
  }

  /**
     设置光类型
  */
  public setLightType(light: string): void {
    this.cl.setLightType(LightType[light])
  }


  /**
    设置是否显示大气层
  */
  public setAtmosphere(isShow: boolean) {
    console.log('set atmosphere: ', isShow)
    if (isShow === undefined) {
      this.viewer.scene.skyAtmosphere.show = !this.viewer.scene.skyAtmosphere.show
    } else {
      this.viewer.scene.skyAtmosphere.show = isShow
    }
  }

  /** 设置是否显示雾
   */
  public setFog(isShow: boolean): void {
    console.log('set fog: ', isShow)
    if (isShow === undefined) {
      this.viewer.scene.fog.enabled = !this.viewer.scene.fog.enabled
    } else {
      this.viewer.scene.fog.enabled = isShow
    }
  }

  /**
     设置是否启用光照
   */
  public setLighting(isShow: boolean) {
    console.log('set lighting: ', isShow)
    if (isShow === undefined) {
      this.viewer.scene.globe.enableLighting = !this.viewer.scene.globe.enableLighting
    } else {
      this.viewer.scene.globe.enableLighting = isShow
    }
  }

}
