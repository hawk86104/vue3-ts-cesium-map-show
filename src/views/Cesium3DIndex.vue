<template>
  <div class="Cesium3DIndex" id="cesiumContainer"></div>
  <ShowLngLat ref="ShowLngLatRef" />
  <ButtonTools ref="ButtonToolsRef" />
</template>
<script lang="ts">
/* eslint-disable no-debugger */
import { GController } from '@/utils/ctrlCesium/Controller'
import { getBaseMapConfig, getBaseMapImageryList } from '@/utils/getFormatData/BaseMap'
import ShowLngLat from '@/components/ShowLngLat.vue' // @ is an alias to /src
import ButtonTools from '@/components/ButtonTools.vue'

declare global {
    interface Window { GController: any; }
}
// declare const Cesium: any
import Titleset from '@/utils/ctrlCesium/Titleset'
import EllipsoidFade from '@/utils/ctrlCesium/effects/EllipsoidFade'
import RaderScan from '@/utils/ctrlCesium/effects/RaderScan'
import CircleWave from '@/utils/ctrlCesium/effects/CircleWave'
import HexagonSpread from '@/utils/ctrlCesium/effects/HexagonSpread'
import SpreadWall from '@/utils/ctrlCesium/effects/SpreadWall'
import Scanline from '@/utils/ctrlCesium/effects/Scanline'
// import Spriteline from '@/utils/ctrlCesium/effects/Spriteline'
import { defineComponent, onBeforeMount, nextTick, ref } from 'vue'

export default defineComponent({
  name: 'Cesium3DIndex',
  components: { ShowLngLat, ButtonTools },
  setup() {
    let viewer = ref<any>()
    const ShowLngLatRef = ref()
    const ButtonToolsRef = ref()

    const initMap = (BaseMapConfig:any, MapImageryList:any) => {
      viewer = GController.init(BaseMapConfig, MapImageryList)
      window.GController = viewer // 全局控制台 调试viewer
      // 显示经纬度绑定事件
      ShowLngLatRef.value.initCesiumHandler(viewer)
      // 飞到配置的坐标
      ButtonToolsRef.value.flyTo()

      // 处理 白膜
      const GTitleset = new Titleset(viewer)
      GTitleset.init()

      // 点扩散
      const GEllipsoidFade = new EllipsoidFade(viewer, 'effect-01')
      GEllipsoidFade.add([113.9303 - 0.02, 22.5216, 8], 'rgba(0,255,0,0.8)', 1000, 3000)

      // RaderScan 雷达扫描
      const GRaderScan = new RaderScan(viewer)
      GRaderScan.add([113.9303 - 0.01, 22.5216, 0], 'rgba(0,255,0,1)', 1000, -0.02)

      // 圈波纹
      const GCircleWave = new CircleWave(viewer, 'effect-01')
      GCircleWave.add([113.9303 + 0.015, 22.5216 + 0.01, 58], 'rgba(0,255,255,1)', 1000, 3000)

      // 六边形
      const GHexagonSpread = new HexagonSpread(viewer, 'effect-02')
      GHexagonSpread.add([113.9303 + 0.015, 22.5216, 58], 'rgba(255,255,0,1)', 500, 3000)

      // 扩散墙
      const GSpreadWall = new SpreadWall(viewer)
      GSpreadWall.add([113.9303 + 0.005, 22.5216 - 0.015, 0], 'rgba(255,0,255,0.5)', 5000, 100, 300)
      GSpreadWall.add([113.9303 - 0.005, 22.5216 - 0.015, 0], 'rgba(18,255,188,0.8)', 1000, 200, 500, 8) // 最后是墙高 和 多边形

      // 线圈扩散效果
      const GScanline = new Scanline(viewer, 'effect-03')
      GScanline.add([113.9303 - 0.01, 22.5216 - 0.020, 0], 'rgba(251,16,55,0.8)', 5000, 3000)

      // 精灵路
      // const GSpriteline = new Spriteline(viewer)
      // GSpriteline.add()
    }
    onBeforeMount(() => {
      nextTick(async () => {
        const BaseMapConfig:any = await getBaseMapConfig()
        const MapImageryList:any = await getBaseMapImageryList()
        initMap(BaseMapConfig, MapImageryList)
      })
    })
    return {
      viewer, ShowLngLatRef, ButtonToolsRef
    }
  },
})
</script>

<style lang="scss" scoped>
.Cesium3DIndex {
  height: 100%;
}
</style>