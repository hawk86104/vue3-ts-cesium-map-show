<template>
  <div class="ButtonToolsContainer">
    <el-button v-if="IsShow" type="info" plain @click="save()"
      >记录视角位置</el-button
    >
  </div>
</template>

<script lang="ts">
declare const Cesium: any
/* eslint-disable no-debugger */
import { defineComponent, onBeforeMount, ref } from 'vue'
import { getMapView, setMapView } from '@/api/base'
import { zipObject, map} from 'lodash'
import { ElMessageBox, ElMessage } from 'element-plus'

export default defineComponent({
  name: 'ButtonTools',
  components: {},
  setup() {
    const IsShow = ref<boolean>(false)
    const FirstMapView = ref<any>()
    const save = () => {
      const camera:any = window.Gviewer.scene.camera
      const direction:any = camera.direction
      const up:any = camera.up
      const position:any = camera.position

      const ellipsoid = window.Gviewer.scene.globe.ellipsoid
      const cartesian3 = new Cesium.Cartesian3(position.x, position.y, position.z)
      const cartographic = ellipsoid.cartesianToCartographic(cartesian3)
      const lat = Cesium.Math.toDegrees(cartographic.latitude)
      const lng = Cesium.Math.toDegrees(cartographic.longitude)
      const height = cartographic.height

      ElMessageBox.confirm('提交保存此摄像头视图, 是否继续?', '提示', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { reData } = await setMapView({
            lat: lat,
            lng: lng,
            height: height,
            direction: direction,
            up: up
          })
          console.log(reData)
          ElMessage({
            type: 'success',
            message: '保存成功!',
          })
        })
        .catch((e:any ) => {
          console.log(e)
        })
    }
    const flyTo = async () => {
      // const x = -2394510.2078150916
      // const y = 5395360.292764892
      // const z = 2420140.372624237

      // // 这里是世界坐标 xyz 转 经纬度数
      // const ellipsoid = window.Gviewer.scene.globe.ellipsoid
      // const cartesian3 = new Cesium.Cartesian3(x, y, z)
      // const cartographic = ellipsoid.cartesianToCartographic(cartesian3)
      // const lat = Cesium.Math.toDegrees(cartographic.latitude)
      // const lng = Cesium.Math.toDegrees(cartographic.longitude)
      // const alt = cartographic.height
      FirstMapView.value = (await getMapView()).data
      FirstMapView.value = zipObject(
        map(FirstMapView.value, 'name'), map(FirstMapView.value, 'value')
      )
      IsShow.value = FirstMapView.value.showSaveButton === '1'

      // 如果不飞到视图 直接跳过
      if (FirstMapView.value.flytoView === '0') {
        return
      }

      // 这里是 经纬度 转 世界坐标xyz
      const ellipsoidz = window.Gviewer.scene.globe.ellipsoid
      const cartographicz = Cesium.Cartographic.fromDegrees(
        parseFloat(FirstMapView.value.lng), parseFloat(FirstMapView.value.lat), parseFloat(FirstMapView.value.height))
      const cartesianXYZ = ellipsoidz.cartographicToCartesian(cartographicz)

      window.Gviewer.scene.camera.flyTo({
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
        duration: FirstMapView.value.duration, // 延迟秒数
      })
    }
    onBeforeMount(() => {
      // nextTick(async () => {
      // })
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
  right: 0px;
}
</style>
