<!--
 * @Description: 
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-10-13 09:26:38
 * @LastEditors: Hawk
 * @LastEditTime: 2021-10-13 15:53:13
-->
<template>
  <CesiumContainer @update:onReadyMap="onReadyMap">
    <template v-slot:configCom>
      <div class="ModelCongfig">
        <PannelBox>
          <template v-slot:content>
            <div class="model_con">
              <span class='c_title'>效果颜色：{{color}}</span>
              <el-color-picker v-model="color" show-alpha size="mini" class="color-pick-s" @active-change="change_color"></el-color-picker><br><br>
              <span class='c_title'>颜色模式：</span>
              <el-radio-group v-model="colorMode" @change="change_colorMode" size="small">
                <el-radio label="HIGHLIGHT">高亮</el-radio>
                <el-radio label="MIX">混合</el-radio>
                <el-radio label="REPLACE">替换</el-radio>
              </el-radio-group><br><br>
              <span class='c_title'>旋转延迟：{{duration}} 毫秒</span>
              <el-slider v-model="duration" :min="0" :max="100" :step="1" @input="duration_change"></el-slider><br>
              <span class='c_title'>转速{{rotate}} </span>
              <el-slider v-model="rotate" :min="1" :max="20" :step="1" @input="rotate_change"></el-slider><br>
              <span class='c_title'>高度：{{height}} 米</span>
              <el-slider v-model="height" :min="0" :max="1000" :step="20" @input="height_change"></el-slider><br><br>
              <span class='c_title'>大小：{{scale}} 倍</span>
              <el-slider v-model="scale" :min="1" :max="1000" :step="10" @input="scale_change"></el-slider><br>
              <span class='c_title'>最小显示：{{minimumPixelSize}} 像素</span>
              <el-slider v-model="minimumPixelSize" :min="1" :max="800" :step="10" @input="minimumPixelSize_change"></el-slider><br>
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
import Primitive from '@/utils/ctrlCesium/model/Primitive'

import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ModelCongfig',
  components: { CesiumContainer, PannelBox },
  setup() {
    const IdModel = 'pimitiveModelConfig'
    const color = ref('rgba(30, 255, 0, 0.55)')
    color.value = getUrlParma('color') ? getUrlParma('color') : color.value
    const colorMode = ref('MIX')
    colorMode.value = getUrlParma('colorMode') ? getUrlParma('colorMode') : colorMode.value
    const duration = ref(20)
    duration.value = getUrlParma('duration') ? getUrlParma('duration') : duration.value
    const height = ref(100)
    height.value = getUrlParma('height') ? getUrlParma('height') : height.value
    const scale = ref(100)
    scale.value = getUrlParma('scale') ? getUrlParma('scale') : scale.value
    const rotate = ref(1)
    rotate.value = getUrlParma('rotate') ? getUrlParma('rotate') : rotate.value
    const minimumPixelSize = ref(21)
    minimumPixelSize.value = getUrlParma('minimumPixelSize') ? getUrlParma('minimumPixelSize') : minimumPixelSize.value
    
    let primitives = null
    const change_color = (val: string) => {
      if (!val) {
        val = 'rgba(255,255,255,1)'
        color.value = val
      }
      if (primitives && window.Gviewer.entities) {
        primitives.changePrimitiveColor(IdModel, val)
      }
    }
    const rotate_change = (val: string) => {
      if (primitives && window.Gviewer.entities) {
        primitives.changePrimitiveRotate(IdModel, val)
      }
    }
    const change_colorMode = (val: string) => {
      if (primitives && window.Gviewer.entities) {
        primitives.changePrimitiveColorBlendMode(IdModel, val)
      }
    }
    const duration_change = (val: number) => {
      if (primitives && window.Gviewer.entities) {
        primitives.changePrimitiveIntervalTime(IdModel, val)
      }
    }
    const height_change = (val: number) => {
      if (primitives && window.Gviewer.entities) {
        primitives.changePrimitiveHeight(IdModel, val)
      }
    }
    const scale_change = (val: number) => {
      if (primitives && window.Gviewer.entities) {
        primitives.changePrimitiveScale(IdModel, val)
      }
    }
    const minimumPixelSize_change = (val: number) => {
      if (primitives && window.Gviewer.entities) {
        primitives.changePrimitiveMinimumPixelSize(IdModel, val)
      }
    }
    
    const onReadyMap = () => {
      // 载入默认白膜
      const GTitleset = new Titleset(window.Gviewer)
      GTitleset.init()

      primitives = new Primitive(window.Gviewer)
      primitives.addMouseEvent()
      let points =
        {
          id: IdModel,
          lon: 113.9318,
          lat: 22.5206,
          height: height.value,
          heading: 0,
          pitch: 0,
          roll: 0,
          colorMode: colorMode.value,
          uri: 'https://mapv-data.oss-cn-hangzhou.aliyuncs.com/model/pyramid.glb',
          // uri: 'https://a.amap.com/jsapi_demos/static/gltf-online/shanghai/scene.gltf',
          scale: scale.value, // 3580
          rotate: rotate.value, // 转速
          modelColor: color.value,
          minimumPixelSize: minimumPixelSize.value, // 模型最小以多少像素显示
          duration: duration.value
        }
      let options = {}
      primitives.showModels(points, options)
    }
    return {
      onReadyMap, change_color, color, colorMode, change_colorMode, duration_change, duration, height_change, height, scale_change, scale, rotate_change, rotate, minimumPixelSize, minimumPixelSize_change
    }
  },
})
</script>
<style lang="scss">
.ModelCongfig {
  .el-color-picker.el-color-picker--mini.color-pick-s{
    position: relative;
    top: 9px;
    left: 11px;
  }
  .el-radio__label{
    color: #ffffff;
  }
}
</style>
<style lang="scss" scoped>
.ModelCongfig {
  position: absolute;
  top: 10px;
  left: 10px;
  .model_con{
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