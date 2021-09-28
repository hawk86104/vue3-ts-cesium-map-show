
<!--
 * @Description: 
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-09-23 15:08:55
 * @LastEditors: Hawk
 * @LastEditTime: 2021-09-28 15:41:50
-->
<template>
  <CesiumContainer @update:onReadyMap="onReadyMap">
    <template v-slot:configCom>
      <div class="LinesCongfig">
        <PannelBox>
          <template v-slot:content>
            <div class="lines_con">
              <template v-if="type==='FlyLines'">
                <span class='c_title'>飞线数：{{random}} 条 <el-button @click="makeLines" size="mini" style="float: right;margin-top: -6px;">重新生成</el-button></span>
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
                <el-divider>以上需要重新生成</el-divider>
              </template>
              <span class='c_title'>宽度：{{width}} </span>
              <el-slider v-model="width" :min="0.1" :max="10" :step="0.1" @input="lines_width_change"></el-slider>
              <template v-if="type==='RoadPic'">
                <span class='c_title'>延迟时间: {{time}} ms</span>
                <el-slider v-model="time" :min="100" :max="10000" :step="100" @input="lines_time_change"></el-slider>
              </template>
              <template v-if="type!=='RoadPic'">
                <span class='c_title'>速度：{{speed}} </span>
                <el-slider v-model="speed" :min="0.5" :max="20" :step="0.5"  @input="lines_speed_change"></el-slider>
                <span class='c_title'>效果颜色：{{color}}</span>
                <el-color-picker v-model="color" size="mini" class="color-pick-s" @active-change="change_color"></el-color-picker><br><br>
                <span class='c_title'>拖尾长：{{percent}} </span>
                <el-slider v-model="percent" :min="0.01" :max="0.6" :step="0.02" @input="lines_percent_change"></el-slider><br>
                <span class='c_title'>变化率：{{gradient}} </span>
                <el-slider v-model="gradient" :min="0.01" :max="0.3" :step="0.02" @input="lines_gradient_change"></el-slider><br>
              </template>
              <el-button @click="save" size="mini">保存当前设置</el-button>
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
    const color = ref('#FF006D')
    color.value = getUrlParma('color') ? getUrlParma('color') : color.value

    const bbox = ref([113.89, 22.48, 113.9694, 22.5692])
    bbox.value[0] = getUrlParma('startPoint_lng') ? getUrlParma('startPoint_lng') : bbox.value[0]
    bbox.value[1] = getUrlParma('startPoint_lat') ? getUrlParma('startPoint_lat') : bbox.value[1]
    bbox.value[2] = getUrlParma('endPoint_ing') ? getUrlParma('endPoint_ing') : bbox.value[2]
    bbox.value[3] = getUrlParma('endPoint_lat') ? getUrlParma('endPoint_lat') : bbox.value[3]

    const width = ref(2)
    width.value = getUrlParma('width') ? parseFloat(getUrlParma('width')) : width.value

    const Geojsonfile = getUrlParma('Geojsonfile') ? decodeURI(getUrlParma('Geojsonfile')) : ''
    const Effectimage = getUrlParma('Effectimage') ? decodeURI(getUrlParma('Effectimage')) : ''
    
    const time = ref(1000)
    time.value = getUrlParma('time') ? parseFloat(getUrlParma('time')) : time.value

    const height = ref(3000)
    height.value = getUrlParma('height') ? parseFloat(getUrlParma('height')) : height.value

    const speed = ref(6.0)
    speed.value = getUrlParma('speed') ? parseFloat(getUrlParma('speed')) : speed.value

    const percent = ref(0.1)
    percent.value = getUrlParma('percent') ? parseFloat(getUrlParma('percent')) : percent.value

    const gradient = ref(0.1)
    gradient.value = getUrlParma('gradient') ? parseFloat(getUrlParma('gradient')) : gradient.value

    const random = ref(300)
    random.value = getUrlParma('random') ? parseFloat(getUrlParma('random')) : random.value

    const type = ref('FlyLines')
    type.value = getUrlParma('type') ? getUrlParma('type') : type.value

    const change_color = (val: string) => {
      if (GRoadNetwork && window.Gviewer.entities && val) {
        GRoadNetwork.changeLinesColor(type.value, val)
      }
    }
    const lines_gradient_change = (val: number) => {
      if (GRoadNetwork && window.Gviewer.entities) {
        GRoadNetwork.changeLinesGradient(type.value, val)
      }
    }
    const lines_speed_change = (val: number) => {
      if (GRoadNetwork && window.Gviewer.entities) {
        GRoadNetwork.changeLinesSpeed(type.value, val)
      }
    }
    const lines_percent_change = (val: number) => {
      if (GRoadNetwork && window.Gviewer.entities) {
        GRoadNetwork.changeLinesPercent(type.value, val)
      }
    }
    const lines_width_change = (val: number) => {
      if (GRoadNetwork && window.Gviewer.entities) {
        GRoadNetwork.changeLinesWidth(type.value, val)
      }
    }
    const lines_time_change = (val: number) => {
      if (GRoadNetwork && window.Gviewer.entities) {
        GRoadNetwork.changeLinesTime(type.value, val)
      }
    }
    const makeLines = () => {
      if (GRoadNetwork && window.Gviewer.entities) {
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
      if (type.value === 'FlyLines') {
        let pe: any = bbox.value
        bbox.value = [parseFloat(pe[0]), parseFloat(pe[1]), parseFloat(pe[2]), parseFloat(pe[3])]
        GRoadNetwork.addFlyLines(bbox.value, color.value, width.value, height.value, speed.value, percent.value, gradient.value, random.value)
      }
      else if (type.value === 'BusLines') {
        GRoadNetwork.addBusLines(Geojsonfile,
          color.value, width.value, speed.value, percent.value, gradient.value
        )
      }
      else if (type.value === 'RoadPic') {
        GRoadNetwork.addRoadPic(Geojsonfile, Effectimage, width.value, time.value)
      }
    }
    const save = () => {
      ElMessageBox.confirm('提交保存当前效果配置信息, 是否继续?', '提示', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let postData = null
          if (type.value === 'FlyLines') {
            postData = {
              bbox: JSON.stringify(bbox.value),
              color: color.value,
              width: width.value,
              height: height.value,
              speed: speed.value,
              percent: percent.value,
              gradient: gradient.value,
              random: random.value
            }
          }
          else if (type.value === 'BusLines') {
            postData = {
              color: color.value,
              width: width.value,
              speed: speed.value,
              percent: percent.value,
              gradient: gradient.value
            }
          }
          else if (type.value === 'RoadPic') {
            postData = {
              width: width.value,
              time: time.value
            }
          }

          // 保存现有 效果配置 调用后台
          (window.parent as any).postMessage(postData, '*')
          ElMessage({
            type: 'success',
            message: '保存成功!',
          })
        })
        .catch((e:any ) => {
          console.log(e)
        })
    }
    return {
      onReadyMap, type, random, makeLines, height, width, lines_width_change, color, change_color, percent, lines_percent_change,
      lines_gradient_change, gradient, speed, lines_speed_change, bbox, save, time, lines_time_change
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
