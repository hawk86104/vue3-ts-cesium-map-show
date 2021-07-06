
<template>
  <div class="ButtonToolsContainer">
    <el-button v-if="IsShow" type="info" plain @click="save()">记录视角位置</el-button>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-debugger */
declare global {
  interface Window { GController: any; }
}
declare const Cesium: any
import { defineComponent, onBeforeMount, nextTick, ref } from 'vue'
import { getMapView } from '@/api/base'
import { zipObject, map} from 'lodash'

export default defineComponent({
  name: 'ButtonTools',
  components: {},
  setup() {
    const IsShow = ref<boolean>(false)
    const FirstMapView = ref<any>()
    const save = () => {
      const camera:any = window.GController.scene.camera
      const direction:any = camera.direction
      const up:any = camera.up
      const position:any = camera.position

      const ellipsoid = window.GController.scene.globe.ellipsoid
      const cartesian3 = new Cesium.Cartesian3(position.x, position.y, position.z)
      const cartographic = ellipsoid.cartesianToCartographic(cartesian3)
      const lat = Cesium.Math.toDegrees(cartographic.latitude)
      const lng = Cesium.Math.toDegrees(cartographic.longitude)
      const alt = cartographic.height
      console.log(lat, lng, alt)
      console.log(direction, up)
    }
    const flyTo = () => {
      // const x = -2394510.2078150916
      // const y = 5395360.292764892
      // const z = 2420140.372624237

      // // 这里是世界坐标 xyz 转 经纬度数
      // const ellipsoid = window.GController.scene.globe.ellipsoid
      // const cartesian3 = new Cesium.Cartesian3(x, y, z)
      // const cartographic = ellipsoid.cartesianToCartographic(cartesian3)
      // const lat = Cesium.Math.toDegrees(cartographic.latitude)
      // const lng = Cesium.Math.toDegrees(cartographic.longitude)
      // const alt = cartographic.height

      // 这里是 经纬度 转 世界坐标xyz
      const ellipsoidz = window.GController.scene.globe.ellipsoid
      const cartographicz = Cesium.Cartographic.fromDegrees(
        parseFloat(FirstMapView.value.lng), parseFloat(FirstMapView.value.lat), parseFloat(FirstMapView.value.height))
      const cartesianXYZ = ellipsoidz.cartographicToCartesian(cartographicz)

      window.GController.scene.camera.flyTo({
        // setView
        destination: {
          x: cartesianXYZ.x,
          y: cartesianXYZ.y,
          z: cartesianXYZ.z,
        },
        orientation: {
          direction: new Cesium.Cartesian3(
            parseFloat(FirstMapView.value.direction_x),
            parseFloat(FirstMapView.value.direction_y),
            parseFloat(FirstMapView.value.direction_z)
          ),
          up: new Cesium.Cartesian3(
            parseFloat(FirstMapView.value.up_x),
            parseFloat(FirstMapView.value.up_y),
            parseFloat(FirstMapView.value.up_z)
          ),
        },
        duration: 2, // 延迟秒数
      })
    }
    onBeforeMount(() => {
      nextTick(async () => {
        FirstMapView.value = (await getMapView()).data
        FirstMapView.value = zipObject(
          map(FirstMapView.value, 'name'), map(FirstMapView.value, 'value')
        )
        debugger
        IsShow.value = FirstMapView.value.showSaveButton === '1'
      })
    })
    return {
      IsShow, FirstMapView, save, flyTo
    }
  }
})
</script>

<style lang="scss" scoped>
.ButtonToolsContainer {
  position: absolute;
  bottom: 80px;
  padding: 4px 6px 4px 6px;
  // color: white;
  // font-size: 14px;
  right: 0px;
  // background-color: #00000055;
  // width: 175px;
}
</style>
