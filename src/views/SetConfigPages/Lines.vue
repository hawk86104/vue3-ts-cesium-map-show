
<!--
 * @Description: 
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-09-23 15:08:55
 * @LastEditors: Hawk
 * @LastEditTime: 2021-09-23 16:43:30
-->
<template>
  <CesiumContainer @update:onReadyMap="onReadyMap">
    <template v-slot:configCom>
      <div class="LinesCongfig">
        <PannelBox>
          <template v-slot:content>
            <div class="lines_con">
              dsa
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
  name: 'EffectCongfig',
  components: { CesiumContainer, PannelBox },
  setup() {
    const color = ref('rgba(198, 6, 88, 0.7)')
    color.value = getUrlParma('color') ? getUrlParma('color') : color.value

    const bbox = ref([113.9509, 22.5379, 113.9694, 22.5692])
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

    const random = ref(100)
    random.value = getUrlParma('random') ? getUrlParma('random') : random.value
    
    const onReadyMap = () => {
      // 载入默认白膜
      const GTitleset = new Titleset(window.Gviewer)
      GTitleset.init()

      // 公路效果
      const GRoadNetwork = new RoadNetwork(window.Gviewer, 'road')
      GRoadNetwork.addFlyLines(bbox.value, color.value, width.value, height.value, speed.value, percent.value, gradient.value, random.value)
    }
    return {
      onReadyMap
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
