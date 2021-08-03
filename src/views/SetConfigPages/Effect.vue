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
              </el-select>
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
    const onReadyMap = () => {
      // 载入默认白膜
      const GTitleset = new Titleset(window.GController)
      GTitleset.init()

      // 首先增加一个效果 然后 手动更改其 颜色
      const GEllipsoidFade = new EllipsoidFade(window.GController)
      const eid = GEllipsoidFade.add([113.9303, 22.5216, 8], 'rgba(0,255,0,0.8)', 1000, 3000)
      const curEntity = window.GController.entities.getById(eid)
      // curEntity._ellipse._material.color = new Cesium.Color.fromCssColorString('rgba(0,0,255,0.8)')
      debugger
      console.log(curEntity)
    }
    return {
      onReadyMap,
      selEffect,
      effectsList,
    }
  },
})
</script>
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
