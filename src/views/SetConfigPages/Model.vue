<!--
 * @Description: 
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-10-13 09:26:38
 * @LastEditors: Hawk
 * @LastEditTime: 2021-10-15 16:03:50
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
              <span class='c_title'>转速：{{rotateSpeed}} </span>
              <el-slider v-model="rotateSpeed" :min="0" :max="20" :step="1" @input="rotateSpeed_change"></el-slider><br>
              <span class='c_title'>旋转(横向)：{{LatRotation}} °</span>
              <el-slider v-model="LatRotation" :min="0" :max="7" :step="0.02" @input="LatRotation_change"></el-slider><br><br>
              <span class='c_title'>鼠标操控：</span>
              <el-switch v-model="ModelCanMove" @change="ModelCanMove_change"></el-switch>
              <el-button @click="goToCenter" style="float: right;" size="mini">移动到屏幕中心</el-button><br>
              <span class='c_title'>lon经度：</span>
              <el-input class="input_c_p" type="number" size="small" v-model="positionLon" @change="position_change"></el-input><br>
              <span class='c_title'>lat纬度：</span>
              <el-input class="input_c_p" type="number" size="small" v-model="positionLat" @change="position_change"></el-input><br><br>
              <span class='c_title'>高度：{{height}} 米</span>
              <el-slider v-model="height" :min="0" :max="1000" :step="20" @input="height_change"></el-slider><br><br>
              <span class='c_title'>大小：{{scale}} 倍</span>
              <el-slider v-model="scale" :min="1" :max="1000" :step="10" @input="scale_change"></el-slider><br>
              <span class='c_title'>最小显示：{{minimumPixelSize}} 像素</span>
              <el-slider v-model="minimumPixelSize" :min="1" :max="800" :step="10" @input="minimumPixelSize_change"></el-slider><br>
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
import { GController } from '@/utils/ctrlCesium/Controller'
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
    const color = ref('rgba(255, 255, 255, 1)')
    color.value = getUrlParma('color') ? getUrlParma('color') : color.value
    const colorMode = ref('HIGHLIGHT')
    colorMode.value = getUrlParma('colorMode') ? getUrlParma('colorMode') : colorMode.value
    const duration = ref(20)
    duration.value = getUrlParma('duration') ? getUrlParma('duration') : duration.value
    const positionLon = ref('121.51568329')
    positionLon.value = getUrlParma('positionLon') ? getUrlParma('positionLon') : positionLon.value
    const positionLat = ref('31.22982201')
    positionLat.value = getUrlParma('positionLat') ? getUrlParma('positionLat') : positionLat.value
    const height = ref(240)
    height.value = getUrlParma('height') ? getUrlParma('height') : height.value
    const scale = ref(641)
    scale.value = getUrlParma('scale') ? getUrlParma('scale') : scale.value
    const rotateSpeed = ref(0)
    rotateSpeed.value = getUrlParma('rotateSpeed') ? getUrlParma('rotateSpeed') : rotateSpeed.value
    const minimumPixelSize = ref(21)
    minimumPixelSize.value = getUrlParma('minimumPixelSize') ? getUrlParma('minimumPixelSize') : minimumPixelSize.value
    const ModelCanMove = ref(false)
    
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
    const rotateSpeed_change = (val: string) => {
      if (primitives && window.Gviewer.entities) {
        primitives.changePrimitiverotateSpeed(IdModel, val)
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
    const LatRotation = ref(3.76)
    LatRotation.value = getUrlParma('LatRotation') ? getUrlParma('LatRotation') : LatRotation.value
    const LatRotation_change = (val: number) => {
      if (primitives && window.Gviewer.entities) {
        primitives.changePrimitiveLatRotation(IdModel, val)
      }
    }
    const scale_change = (val: number) => {
      if (primitives && window.Gviewer.entities) {
        primitives.changePrimitiveScale(IdModel, val)
      }
    }
    const ModelCanMove_change = (val: boolean) => {
      if (primitives && window.Gviewer.entities) {
        if (val) {
          primitives.addMouseEvent()
        }
        else {
          primitives.removeMouseEvent()
        }
      }
    }
    const minimumPixelSize_change = (val: number) => {
      if (primitives && window.Gviewer.entities) {
        primitives.changePrimitiveMinimumPixelSize(IdModel, val)
      }
    }
    const position_change = () => {
      if (primitives && window.Gviewer.entities) {
        primitives.changePrimitivePosition(IdModel, parseFloat(positionLon.value), parseFloat(positionLat.value))
      }
    }
    const update_position = (ob: any) => {
      positionLon.value = ob.lon
      positionLat.value = ob.lat
    }
    const save = () => {
      // 
    }
    const goToCenter = () => {
      if (primitives && window.Gviewer.entities) {
        let ob = GController.getCurCenterlonLat(window.Gviewer)
        primitives.changePrimitivePosition(IdModel, ob.lon, ob.lat)
        update_position(ob)
      }
    }
    const onReadyMap = () => {
      // 载入默认白膜
      const GTitleset = new Titleset(window.Gviewer)
      GTitleset.init()

      primitives = new Primitive(window.Gviewer)
      primitives.update_position = update_position
      let points =
        {
          id: IdModel,
          lon: parseFloat(positionLon.value),
          lat: parseFloat(positionLat.value),
          height: height.value,
          heading: LatRotation.value,
          pitch: 0,
          roll: 0,
          colorMode: colorMode.value,
          // uri: 'https://mapv-data.oss-cn-hangzhou.aliyuncs.com/model/pyramid.glb',
          uri: 'https://a.amap.com/jsapi_demos/static/gltf-online/shanghai/scene.gltf',
          scale: scale.value, // 3580
          rotateSpeed: rotateSpeed.value, // 转速
          modelColor: color.value,
          minimumPixelSize: minimumPixelSize.value, // 模型最小以多少像素显示
          duration: duration.value
        }
      let options = {}
      primitives.showModels(points, options)
    }
    return {
      onReadyMap, change_color, color, colorMode, change_colorMode, duration_change, duration, height_change, height, scale_change,
      scale, rotateSpeed_change, rotateSpeed, minimumPixelSize, minimumPixelSize_change, positionLon, positionLat, position_change, goToCenter, save, 
      LatRotation_change, LatRotation, ModelCanMove, ModelCanMove_change
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