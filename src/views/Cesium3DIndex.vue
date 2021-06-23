<template>
  <div class="Cesium3DIndex" id="cesiumContainer"></div>
</template>
<script lang="ts">
/* eslint-disable no-debugger */
import { GController } from '@/utils/ctrlCesium/Controller'
import { defineComponent, onBeforeMount, nextTick } from 'vue'
import { getMapConfig, getMapImageryList } from '@/api/base'
import { zipObject, map, forIn} from 'lodash'

export default defineComponent({
  name: 'Cesium3DIndex',
  components: {},
  setup() {
    const initMap = (BaseMapConfig:any, MapImageryList:any) => {
      const viewer:any = GController.init(BaseMapConfig, MapImageryList)
      console.log(viewer)
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
        res[index].interfaceConfig = JSON.parse(elem.interfaceConfig)
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
    return {}
  },
})
</script>

<style lang="scss">
.Cesium3DIndex {
  height: 100%;
}
</style>