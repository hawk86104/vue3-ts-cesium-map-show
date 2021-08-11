<template>
  <CesiumContainer @update:onReadyMap="onReadyMap">
    <template v-slot:configCom>
      <div class="EffectCongfig">
        <PannelBox>
          <template v-slot:content>
            <div class="effect_con">
              <span class="c_title">请选择效果：</span>
              <el-select v-model="selEffect" size="mini" placeholder="效果类型" @change="effect_selEffect_change">
                <el-option
                  v-for="item in effectsList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select><br><br>
              <span class='c_title'>lon经度：</span>
              <el-input class="input_c_p" size="small" v-model="positionEffect[0]" @change="effect_position_change"></el-input><br><br>
              <span class='c_title'>lat纬度：</span>
              <el-input class="input_c_p" size="small" v-model="positionEffect[1]" @change="effect_position_change"></el-input><br><br>
              <span class='c_title'>高度(米)：{洒在建筑物上，无效}</span>
              <el-input class="input_c_p" size="small" v-model="positionEffect[2]" @change="effect_position_change"></el-input><br><br>
              <span class='c_title'>效果颜色：{{color}}</span>
              <el-color-picker v-model="color" show-alpha size="mini" class="color-pick-s" @active-change="change_color"></el-color-picker><br><br>
              <span class='c_title'>效果延迟：{{duration}} 毫秒</span>
              <el-slider v-model="duration" :min="500" :max="10000" :step="500" @input="effect_duration_change"></el-slider><br>
              <span class='c_title'>最大半径：{{maxRadius}} 米</span>
              <el-slider v-model="maxRadius" :min="200" :max="10000" :step="200" @input="effect_maxRadius_change"></el-slider><br>
              <template v-if="selEffect==='CircleWave'">
                <span class='c_title'>波浪条纹数：{{waveCount}} 个</span>
                <el-slider v-model="waveCount" :min="1" :max="10" :step="1" @input="effect_waveCount_change"></el-slider><br>
              </template>
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
import HexagonSpread from '@/utils/ctrlCesium/effects/HexagonSpread'
import Scanline from '@/utils/ctrlCesium/effects/Scanline'
import CircleWave from '@/utils/ctrlCesium/effects/CircleWave'
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
    const selEffect = ref('CircleDiffusion')
    const effectsList = ref([
      { value: 'CircleDiffusion', label: '圆扩散' },
      { value: 'Scanline', label: '线圈发光扩散' },
      { value: 'CircleWave', label: '水波纹' },
      { value: 'HexagonSpread', label: '六边形扩散' },
      { value: 'SpreadWall', label: '墙推扩散' },
      { value: 'CircleScan', label: '雷达圆扫' },
    ])
    const color = ref('rgba(19, 206, 102, 0.8)')
    const duration = ref(3000)
    const maxRadius = ref(1000)
    const waveCount = ref(3)
    const positionEffect = ref([113.9303, 22.5216, 0])
    let curEntityC = null
    const onReadyMap = () => {
      // 载入默认白膜
      const GTitleset = new Titleset(window.GController)
      GTitleset.init()

      // 首先增加一个效果 然后 手动更改其 颜色
      curEntityC = new EllipsoidFade(window.GController, 'effect-set-config')
      curEntityC.add(positionEffect.value, color.value, maxRadius.value, duration.value)
      curEntityC.update_position = update_position
    }
    const effect_selEffect_change = (e: any) => {
      curEntityC.del()
      let pe: any = positionEffect.value
      pe = [parseFloat(pe[0]), parseFloat(pe[1]), parseFloat(pe[2])]
      switch (e) {
        case 'CircleDiffusion':
          curEntityC = new EllipsoidFade(window.GController, 'effect-set-config' + e)
          curEntityC.add(pe, color.value, maxRadius.value, duration.value)
          break
        case 'Scanline':
          curEntityC = new Scanline(window.GController, 'effect-set-config' + e)
          curEntityC.add(pe, color.value, maxRadius.value, duration.value)
          break
        case 'CircleWave':
          curEntityC = new CircleWave(window.GController, 'effect-set-config' + e)
          curEntityC.add(pe, color.value, maxRadius.value, duration.value, waveCount.value)
          break
        case 'HexagonSpread':
          curEntityC = new HexagonSpread(window.GController, 'effect-set-config' + e)
          curEntityC.add(pe, color.value, maxRadius.value, duration.value)
          break
        default:
      }
      curEntityC.update_position = update_position
    }
    const update_position = (ob: any) => {
      positionEffect.value = ob
    }
    const effect_position_change = (e: any) => {
      curEntityC.change_position(positionEffect.value)
    }
    const change_color = (val: string) => {
      if (curEntityC && window.GController.entities) {
        curEntityC.change_color(val)
      }
    }
    const effect_duration_change = (val: number) => {
      if (curEntityC && window.GController.entities) {
        curEntityC.change_duration(val)
      }
    }
    const effect_maxRadius_change = (val: number) => {
      if (curEntityC && window.GController.entities) {
        curEntityC.maxRadius = val
      }
    }
    const effect_waveCount_change = (val: number) => {
      if (curEntityC && window.GController.entities) {
        curEntityC.change_waveCount(val)
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
      effect_maxRadius_change,
      positionEffect,
      effect_position_change,
      waveCount,
      effect_waveCount_change,
      effect_selEffect_change
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
    width: 20em;
    .c_title{
      color: white;
      font-size: 0.8em;
    }
    .input_c_p{
      // width: 16em;
    }
  }
}
</style>
