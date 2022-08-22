# cesium-env
简单配置cesium的环境，包括光照，天气，大气层，以及地图转换。


# 引入
``` typescript
import CesiumnEnv from 'cesium-env';
```

# 初始化
```typescript
  let env = new CesiumEnv(viewer, {})
```


# 功能
## 更改光照
```typescript
  env.setLighting(true) // 是否启用光照
  env.setLightType(lightType) //更改光照类型
```


## 更改天气
```typescript
  env.setSnow(true) // 下雪
  env.setRain(true) // 下雨
  env.setFog(true) // 雾
```

## 大气层
```typescript
  env.setAtmosphere(true) //显示大气层
```

## 改变地图模式
```typescript
  env.setMapMode(mapMode) // 3D地图
```
mapMode取值为：
``` 
3D, 2D, co
```
co是2.5D模式的地图
