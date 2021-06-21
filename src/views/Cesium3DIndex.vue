<template>
  <div class="Cesium3DIndex" id="cesiumContainer"></div>
</template>
<script lang="ts">
declare const GController: any

import { defineComponent, onBeforeMount, nextTick } from 'vue'
import { getMapConfig } from '@/api/base'
import { zipObject, map, pick } from 'lodash'

export default defineComponent({
  name: 'Cesium3DIndex',
  components: {},
  setup() {
    const initMap = (BaseMapConfig) => {
      const viewer:any = GController.init(BaseMapConfig)
      console.log(viewer)
    }
    const getBaseMapConfig = async () => {
      let res:any = await getMapConfig()
      res = res.data
      res = zipObject(
        map(res, 'name'), res
      )
      return res
    }
    onBeforeMount(() => {
      nextTick(async () => {
        const BaseMapConfig:any = await getBaseMapConfig()
        initMap(BaseMapConfig)
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