<template>
  <div style="position: relative">
    <div style="position: fixed; z-index: 10; left: 20px; top: 20px; color: white">
      <!-- <button class="tbt" @click="">大气层</button> -->


      <input type="checkbox" v-model="envOpt.showLight" @click="setLighting"/><label>光照</label>
      <select v-model="envOpt.lightType" @change="setLightType">
        <option label="日光" value="Sun" />
        <option label="月光" value="Moon" />
        <option label="亮光" value="Flash" />
        <option label="直接光" value="Direct" />
        <option label="RGB光" value="Color" />
      </select>
      <input type="checkbox" v-model="envOpt.showAir" @click="setAtmosphere" /><label>大气层</label>
      <br />

      <input type="checkbox" v-model="envOpt.isRain" @click="setRain" /><label>雨</label>
      <input type="checkbox" v-model="envOpt.isSnow" @click="setSnow" /><label>雪</label>
      <input type="checkbox" v-model="envOpt.isFog" @click="setFog"/><label>雾</label>
      <br />

      <select v-model="envOpt.mapMode" @change="setMode">
        <option label="2D" value="2D" />
        <option label="3D" value="3D" />
        <option label="2.5D" value="co" />
      </select>

      <select v-model="envOpt.imageLayer" @change="setImageLayer" >
        <option v-for="l in envOpt.imageLayers" :key="l" :label="l" :value="l" />
      </select>
      <select v-model="envOpt.terrainLayer" @change="setTerrainLayer">
        <option v-for="l in envOpt.terrainLayers" :key="l" :label="l" :value="l" />
      </select>

    </div>

    <div id="mapContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
window.CESIUM_BASE_URL = "/Cesium";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

import CesiumEnv from './env/index.ts'

const env = ref()

const envOpt = ref({
  isRain: false,
  isSnow: false,
  isFog: true,

  showAir: true,
  showLight: true,
  lightType: 'Sun',

  showCredit: false,

  mapMode: '3D',
  imageLayer: 'default',
  imageLayers: [],
  terrainLayer: 'default',
  terrainLayers: [],
})
function setRain() {
  env.value.setRain(!envOpt.value.isRain)
}

function setSnow() {
  env.value.setSnow(!envOpt.value.isSnow)
}

function setLightType() {
  env.value.setLightType(envOpt.value.lightType)
}

function setLighting() {
  env.value.setLighting(!envOpt.value.showLight)
}

function setFog() {
  env.value.setFog(!envOpt.value.isFog)
}

function setAtmosphere(){
  env.value.setAtmosphere(!envOpt.value.showAir)
}

function setMode(){
  env.value.setMapMode(envOpt.value.mapMode)
}

function setImageLayer() {
  env.value.imageLayer.setLayer(envOpt.value.imageLayer)
}
function setTerrainLayer() {
  env.value.terrainLayer.setLayer(envOpt.value.terrainLayer)
}

onMounted(() => {
  Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNWY5YzhhMS05ZmYxLTQ5NzgtOTcwNC0zZmViNGFjZjc4ODEiLCJpZCI6ODU0MjMsImlhdCI6MTY0Njk4ODA1NX0.4-plF_5ZfEMMpHqJyefkDCFC8JWkFw39s3yKVcNg55c";
  Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
    100,
    30,
    110,
    40
  );
  let viewer = new Cesium.Viewer("mapContainer", {
    infoBox: false, //是否显示信息框
    selectionIndicator: false, //是否显示选取指示器组件
    timeline: false, //是否显示时间轴
    animation: false, //是否创建动画小器件，左下角仪表
    sceneModePicker: false,
    shouldAnimate: true,
  });

  env.value = new CesiumEnv(viewer, envOpt.value)

  viewer.scene.camera.setView({
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
  envOpt.value.imageLayers = env.value.imageLayer.getLayers()
  envOpt.value.terrainLayers = env.value.terrainLayer.getLayers()

});
</script>

<style>
.tbt {
  border: 1px solid blue;
  background: transparent;
  background-color: rgba(80,80,80, 0.7);
  border-radius: 2px;
  margin: 1px 2px;
  padding: 2px 8px;
  min-width: 90px;
  font-size: 14px;
  line-height: 16px;
  color: #00ff00;
}
</style>
