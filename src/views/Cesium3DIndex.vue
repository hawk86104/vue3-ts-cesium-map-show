<!--
 * @Description: 
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-06-17 15:13:58
 * @LastEditors: Hawk
 * @LastEditTime: 2021-08-30 16:37:31
-->
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
import Titleset from '@/utils/ctrlCesium/Titleset'
import Manager from '@/utils/ctrlCesium/effects/Manager'
import RoadNetwork from '@/utils/ctrlCesium/lines/RoadNetwork'
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
      window.Gviewer = viewer // 全局控制台 调试viewer
      // 显示经纬度绑定事件
      ShowLngLatRef.value.initCesiumHandler(viewer)
      // 飞到配置的坐标
      ButtonToolsRef.value.flyTo()

      // 处理 白膜
      const GTitleset = new Titleset(viewer)
      GTitleset.init()

      // 处理 配置好的点效果列表
      const GManager = new Manager(viewer)
      GManager.init()

      // 公路效果
      const GRoadNetwork = new RoadNetwork(viewer, 'road')
      // bus路网
      // GRoadNetwork.loadBeijingLinesData()
      GRoadNetwork.loadShenZhengLinesData()
      // 精灵路
      // GRoadNetwork.loadRoadPicEffect()
      // 飞线
      // GRoadNetwork.loadFlyLines()
 
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