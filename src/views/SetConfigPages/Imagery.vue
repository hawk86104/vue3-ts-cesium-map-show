<!--
 * @Description:  imagery
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-08-18 08:54:00
 * @LastEditors: Hawk
 * @LastEditTime: 2021-08-24 14:30:28
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
              <el-button @click="save">保存当前配置</el-button>
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
import { getUrlParma } from '@/utils/common'
import { ElMessageBox, ElMessage } from 'element-plus'
import { colorRGB2Hex } from '@/utils/color'
declare const Cesium: any
export default defineComponent({
  name: 'ImageryCongfig',
  components: { CesiumContainer, PannelBox },
  setup() {
    const saturation = ref(1.0)
    const brightness = ref(1.0)
    const contrast = ref(1.0)
    const hue = ref(0.0)
    const gamma = ref(1.0)
    const invertColor = ref(true)
    const color = ref('rgb(255,255,255)') // rgb(78,112,166)
    const CesiumContainerRef = ref()
    const save = () => {
      ElMessageBox.confirm('提交保存当前图层的配置信息, 是否继续?', '提示', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          (window.parent as any).postMessage({
            color: colorRGB2Hex(color.value),
            invertColor: invertColor.value,
            interfaceConfig: {
              saturation: saturation.value,
              brightness: brightness.value,
              contrast: contrast.value,
              hue: hue.value,
              gamma: gamma.value,
            }
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
    onMounted(() => {
      let urlArr = getUrlParma('urlArr')
      urlArr = decodeURI(urlArr)
      urlArr = JSON.parse(urlArr)
      let interfaceConfig = getUrlParma('interfaceConfig')
      interfaceConfig = JSON.parse(decodeURI(interfaceConfig))
      if (interfaceConfig) {
        if (interfaceConfig.saturation || interfaceConfig.saturation === 0) {
          saturation.value = interfaceConfig.saturation
        }
        if (interfaceConfig.brightness || interfaceConfig.brightness === 0) {
          brightness.value = interfaceConfig.brightness
        }
        if (interfaceConfig.contrast || interfaceConfig.contrast === 0) {
          contrast.value = interfaceConfig.contrast
        }
        
        if (interfaceConfig.hue || interfaceConfig.hue === 0) {
          hue.value = interfaceConfig.hue
        }
        if (interfaceConfig.gamma || interfaceConfig.gamma === 0) {
          gamma.value = interfaceConfig.gamma
        }
      }
      let inColorBool = getUrlParma('invertColor', 'int')
      if (!isNaN(inColorBool)) {
        invertColor.value = inColorBool === 1
      }
      let colorP = getUrlParma('color')
      if (!isNaN(colorP) || colorP) {
        color.value = colorP
      }
      let type = getUrlParma('type')
      let defaultParams = {
        type: type,
        classConfig: urlArr,
        interfaceConfig: interfaceConfig,
        invertswitch: inColorBool,
        offset: '0,0',
        filterRGB: colorP,
      }
      CesiumContainerRef.value.initImageryMap([defaultParams])
    })
    const change_interfaceConfig = (type: string, Tcolor = '') => {
      const baseLayer = window.Gviewer.imageryLayers.get(0)
      let tmpColor: any = null
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
            baseLayer[type] = invertColor.value ? 1 : 0
            break
          case 'color':
            if (!Tcolor) {
              Tcolor = 'rgba(255,255,255,0)'
              color.value = Tcolor
            }
            tmpColor = (new Cesium.Color.fromCssColorString(Tcolor)).toBytes()
            baseLayer.filterRGB = [tmpColor[0], tmpColor[1], tmpColor[2]]
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
      change_interfaceConfig, brightness, contrast, hue, gamma, invertColor, color, save
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
