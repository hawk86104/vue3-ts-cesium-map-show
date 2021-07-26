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
import CircleDiffusion from '@/utils/ctrlCesium/effects/CircleDiffusion'
import CircleScan from '@/utils/ctrlCesium/effects/CircleScan'
import CircleWave from '@/utils/ctrlCesium/effects/CircleWave'
import HexagonSpread from '@/utils/ctrlCesium/effects/HexagonSpread'
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
      const GCircleDiffusion = new CircleDiffusion(viewer)
      GCircleDiffusion.add([113.9303, 22.5216, 0], 'rgba(0,255,0,1)', 1000, 3000)

      // 雷达扫描
      const GCircleScan = new CircleScan(viewer)
      GCircleScan.add([113.9303 - 0.01, 22.5216, 0], 'rgba(0,255,0,1)', 1000, 3000)

      // 圈波纹
      const GCircleWave = new CircleWave(viewer)
      GCircleWave.add([113.9303 + 0.015, 22.5216 + 0.01, 58], 'rgba(0,255,255,1)')

      // 六边形
      const GHexagonSpread = new HexagonSpread(viewer)
      GHexagonSpread.add([113.9303 + 0.015, 22.5216, 58], 500, 'rgba(255,255,0,1)')

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