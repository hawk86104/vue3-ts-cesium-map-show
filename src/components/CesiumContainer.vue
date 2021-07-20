<template>
  <div class="Cesium3Dcontainer" id="cesiumContainer"></div>
  <ShowLngLat ref="ShowLngLatRef" />
  <slot name="configCom"></slot>
</template>
<script lang="ts">
import { GController } from '@/utils/ctrlCesium/Controller'
import { getBaseMapConfig, getBaseMapImageryList } from '@/utils/getFormatData/BaseMap'
import ShowLngLat from '@/components/ShowLngLat.vue'
import { defineComponent, onBeforeMount, nextTick, ref } from 'vue'
declare global {
    interface Window { GController: any; }
}
export default defineComponent({
  name: 'Cesium3Dcontainer',
  components: { ShowLngLat },
  setup(props, context) {
    let viewer = ref<any>()
    const ShowLngLatRef = ref()
    const initMap = (BaseMapConfig: any, MapImageryList: any) => {
      viewer = GController.init(BaseMapConfig, MapImageryList)
      window.GController = viewer // 全局控制台 调试viewer
      // 显示经纬度绑定事件
      ShowLngLatRef.value.initCesiumHandler(viewer)
      context.emit('update:onReadyMap', null)
    }
    onBeforeMount(() => {
      nextTick(async () => {
        const BaseMapConfig: any = await getBaseMapConfig()
        const MapImageryList: any = await getBaseMapImageryList()
        initMap(BaseMapConfig, MapImageryList)
      })
    })
    return {
      viewer, ShowLngLatRef
    }
  },
})
</script>

<style lang="scss" scoped>
.Cesium3Dcontainer {
  width: 100%;
  height: 100%;
}
</style>
