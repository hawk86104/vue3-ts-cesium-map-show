<!--
 * @Description: 
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-06-29 09:01:28
 * @LastEditors: Hawk
 * @LastEditTime: 2021-08-18 10:48:16
-->
<template>
  <div class="ShowLngLatContainer">
    <span>lng:{{ lng }}</span> <span>lat:{{ lat }}</span>
  </div>
</template>

<script lang="ts">
declare const Cesium: any
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ShowLngLat',
  components: {},
  setup() {
    const lng = ref<number>()
    const lat = ref<number>()
    // let height = ref<number>(3.001)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const initCesiumHandler = (Viewer) => {
      const canvas = Viewer.scene.canvas
      const ellipsoid = Viewer.scene.globe.ellipsoid
      const handler = new Cesium.ScreenSpaceEventHandler(canvas)
      handler.setInputAction(function(movement) {
        const cartesian = Viewer.camera.pickEllipsoid(
          movement.endPosition,
          ellipsoid
        )
        if (cartesian) {
          const cartographic = Viewer.scene.globe.ellipsoid.cartesianToCartographic(
            cartesian
          )
          lat.value = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4)
          lng.value = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4)
          // height.value = (
          //   Viewer.camera.positionCartographic.height / 1000
          // ).toFixed(2)
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }
    return {
      lng, lat, initCesiumHandler /* height */
    }
  }
})
</script>
<style lang="scss">
.distance-legend{
  right: 28px;
}
</style>
<style lang="scss" scoped>
.ShowLngLatContainer {
  position: absolute;
  bottom: 0px;
  padding: 4px 6px 4px 6px;
  color: white;
  font-size: 14px;
  right: 0px;
  background-color: #00000055;
  width: 175px;
  span {
    margin-right: 6px;
  }
  span:last-child {
    margin-right: 0px;
  }
}
</style>
