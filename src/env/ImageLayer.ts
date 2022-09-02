import { BingMapsImageryProvider, BingMapsStyle, buildModuleUrl, ImageryProvider, IonImageryProvider, ProviderViewModel, Viewer, WebMapServiceImageryProvider } from "cesium";


export default class CesiumImageLayer {


  private maps: Map<string, ImageryProvider> = new Map()

  private viewer: Viewer
  constructor(viewer: Viewer) {
    this.viewer = viewer
    this.initLayers()
    this.setLayer("bing")
  }

  private initLayers() {
    this.addLayer("bing", new BingMapsImageryProvider({
      url: 'https://dev.virtualearth.net',
      key: 'AsR3L-kBG0dm9DXvtFIMBZaNqep-4viCvgrSRJIPfHXFcWho6B00Qcf2W7jK_gHp',
      mapStyle: BingMapsStyle.ASERIAL
    }))
    this.addLayer("blueMarble", new IonImageryProvider({
        assetId: 3813,
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0OTU5MmVkZC1iYmQ0LTQ0MGMtYjUxNC1mYWY4MzgzYWM1MzgiLCJpZCI6ODU0MjMsImlhdCI6MTY0Njk4ODAzMX0.wU_rWtMPD8rFSiZxpTpCc5AKWB3e5NDNvJ4RdZsFZT4'
      }))
    this.addLayer("night", new IonImageryProvider({
      assetId: 3812,
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0OTU5MmVkZC1iYmQ0LTQ0MGMtYjUxNC1mYWY4MzgzYWM1MzgiLCJpZCI6ODU0MjMsImlhdCI6MTY0Njk4ODAzMX0.wU_rWtMPD8rFSiZxpTpCc5AKWB3e5NDNvJ4RdZsFZT4'
    }))
    this.addLayer("bingRoad", new IonImageryProvider({
      assetId: 4,
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0OTU5MmVkZC1iYmQ0LTQ0MGMtYjUxNC1mYWY4MzgzYWM1MzgiLCJpZCI6ODU0MjMsImlhdCI6MTY0Njk4ODAzMX0.wU_rWtMPD8rFSiZxpTpCc5AKWB3e5NDNvJ4RdZsFZT4'
    }))
    this.addLayer("bingMap", new IonImageryProvider({
      assetId: 2,
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0OTU5MmVkZC1iYmQ0LTQ0MGMtYjUxNC1mYWY4MzgzYWM1MzgiLCJpZCI6ODU0MjMsImlhdCI6MTY0Njk4ODAzMX0.wU_rWtMPD8rFSiZxpTpCc5AKWB3e5NDNvJ4RdZsFZT4'
    }))
  }

  public addLayer(name: string, map: ImageryProvider) {
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
      let ly = this.viewer.imageryLayers
      ly.removeAll()
      ly.addImageryProvider(this.maps.get(layer))
      console.log("set image layer: ", layer, this.maps.get(layer), ly)
    } else {
      console.log("no layer: ", layer)
    }
  }

  public getLayers() {
    return Array.from(this.maps.keys())
  }

}

