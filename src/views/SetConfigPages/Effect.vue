<template>
  <CesiumContainer @update:onReadyMap="onReadyMap">
    <template v-slot:configCom>
      <div class="EffectCongfig">
        <PannelBox>
          <template v-slot:content>
            <div class="effect_con">
              <span class="c_title">请选择效果：</span>
              <el-select v-model="selEffect" size="mini" placeholder="效果类型">
                <el-option
                  v-for="item in effectsList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select><br><br>
              <span class='c_title'>效果颜色：{{color}}</span>
              <el-color-picker v-model="color" show-alpha size="mini" class="color-pick-s" @active-change="change_color"></el-color-picker><br><br>
              <span class='c_title'>效果延迟：{{duration}} 毫秒</span>
              <el-slider v-model="duration" :min="500" :max="10000" :step="500" @input="effect_duration_change"></el-slider><br><br>
              <span class='c_title'>最大半径：{{maxRadius}} 米</span>
              <el-slider v-model="maxRadius" :min="500" :max="10000" :step="500" @input="effect_maxRadius_change"></el-slider><br><br>
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

import Titleset from '@/utils/ctrlCesium/Titleset'
import EllipsoidFade from '@/utils/ctrlCesium/effects/EllipsoidFade'
import { defineComponent, ref } from 'vue'
declare global {
  interface Window {
    GController: any
  }
}
declare const Cesium: any
export default defineComponent({
  name: 'EffectCongfig',
  components: { CesiumContainer, PannelBox },
  setup() {
    const selEffect = ref()
    const effectsList = ref([
      { value: 'CircleDiffusion', label: '圆扩散' },
      { value: 'CircleScan', label: '雷达圆扫' },
      { value: 'CircleWave', label: '水波纹' },
      { value: 'HexagonSpread', label: '六边形扩散' },
      { value: 'SpreadWall', label: '墙推扩散' },
    ])
    const color = ref('rgba(19, 206, 102, 0.8)')
    const duration = ref(3000)
    const maxRadius = ref(1000)
    let curEntityC = null
    const onReadyMap = () => {
      // 载入默认白膜
      const GTitleset = new Titleset(window.GController)
      GTitleset.init()

      // 首先增加一个效果 然后 手动更改其 颜色
      curEntityC = new EllipsoidFade(window.GController, 'effect-co-1')
      curEntityC.add([113.9303, 22.5216, 8], color.value, maxRadius.value, duration.value)
    }
    const change_color = (val: string) => {
      if (curEntityC && window.GController.entities) {
        const curEntity = window.GController.entities.getById(curEntityC.id)
        curEntity._ellipse._material.color = new Cesium.Color.fromCssColorString(val)
      }
    }
    const effect_duration_change = (val: number) => {
      if (curEntityC && window.GController.entities) {
        curEntityC.duration = val
      }
    }
    const effect_maxRadius_change = (val: number) => {
      if (curEntityC && window.GController.entities) {
        curEntityC.maxRadius = val
      }
    }
    return {
      onReadyMap,
      selEffect,
      effectsList,
      change_color,
      color,
      duration,
      effect_duration_change,
      maxRadius,
      effect_maxRadius_change
    }
  },
})
</script>
<style lang="scss">
.EffectCongfig {
  .el-color-picker.el-color-picker--mini.color-pick-s{
    position: relative;
    top: 9px;
    left: 11px;
  }
}
</style>
<style lang="scss" scoped>
.EffectCongfig {
  position: absolute;
  top: 10px;
  left: 10px;
  .effect_con{
    margin-top: 10px;
    text-align: left;
    .c_title{
      color: white;
      font-size: 0.8em;
    }
  }
}
</style>
