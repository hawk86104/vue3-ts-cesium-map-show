
<!--
 * @Description: 
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-09-23 15:08:55
 * @LastEditors: Hawk
 * @LastEditTime: 2021-09-27 10:01:48
-->
<template>
  <CesiumContainer @update:onReadyMap="onReadyMap">
    <template v-slot:configCom>
      <div class="LinesCongfig">
        <PannelBox>
          <template v-slot:content>
            <div class="lines_con">
              <span class='c_title'>飞线数：{{random}} 条 <el-button @click="makeLines" size="mini" style="float: right;margin-top: -6px;">生成飞线</el-button></span>
              <el-slider v-model="random" :min="10" :max="1000" :step="10"></el-slider>
              <span class='c_title'>起始lon经度：</span>
              <el-input type="number" class="input_c_p" size="small" v-model="bbox[0]" ></el-input><br><br>
              <span class='c_title'>起始lat纬度：</span>
              <el-input type="number" class="input_c_p" size="small" v-model="bbox[1]"></el-input><br><br>
              <span class='c_title'>终止lon经度：</span>
              <el-input type="number" class="input_c_p" size="small" v-model="bbox[2]" ></el-input><br><br>
              <span class='c_title'>终止lat纬度：</span>
              <el-input type="number" class="input_c_p" size="small" v-model="bbox[3]"></el-input><br><br>
              <span class='c_title'>最大高度：{{height}} 米</span>
              <el-slider v-model="height" :min="100" :max="10000" :step="100"></el-slider>
              <span class='c_title'>速度：{{speed}} </span>
              <el-slider v-model="speed" :min="0.5" :max="20" :step="0.5"></el-slider>
              <el-divider>以上需要重新生成</el-divider>
              <span class='c_title'>宽度：{{width}} </span>
              <el-slider v-model="width" :min="0.1" :max="10" :step="0.1" @input="lines_width_change"></el-slider>
              <span class='c_title'>效果颜色：{{color}}</span>
              <el-color-picker v-model="color" size="mini" class="color-pick-s" @active-change="change_color"></el-color-picker><br><br>
              <span class='c_title'>拖尾长：{{percent}} </span>
              <el-slider v-model="percent" :min="0.01" :max="0.6" :step="0.02" @input="lines_percent_change"></el-slider><br>
              <span class='c_title'>变化率：{{gradient}} </span>
              <el-slider v-model="gradient" :min="0.01" :max="0.3" :step="0.02" @input="lines_gradient_change"></el-slider><br>
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
import { getUrlParma } from '@/utils/common'

import Titleset from '@/utils/ctrlCesium/Titleset'
import RoadNetwork from '@/utils/ctrlCesium/lines/RoadNetwork'
import { defineComponent, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

export default defineComponent({
  name: 'LinesCongfig',
  components: { CesiumContainer, PannelBox },
  setup() {
    let GRoadNetwork = null
    const color = ref('rgba(198, 6, 88, 0.7)')
    color.value = getUrlParma('color') ? getUrlParma('color') : color.value

    const bbox = ref([113.89, 22.48, 113.9694, 22.5692])
    bbox.value[0] = getUrlParma('startPoint_lng') ? getUrlParma('startPoint_lng') : bbox.value[0]
    bbox.value[1] = getUrlParma('startPoint_lat') ? getUrlParma('startPoint_lat') : bbox.value[1]
    bbox.value[2] = getUrlParma('endPoint_ing') ? getUrlParma('endPoint_ing') : bbox.value[2]
    bbox.value[3] = getUrlParma('endPoint_lat') ? getUrlParma('endPoint_lat') : bbox.value[3]

    const width = ref(2)
    width.value = getUrlParma('width') ? getUrlParma('width') : width.value

    const height = ref(3000)
    height.value = getUrlParma('height') ? getUrlParma('height') : height.value

    const speed = ref(6)
    speed.value = getUrlParma('speed') ? getUrlParma('speed') : speed.value

    const percent = ref(0.1)
    percent.value = getUrlParma('percent') ? getUrlParma('percent') : percent.value

    const gradient = ref(0.1)
    gradient.value = getUrlParma('gradient') ? getUrlParma('gradient') : gradient.value

    const random = ref(300)
    random.value = getUrlParma('random') ? getUrlParma('random') : random.value

    const change_color = (val: string) => {
      if (GRoadNetwork && window.Gviewer.entities && val) {
        GRoadNetwork.changeFlyLinesColor(val)
      }
    }

    const lines_gradient_change = (val: number) => {
      if (window.Gviewer.entities && GRoadNetwork) {
        GRoadNetwork.changeFlyLinesGradient(val)
      }
    }

    const lines_percent_change = (val: number) => {
      if (window.Gviewer.entities && GRoadNetwork) {
        GRoadNetwork.changeFlyLinesPercent(val)
      }
    }

    const lines_width_change = (val: number) => {
      if (window.Gviewer.entities && GRoadNetwork) {
        GRoadNetwork.changeFlyLinesWidth(val)
      }
    }

    const makeLines = () => {
      if (window.Gviewer.entities && GRoadNetwork) {
        // 格式化 bbox string 转float
        let pe: any = bbox.value
        bbox.value = [parseFloat(pe[0]), parseFloat(pe[1]), parseFloat(pe[2]), parseFloat(pe[3])]
        GRoadNetwork.remakeFlyLines(bbox.value, color.value, width.value, height.value, speed.value, percent.value, gradient.value, random.value)
      }
    }

    const onReadyMap = () => {
      // 载入默认白膜
      const GTitleset = new Titleset(window.Gviewer)
      GTitleset.init()

      // 公路效果
      GRoadNetwork = new RoadNetwork(window.Gviewer, 'road')
      GRoadNetwork.addFlyLines(bbox.value, color.value, width.value, height.value, speed.value, percent.value, gradient.value, random.value)
    }
    return {
      onReadyMap, random, makeLines, height, width, lines_width_change, color, change_color, percent, lines_percent_change, lines_gradient_change, gradient, speed, bbox
    }
  },
})
</script>
<style lang="scss">
.LinesCongfig {
  .el-color-picker.el-color-picker--mini.color-pick-s{
    position: relative;
    top: 9px;
    left: 11px;
  }
  .el-divider__text {
    background-color: #131630;
    color: #ffffff;
  }
}
</style>
<style lang="scss" scoped>
.LinesCongfig {
  position: absolute;
  top: 10px;
  left: 10px;
  .lines_con{
    margin-top: 10px;
    text-align: left;
    width: 20em;
    .c_title{
      color: white;
      font-size: 0.8em;
    }
  }
}
</style>
