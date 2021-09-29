<template>
  <CesiumContainer @update:onReadyMap="onReadyMap">
    <template v-slot:configCom>
      <div class="TitleSetCongfig">
       <PannelBox>
        <template v-slot:content>
          <div class="titleset_con">
            <span class='c_title'>偏移量lon经度：{{offSet_lon / 10000}}</span>
            <el-slider v-model="offSet_lon" :min="-100" :max="100" :step="1" :format-tooltip="formatTooltip" @input="change_offset"></el-slider>
            <span class='c_title'>偏移量lat纬度：{{offSet_lat / 10000}}</span>
            <el-slider v-model="offSet_lat" :min="-100" :max="100" :step="1" :format-tooltip="formatTooltip" @input="change_offset"></el-slider>
            <span class='c_title'>偏移量height高度(米)：{{offSet_height}}</span>
            <el-slider v-model="offSet_height" :min="-2000" :max="2000" :step="10" @input="change_offset"></el-slider>
            <span class='c_title'>白膜颜色：{{color}}</span>
            <el-color-picker v-model="color" show-alpha size="mini" class="color-pick-s" @active-change="change_color"></el-color-picker><br><br>
            <span class='c_title'>启用打光效果： </span>
            <el-switch v-model="effectswitch" @change="effectswitch_change"></el-switch><br>
            <span class='c_title'>打光效果颜色：{{effect_color}}</span>
            <el-color-picker v-model="effect_color" size="mini" class="color-pick-s" @active-change="effect_color_change"></el-color-picker><br><br>
            <span class='c_title'>光环的移动范围(高度)单位米：{{effect_height}}</span>
            <el-slider v-model="effect_height" :min="0" :max="1000" :step="10" @input="effect_height_change"></el-slider><br>
            <el-button @click="save">保存当前配置</el-button>
          </div>
        </template>
      </PannelBox>
      </div>
    </template>
  </CesiumContainer>
</template>
<script lang="ts">
/* eslint-disable no-debugger */
import CesiumContainer from '@/components/CesiumContainer.vue'
import PannelBox from '@/components/PannelBox.vue'
import { defineComponent, ref } from 'vue'
import Titleset from '@/utils/ctrlCesium/Titleset'
import { getUrlParma } from '@/utils/common'
import { ElMessageBox, ElMessage } from 'element-plus'

export default defineComponent({
  name: 'TitleSetCongfig',
  components: { CesiumContainer, PannelBox },
  setup() {
    const offSet_lon = ref(0)
    const offSet_lat = ref(0)
    const offSet_height = ref(0)
    const color = ref('rgba(19, 206, 102, 0.8)')
    const effect_color = ref('rgba(119, 6, 32)')
    const effectswitch = ref(true)
    const effect_height = ref(100)
    let GTitleset = null
    const save = () => {
      ElMessageBox.confirm('提交保存当前白膜的配置信息, 是否继续?', '提示', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          (window.parent as any).postMessage({
            offSet_lon: offSet_lon.value / 10000,
            offSet_lat: offSet_lat.value / 10000,
            offSet_height: offSet_height.value,
            color: color.value,
            effect_color: effect_color.value,
            effectswitch: effectswitch.value,
            effect_height: effect_height.value
          }, '*')
          ElMessage({
            type: 'success',
            message: '保存成功!',
          })
        })
        .catch((e:any ) => {
          console.log(e)
        })
    }
    const effect_height_change = (val: number) => {
      if (GTitleset) {
        GTitleset.effect_height_change(val)
      }
    }
    const effect_color_change = (val: string) => {
      if (!val) {
        val = 'rgb(255,255,255)'
        effect_color.value = val
      }
      if (GTitleset) {
        GTitleset.effect_color_change(val)
      }
    }
    const effectswitch_change = (val: boolean) => {
      GTitleset.effectswitch_change(val)
    }
    const onReadyMap = () => {
      let reData:any = {
        flytoswitch: 1
      }
      let url = getUrlParma('url')
      url = decodeURI(url)
      reData.url = url
      reData.offset_x = getUrlParma('offset_x', 'float')
      offSet_lon.value = reData.offset_x * 10000
      reData.offset_y = getUrlParma('offset_y', 'float')
      offSet_lat.value = reData.offset_y * 10000
      reData.offset_z = getUrlParma('offset_z', 'int')
      offSet_height.value = reData.offset_z
      reData.color = getUrlParma('color')
      color.value = reData.color
      reData.effect_color = getUrlParma('effect_color')
      effect_color.value = reData.effect_color
      reData.effectswitch = getUrlParma('effectswitch', 'int')
      effectswitch.value = reData.effectswitch === 1
      reData.height = getUrlParma('height', 'int')
      effect_height.value = reData.height

      GTitleset = new Titleset(window.Gviewer)
      GTitleset.showConfigCom([reData])
    }
    const formatTooltip = (val: number) => {
      return val / 10000
    }
    const change_color = (val: string) => {
      if (!val) {
        val = 'rgba(255,255,255,1)'
        color.value = val
      }
      if (GTitleset) {
        GTitleset.change_color(val)
      }
    }
    const change_offset = () => {
      if (GTitleset) {
        GTitleset.setOneModalOff({
          offset_x: offSet_lon.value / 10000,
          offset_y: offSet_lat.value / 10000,
          offset_z: offSet_height.value
        })
      }
    }
    return {
      onReadyMap, offSet_lon, offSet_lat, offSet_height, formatTooltip, change_offset, color, change_color, effectswitch,
      effectswitch_change, effect_color_change, effect_color, effect_height_change, effect_height, save
    }
  },
})
</script>
<style lang="scss">
.TitleSetCongfig {
  .titleset_con{
    .el-color-picker.el-color-picker--mini.color-pick-s{
      position: relative;
      top: 9px;
      left: 11px;
    }
  }
}
</style>
<style lang="scss" scoped>
.TitleSetCongfig {
  position: absolute;
  top: 10px;
  left: 10px;
  .titleset_con{
    margin-top: 10px;
    text-align: left;
    .c_title{
      color: white;
      font-size: 0.8em;
    }
  }
}
</style>