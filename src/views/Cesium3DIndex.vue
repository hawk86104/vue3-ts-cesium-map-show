<template>
  <div class="Cesium3DIndex" id="cesiumContainer"></div>
</template>
<script lang="ts">
declare const GController: any
import { defineComponent, onBeforeMount, nextTick } from 'vue'
import { getMapConfig } from '@/api/base'
export default defineComponent({
  name: 'Cesium3DIndex',
  components: {},
  setup() {
    const initMap = () => {
      const viewer:any = GController.init(process.env)
      console.log(viewer)
    }
    const getBaseMapConfig = async () => {
      const res = await getMapConfig()
      console.log(res)
      // eslint-disable-next-line no-debugger
      debugger
    }
    onBeforeMount(() => {
      nextTick(() => {
        // initMap()
        getBaseMapConfig()
      })
    })
    return {}
  },
})
</script>
