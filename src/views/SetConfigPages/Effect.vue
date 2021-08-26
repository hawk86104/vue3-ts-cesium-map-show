<template>
  <CesiumContainer @update:onReadyMap="onReadyMap">
    <template v-slot:configCom>
      <div class="EffectCongfig">
        <PannelBox>
          <template v-slot:content>
            <div class="effect_con">
              <span class="c_title">请选择效果：</span>
              <el-select-v2 v-model="selEffect" size="mini" placeholder="效果类型" @change="effect_selEffect_change" :options="effectsList">
              </el-select-v2><br><br>
              <span class='c_title'>lon经度：</span>
              <el-input class="input_c_p" size="small" v-model="positionEffect[0]" @change="effect_position_change"></el-input><br><br>
              <span class='c_title'>lat纬度：</span>
              <el-input class="input_c_p" size="small" v-model="positionEffect[1]" @change="effect_position_change"></el-input><br><br>
              <template v-if="selEffect==='SpreadWall'">
                <span class='c_title'>高度(米)：</span>
                <el-input class="input_c_p" size="small" v-model="positionEffect[2]" @change="effect_position_change"></el-input><br><br>
              </template>
              <span class='c_title'>效果颜色：{{color}}</span>
              <el-color-picker v-model="color" show-alpha size="mini" class="color-pick-s" @active-change="change_color"></el-color-picker><br><br>
              <span class='c_title'>最大半径：{{maxRadius}} 米</span>
              <el-slider v-model="maxRadius" :min="200" :max="10000" :step="200" @input="effect_maxRadius_change"></el-slider><br>
              <template v-if="selEffect!=='CircleScan'">
                <span class='c_title'>效果延迟：{{duration}} 毫秒</span>
                <el-slider v-model="duration" :min="500" :max="10000" :step="500" @input="effect_duration_change"></el-slider><br>
              </template>
              <template v-if="selEffect==='CircleScan'">
                <span class='c_title'>步长：{{step}} </span>
                <el-slider v-model="step" :min="-0.3" :max="0.3" :step="0.005" @input="effect_step_change"></el-slider><br>
              </template>
              <template v-if="selEffect==='CircleWave'">
                <span class='c_title'>波浪条纹数：{{waveCount}} 个</span>
                <el-slider v-model="waveCount" :min="1" :max="10" :step="1" @input="effect_waveCount_change"></el-slider><br>
              </template>
              <template v-if="selEffect==='SpreadWall'">
                <span class='c_title'>效果墙高度：{{height}} 米</span>
                <el-slider v-model="height" :min="0" :max="1000" :step="20" @input="effect_height_change"></el-slider><br>
                <span class='c_title'>多边形边数：{{edgeCount}} 个{0为圆形}</span>
                <el-slider v-model="edgeCount" :min="0" :max="10" :step="1" @input="effect_edgeCount_change"></el-slider><br>
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
import EllipsoidFade from '@/utils/ctrlCesium/effects/EllipsoidFade'
import HexagonSpread from '@/utils/ctrlCesium/effects/HexagonSpread'
import Scanline from '@/utils/ctrlCesium/effects/Scanline'
import CircleWave from '@/utils/ctrlCesium/effects/CircleWave'
import RaderScan from '@/utils/ctrlCesium/effects/RaderScan'
import SpreadWall from '@/utils/ctrlCesium/effects/SpreadWall'
import { defineComponent, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

export default defineComponent({
  name: 'EffectCongfig',
  components: { CesiumContainer, PannelBox },
  setup() {
    const selEffect = ref('CircleDiffusion')
    selEffect.value = getUrlParma('selEffect') ? getUrlParma('selEffect') : selEffect.value
    const effectsList = ref([
      { value: 'CircleDiffusion', label: '圆扩散' },
      { value: 'Scanline', label: '线圈发光扩散' },
      { value: 'CircleWave', label: '水波纹' },
      { value: 'HexagonSpread', label: '六边形扩散' },
      { value: 'CircleScan', label: '雷达圆扫' },
      { value: 'SpreadWall', label: '墙推扩散' },
    ])
    const color = ref('rgba(198, 6, 88, 0.7)')
    color.value = getUrlParma('color') ? getUrlParma('color') : color.value
    const duration = ref(3000)
    duration.value = !isNaN(getUrlParma('duration', 'int')) ? getUrlParma('duration', 'int') : duration.value
    const maxRadius = ref(1000)
    maxRadius.value = !isNaN(getUrlParma('maxRadius', 'int')) ? getUrlParma('maxRadius', 'int') : maxRadius.value
    const waveCount = ref(3)
    waveCount.value = !isNaN(getUrlParma('waveCount', 'int')) ? getUrlParma('waveCount', 'int') : waveCount.value
    const step = ref(-0.01)
    step.value = !isNaN(getUrlParma('step', 'float')) ? getUrlParma('step', 'float') : step.value
    const height = ref(500)
    height.value = !isNaN(getUrlParma('height', 'int')) ? getUrlParma('height', 'int') : height.value
    const edgeCount = ref(5)
    edgeCount.value = !isNaN(getUrlParma('edgeCount', 'int')) ? getUrlParma('edgeCount', 'int') : edgeCount.value
    const positionEffect = ref([113.9218, 22.5116, 0])
    positionEffect.value = getUrlParma('position', 'array') ? getUrlParma('position', 'array') : positionEffect.value
    let curEntityC = null
    const onReadyMap = () => {
      // 载入默认白膜
      const GTitleset = new Titleset(window.Gviewer)
      GTitleset.init()

      effect_selEffect_change(selEffect.value)
    }
    const effect_selEffect_change = (e: any) => {
      if (curEntityC) {
        curEntityC.del()
      }
      let pe: any = positionEffect.value
      pe = [parseFloat(pe[0]), parseFloat(pe[1]), parseFloat(pe[2])]
      switch (e) {
        case 'CircleDiffusion':
          curEntityC = new EllipsoidFade(window.Gviewer, 'effect-set-config' + e)
          curEntityC.add(pe, color.value, maxRadius.value, duration.value, true)
          break
        case 'Scanline':
          curEntityC = new Scanline(window.Gviewer, 'effect-set-config' + e)
          curEntityC.add(pe, color.value, maxRadius.value, duration.value, true)
          break
        case 'CircleWave':
          curEntityC = new CircleWave(window.Gviewer, 'effect-set-config' + e)
          curEntityC.add(pe, color.value, maxRadius.value, duration.value, true, waveCount.value)
          break
        case 'HexagonSpread':
          curEntityC = new HexagonSpread(window.Gviewer, 'effect-set-config' + e)
          curEntityC.add(pe, color.value, maxRadius.value, duration.value, true)
          break
        case 'CircleScan':
          curEntityC = new RaderScan(window.Gviewer, 'effect-set-config' + e)
          curEntityC.add(pe, color.value, maxRadius.value, step.value, true)
          break
        case 'SpreadWall':
          curEntityC = new SpreadWall(window.Gviewer, 'effect-set-config' + e)
          curEntityC.add(pe, color.value, maxRadius.value, duration.value, height.value, edgeCount.value, true)
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
    const effect_height_change = (val: number) => {
      if (curEntityC && window.Gviewer.entities) {
        curEntityC.change_height(val)
      }
    }
    const effect_edgeCount_change = (val: number) => {
      if (curEntityC && window.Gviewer.entities) {
        curEntityC.edgeCount = val
      }
    }
    const change_color = (val: string) => {
      if (!val) {
        val = 'rgba(255,255,255,1)'
        color.value = val
      }
      if (curEntityC && window.Gviewer.entities) {
        curEntityC.change_color(val)
      }
    }
    const effect_duration_change = (val: number) => {
      if (curEntityC && window.Gviewer.entities) {
        curEntityC.change_duration(val)
      }
    }
    const effect_maxRadius_change = (val: number) => {
      if (curEntityC && window.Gviewer.entities) {
        curEntityC.maxRadius = val
      }
    }
    const effect_waveCount_change = (val: number) => {
      if (curEntityC && window.Gviewer.entities) {
        curEntityC.change_waveCount(val)
      }
    }
    const effect_step_change = (val: number) => {
      if (curEntityC && window.Gviewer.entities) {
        curEntityC.change_step(val)
      }
    }
    const save = () => {
      ElMessageBox.confirm('提交保存当前效果配置信息, 是否继续?', '提示', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 保存现有 效果配置 调用后台
          (window.parent as any).postMessage({
            selEffect: selEffect.value,
            color: color.value,
            duration: duration.value,
            maxRadius: maxRadius.value,
            waveCount: waveCount.value,
            step: step.value,
            height: height.value,
            edgeCount: edgeCount.value,
            positionx: positionEffect.value[0],
            positiony: positionEffect.value[1],
            positionz: positionEffect.value[2]
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
      effect_selEffect_change,
      step,
      effect_step_change,
      height,
      effect_height_change,
      edgeCount,
      effect_edgeCount_change,
      save
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
  }
}
</style>
