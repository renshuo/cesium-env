import * as Cesium from 'cesium';
import {LightType, CesiumLight} from './Light';

import CesiumSnow from './Snow';
import CesiumRain from './Rain';
import CesiumImageLayer from './ImageLayer';
import CesiumTerrainLayer from './TerrainLayer';

export {LightType}

export default class CesiumEnv {

  private env = {
    isRain: false,
    isSnow: false,
    isFog: false,

    showAir: true,
    showLight: true,
    lightType: 'Sun',

    showCredit: false,

    mapMode: '3D',
  }

  private viewer: Cesium.Viewer
  private cl: CesiumLight
  private snow: CesiumSnow
  private rain: CesiumRain

  /* 影像底图类*/
  public imageLayer: CesiumImageLayer
  /* 地形底图类*/
  public terrainLayer: CesiumTerrainLayer

  constructor(viewer: Cesium.Viewer, env: {}) {
    this.viewer = viewer
    this.cl = new CesiumLight(viewer)
    this.snow = new CesiumSnow(viewer.scene)
    this.rain = new CesiumRain(viewer.scene)
    this.imageLayer = new CesiumImageLayer(viewer)
    this.terrainLayer = new CesiumTerrainLayer(viewer)

    Object.assign(this.env, env)
    this.setRain(this.env.isRain)
    this.setSnow(this.env.isSnow)
    this.setFog(this.env.isFog)

    this.setAtmosphere(this.env.showAir)
    this.setLighting(this.env.showLight)
    this.setLightType(this.env.lightType)

    if (!this.env.showCredit) {
      viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏logo
    }

    this.setMapMode(this.env.mapMode)
  }

  public test(isTest: boolean) {
    
  }
  /**
    设置是否下雨
  */
  public setRain(isShow: boolean) {
    this.rain.setRain(isShow)
  }

  public toggleRain() {
    this.rain.toggleRain()
  }

  /**
    设置是否下雪
  */
  public setSnow(isShow: boolean) {
    this.snow.setSnow(isShow)
  }

  public toggleSnow() {
    this.snow.toggleSnow()
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

  /** 设置光类型
  */
  public setLightType(light: string): void {
    this.cl.setLightType(LightType[light])
  }

  /** 设置是否显示大气层
  */
  public setAtmosphere(isShow: boolean) {
    console.log('set atmosphere: ', isShow)
    this.viewer.scene.skyAtmosphere.show = isShow
  }

  /** 设置是否显示雾
   */
  public setFog(isShow: boolean): void {
    console.log('set fog: ', isShow)
    this.viewer.scene.fog.enabled = isShow
  }

  /** 设置地图模式
  */
  public setMapMode(mapMode: string): void {
    console.log("set map mode : ", mapMode)
    switch(mapMode) {
      case "2D":
        this.viewer.scene.morphTo2D(2.0)
        break
      case "3D":
        this.viewer.scene.morphTo3D(2.0)
        break
      case "co":
        this.viewer.scene.morphToColumbusView(2.0)
        break
      default:
        console.error("invalid mode: ", mapMode)
    }
  }

}
