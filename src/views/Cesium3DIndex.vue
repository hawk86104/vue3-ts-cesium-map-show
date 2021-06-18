<template>
  <div class="Cesium3DIndex" id="cesiumContainer"></div>
</template>
<script lang="ts">
declare const GController: any
import { defineComponent, onBeforeMount, nextTick } from 'vue'
export default {
  name: 'Cesium3DIndex',
  components: {},
  setup() {
    const initMap = () => {
      GController.init(process.env).then((viewer: any) => {
        console.log(viewer)
      })
    }
    onBeforeMount(() => {
      nextTick(() => {
        initMap()
      })
    })
    return {}
  },
}
</script>
