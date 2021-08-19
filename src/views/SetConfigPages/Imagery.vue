<!--
 * @Description:  imagery
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-08-18 08:54:00
 * @LastEditors: Hawk
 * @LastEditTime: 2021-08-19 09:42:24
-->
<template>
  <CesiumContainer
    ref="CesiumContainerRef"
    :isImagery="true"
    @update:onReadyMap="onReadyMap"
  >
    <template v-slot:configCom>
      <div class="ImageryCongfig">
        <PannelBox>
          <template v-slot:content>
            <div class="imagery_con">
              <span class="c_title">饱和度：{{ saturation }}</span>
              <el-slider
                v-model="saturation"
                :min="-5"
                :max="5"
                :step="0.05"
                @input="change_interfaceConfig('saturation')"
              ></el-slider>
              <span class="c_title">亮度：{{ brightness }}</span>
              <el-slider
                v-model="brightness"
                :min="-10"
                :max="10"
                :step="0.1"
                @input="change_interfaceConfig('brightness')"
              ></el-slider>
              <span class="c_title">对比度：{{ contrast }}</span>
              <el-slider
                v-model="contrast"
                :min="-10"
                :max="10"
                :step="0.1"
                @input="change_interfaceConfig('contrast')"
              ></el-slider>
              <span class="c_title">色调：{{ hue }}</span>
              <el-slider
                v-model="hue"
                :min="-2"
                :max="2"
                :step="0.02"
                @input="change_interfaceConfig('hue')"
              ></el-slider>
              <span class="c_title">伽马校正：{{ gamma }}</span>
              <el-slider
                v-model="gamma"
                :min="-5"
                :max="5"
                :step="0.05"
                @input="change_interfaceConfig('gamma')"
              ></el-slider>
              <span class="c_title">是否反色：</span><el-switch v-model="invertColor" @change="change_interfaceConfig('invertColor')"></el-switch><br>
              <span class='c_title'>滤镜颜色：{{color}}</span>
              <el-color-picker v-model="color" color-format="rgb" size="mini" class="color-pick-s" @active-change="change_interfaceConfig('color', $event)"></el-color-picker><br><br>
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
import { defineComponent, ref, onMounted } from 'vue'
// import { string_to_name } from '@/utils/common'
declare const Cesium: any
export default defineComponent({
  name: 'ImageryCongfig',
  components: { CesiumContainer, PannelBox },
  setup() {
    const saturation = ref(0)
    const brightness = ref(0.6)
    const contrast = ref(1.8)
    const hue = ref(1)
    const gamma = ref(0.3)
    const invertColor = ref(true)
    const color = ref('rgb(78,112,166)')
    const CesiumContainerRef = ref()
    onMounted(() => {
      CesiumContainerRef.value.initImageryMap([
        {
          type: 'UrlTemplateImageryProvider',
          classConfig: {
            url: 'http://webst03.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&style=7',
          },
          interfaceConfig: {
            saturation: 0,
            brightness: 0.6,
            contrast: 1.8,
            hue: 1,
            gamma: 0.3,
          },
          offset: '0,0',
          invertswitch: 1,
          filterRGB: '#4e70a6',
          showswitch: 1,
        },
      ])
    })
    const change_interfaceConfig = (type: string, color = '') => {
      const baseLayer = window.Gviewer.imageryLayers.get(0)
      try {
        switch (type) {
          case 'saturation':
            baseLayer[type] = saturation.value
            break
          case 'brightness':
            baseLayer[type] = brightness.value
            break
          case 'contrast':
            baseLayer[type] = contrast.value
            break
          case 'hue':
            baseLayer[type] = hue.value
            break
          case 'gamma':
            baseLayer[type] = gamma.value
            break
          case 'invertColor':
            baseLayer[type] = invertColor.value
            window.Gviewer.scene.requestRenderMode = true
            window.Gviewer.scence.requestRender()
            window.Gviewer.scene.forceRender()
            break
          case 'color':
            if (color) {
              const tmpColor = (new Cesium.Color.fromCssColorString(color)).toBytes()
              baseLayer.filterRGB = [tmpColor[0], tmpColor[1], tmpColor[2]]
            }
            break
          default:
        }
      }
      catch (error) {
        console.log(error)
      }
    }
    const onReadyMap = () => {
      // let url = getUrlParma('url')
    }
    return {
      onReadyMap,
      CesiumContainerRef,
      saturation,
      change_interfaceConfig, brightness, contrast, hue, gamma, invertColor, color
    }
  },
})
</script>
<style lang="scss">
  .ImageryCongfig {
    .imagery_con{
      .el-color-picker.el-color-picker--mini.color-pick-s{
        position: relative;
        top: 9px;
        left: 11px;
      }
    }
  }
  </style>
<style lang="scss" scoped>
.ImageryCongfig {
  position: absolute;
  top: 10px;
  left: 10px;
  .imagery_con {
    margin-top: 10px;
    text-align: left;
    .c_title {
      color: white;
      font-size: 0.8em;
    }
  }
}
</style>
