<!--
 * @Description: 
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-07-20 09:59:07
 * @LastEditors: Hawk
 * @LastEditTime: 2021-08-26 09:37:11
-->
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

export default defineComponent({
  name: 'Cesium3Dcontainer',
  props: {
    isImagery: {
      type: Boolean,
      default: false
    }
  },
  components: { ShowLngLat },
  setup(props, context) {
    const ShowLngLatRef = ref()
    const BaseMapConfig = ref()
    const initMap = (BaseMapConfig: any, MapImageryList: any) => {
      let viewer = GController.init(BaseMapConfig, MapImageryList)
      window.Gviewer = viewer // 全局控制台 调试viewer
      // 显示经纬度绑定事件
      ShowLngLatRef.value.initCesiumHandler(viewer)
      context.emit('update:onReadyMap', null)
    }
    const initImageryMap = (MapImageryList: any) => {
      let viewer = GController.init(BaseMapConfig, MapImageryList)
      window.Gviewer = viewer // 全局控制台 调试viewer
      // 显示经纬度绑定事件
      ShowLngLatRef.value.initCesiumHandler(viewer)
      context.emit('update:onReadyMap', null)
    }
    onBeforeMount(() => {
      nextTick(async () => {
        BaseMapConfig.value = await getBaseMapConfig()
        if (!props.isImagery) {
          const MapImageryList: any = await getBaseMapImageryList()
          initMap(BaseMapConfig.value, MapImageryList)
        }
      })
    })
    return {
      ShowLngLatRef, BaseMapConfig, initImageryMap
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
