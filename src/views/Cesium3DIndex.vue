<template>
  <div class="Cesium3DIndex" id="cesiumContainer"></div>
  <ShowLngLat ref="ShowLngLatRef" />
  <ButtonTools ref="ButtonToolsRef" />
</template>
<script lang="ts">
/* eslint-disable no-debugger */
import { GController } from '@/utils/ctrlCesium/Controller'
import ShowLngLat from '@/components/ShowLngLat.vue' // @ is an alias to /src
import ButtonTools from '@/components/ButtonTools.vue'
declare global {
    interface Window { GController: any; }
}
import Titleset from '@/utils/ctrlCesium/Titleset'
import { defineComponent, onBeforeMount, nextTick, ref } from 'vue'
import { getMapConfig, getMapImageryList } from '@/api/base'
import { zipObject, map, forIn} from 'lodash'

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

      const GTitleset = new Titleset(viewer)
      GTitleset.addtest()
    }
    const getBaseMapConfig = async () => {
      let res:any = await getMapConfig()
      res = res.data
      res = zipObject(
        map(res, 'name'), map(res, 'value')
      )
      forIn(res, (value:any, index:any) => {
        res[index] = value === '1'
      })
      return res
    }
    const getBaseMapImageryList = async () => {
      let res:any = await getMapImageryList()
      res = res.data
      res.some((elem:any, index:any) => {
        res[index].classConfig = JSON.parse(elem.classConfig)
        res[index].interfaceConfig = elem.interfaceConfig === '' ? [] : JSON.parse(elem.interfaceConfig)
        forIn(res[index].interfaceConfig, (v:any, i:any) => {
          if (isNaN(parseFloat(v))) {
            res[index].interfaceConfig[i] = v === 'true'
          }
          else {
            res[index].interfaceConfig[i] = parseFloat(v)
          }
        })
      })
      return res
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