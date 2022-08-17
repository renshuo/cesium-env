<template>
  <div style="position: relative">
    <div style="position: fixed; z-index: 10; left: 20px; top: 20px">
      <!-- <button class="tbt" @click="">大气层</button> -->

      <input type="checkbox" /><label>光照</label>

      <select v-model="light" @change="setLight">
        <option label="日光" value="SunLight" />
        <option label="月光" value="MoonLight" />
        <option label="亮光" value="FlashLight" />
        <option label="直接光" value="DirectLight" />
        <option label="RGB光" value="ColorLight" />
      </select>
      <input type="checkbox" @click="env.toggleRain" /><label>雨</label>
      <input type="checkbox" /><label>雪</label>
      <input type="checkbox" /><label>雾</label>

      <input type="checkbox" /><label>星座</label>
      <input type="checkbox" /><label>光照</label>
      <input type="checkbox" /><label>大气层</label>

      <br />
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
import { Light } from './env/index.ts'


const env = ref()

const light = ref()
function setLight() {
  env.value.setLight(light.value)
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
    timeline: true, //是否显示时间轴
    animation: true, //是否创建动画小器件，左下角仪表
  });

  env.value = new CesiumEnv(viewer, {
  })

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
