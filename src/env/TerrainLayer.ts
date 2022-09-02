import { buildModuleUrl, createWorldTerrain, EllipsoidTerrainProvider, ImageryProvider, IonResource, ProviderViewModel, TerrainProvider, Viewer, WebMapServiceImageryProvider } from "cesium";


export default class CesiumTerrainLayer {


  private maps: Map<string, TerrainProvider> = new Map()

  private viewer: Viewer
  constructor(viewer: Viewer) {
    this.viewer = viewer
    this.initLayers()
    this.setLayer("simpleEllipsoid")
  }

  private initLayers() {
    this.addLayer('cesiumTerrain', createWorldTerrain())
    this.addLayer('simpleEllipsoid', new EllipsoidTerrainProvider())
  }


  public addLayer(name: string, map: TerrainProvider) {
    if (this.maps.has(name)) {
      console.warn('there is a layer named: ', name)
    } else {
      this.maps.set(name, map)
    }
  }

  public removeLayer(name: string) {
    this.maps.delete(name)
  }

  public setLayer(layer: string): void {
    if (this.maps.has(layer)) {
      console.log("set terrain layer: ", layer, this.maps.get(layer))
      this.viewer.terrainProvider = this.maps.get(layer)
    } else {
      console.log("no layer: ", layer)
    }
  }

  public getLayers() {
    return Array.from(this.maps.keys())
  }

}
