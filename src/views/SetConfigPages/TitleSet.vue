<template>
  <CesiumContainer @update:onReadyMap="onReadyMap">
    <template v-slot:configCom>
      <div class="TitleSetCongfig">
       <PannelBox>
        <template v-slot:content>
          <div class="titleset_con">
            <span class='c_title'>偏移量lon经度:</span>
            <el-slider v-model="offSet_lon" :min="-100" :max="100" :step="1" :format-tooltip="formatTooltip" @input="change_offset"></el-slider>
            <span class='c_title'>偏移量lat纬度:</span>
            <el-slider v-model="offSet_lat" :min="-100" :max="100" :step="1" :format-tooltip="formatTooltip" @input="change_offset"></el-slider>
            <span class='c_title'>偏移量height高度(米):</span>
            <el-slider v-model="offSet_height" :min="-2000" :max="2000" :step="10" @input="change_offset"></el-slider>
            <span class='c_title'>白膜颜色:</span>
            <el-color-picker v-model="color" show-alpha size="mini" class="color-pick-s" @active-change="change_color"></el-color-picker>
          </div>
        </template>
      </PannelBox>
      </div>
    </template>
  </CesiumContainer>
</template>
<script lang="ts">
import CesiumContainer from '@/components/CesiumContainer.vue'
import PannelBox from '@/components/PannelBox.vue'
import { defineComponent, ref } from 'vue'
import Titleset from '@/utils/ctrlCesium/Titleset'
import { getUrlKey } from '@/utils/common'
declare global {
    interface Window { GController: any; }
}
export default defineComponent({
  name: 'TitleSetCongfig',
  components: { CesiumContainer, PannelBox },
  setup() {
    const offSet_lon = ref(0)
    const offSet_lat = ref(0)
    const offSet_height = ref(0)
    const color = ref('rgba(19, 206, 102, 0.8)')
    let GTitleset = null
    const onReadyMap = () => {
      const titleSetId = getUrlKey('id', window.location.href)
      GTitleset = new Titleset(window.GController)
      GTitleset.showOne(titleSetId)
    }
    const formatTooltip = (val: number) => {
      return val / 10000
    }
    const change_color = (val: string) => {
      if (GTitleset) {
        GTitleset.change_color(val)
      }
    }
    const change_offset = () => {
      GTitleset.setOneModalOff({
        offset_x: offSet_lon.value / 10000,
        offset_y: offSet_lat.value / 10000,
        offset_z: offSet_height.value
      })
    }
    return {
      onReadyMap, offSet_lon, offSet_lat, offSet_height, formatTooltip, change_offset, color, change_color
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