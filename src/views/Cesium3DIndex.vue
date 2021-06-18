<template>
  <div class="Cesium3DIndex" id="cesiumContainer"></div>
</template>
<script lang="ts">
declare const GController: any
import { defineComponent, onBeforeMount, nextTick } from 'vue'
export default defineComponent({
  name: 'Cesium3DIndex',
  components: {},
  setup() {
    const initMap = () => {
      const viewer:any = GController.init(process.env)
      console.log(viewer)
    }
    onBeforeMount(() => {
      nextTick(() => {
        initMap()
      })
    })
    return {}
  },
})
</script>
