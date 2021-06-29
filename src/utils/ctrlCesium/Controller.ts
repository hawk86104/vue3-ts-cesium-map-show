/* eslint no-multi-str: "off" */
/* eslint-disable no-debugger */
declare const Cesium: any
// import Cesium from './Cesium'
import { colorRgb } from '@/utils/color'
import { evil } from '@/utils/common'
import CesiumNavigation from 'cesium-navigation-es6'

class Controller {
  // 初始化 controller 类
  viewer: any
  constructor() {
    this.init_data()
  }
  init_data() {
    this.viewer = null
  }
  init(BaseMapConfig: any, MapImageryList: any) {
    const mapID = 'cesiumContainer'
    let imageryProviderConfig = new Cesium.SingleTileImageryProvider({
      url: './Cesium-1.82-hawk/background.png',
    })
    if (MapImageryList.length !== 0) {
      imageryProviderConfig = this.setOneimageryProvider(MapImageryList[0])
    }
    let vConfig = {
      // 加载单张影像 第一层最小最透明的
      imageryProvider: imageryProviderConfig,
      contextOptions: {
        webgl: {
          alpha: false,
        },
      },
      // 默认设置
      baseLayerPicker: false, // 基础影响图层选择器
      navigationHelpButton: false, // 导航帮助按钮
      animation: false, // 动画控件
      timeline: false, // 时间控件
      shadows: false, // 显示阴影
      shouldAnimate: true, // 模型动画效果 大气
      // skyBox: false as unknown as Cesium.SkyBox, // 天空盒
      skyBox: false,
      infoBox: false, // 显示 信息框
      fullscreenButton: false, // 是否显示全屏按钮
      homeButton: true, // 是否显示首页按钮
      geocoder: false, // 默认不显示搜索栏地址
      sceneModePicker: true, // 是否显示视角切换按钮
    }
    vConfig = Object.assign(vConfig, BaseMapConfig) // 后台接口配置 融合替换 默认配置
    const viewer = new Cesium.Viewer(mapID, vConfig)
    if (!BaseMapConfig['logo']) {
      const cC = viewer.cesiumWidget.creditContainer as HTMLElement
      cC.style.display = 'none' // 影藏logo
    }
    // 初始化 cesium-navigation 控件
    this.initCesiumNavigation(viewer)

    // 增加配置图层
    this.setConfigMapList(viewer, MapImageryList)
    // 消除锯齿
    this.removeJagged(viewer)
    this.viewer = viewer
    return viewer
  }
  initCesiumNavigation(viewer: any) {
    const options: any = {}
    // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
    options.defaultResetView = new Cesium.Rectangle.fromDegrees(80, 22, 130, 50)
    // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
    options.enableCompass = true
    // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
    options.enableZoomControls = true
    // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
    options.enableDistanceLegend = true
    // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
    options.enableCompassOuterRing = true
    CesiumNavigation(viewer, options)
    debugger
  }
  setOneimageryProvider(MapImagery: any): any {
    if (MapImagery.classConfig.customTags) {
      MapImagery.classConfig.customTags = evil(
        '(' + MapImagery.classConfig.customTags + ')'
      )
    }
    return new Cesium[MapImagery.type](MapImagery.classConfig)
  }
  setConfigMapList(viewer: any, MapImageryList: any) {
    const imageryLayers = viewer.imageryLayers
    MapImageryList.some((elem: any, index: number) => {
      if (index === 0) {
        return false
      }
      imageryLayers.addImageryProvider(this.setOneimageryProvider(elem))
    })
    // 设置具体的 ImageryLayer 参数
    MapImageryList.some((elem: any, index: number) => {
      const baseLayer = viewer.imageryLayers.get(index)
      if (elem.interfaceConfig) {
        Object.getOwnPropertyNames(elem.interfaceConfig).forEach(function(
          key
        ) {
          baseLayer[key] = elem.interfaceConfig[key]
        })
      }
      // 设置 滤镜效果
      baseLayer.invertColor = elem.invertswitch
      baseLayer.filterRGB = [255.0, 255.0, 255.0]
      if (elem.filterRGB !== '#000000' && elem.filterRGB !== '#ffffff') {
        baseLayer.filterRGB = colorRgb(elem.filterRGB)
      }

      // 设置 offset 偏移量
      const offset: Array<string> = elem.offset.split(',')
      if (offset.length === 2) {
        try {
          const oxy: Array<number> = [
            parseFloat(offset[0]),
            parseFloat(offset[1]),
          ]
          baseLayer._imageryProvider._tilingScheme._rectangleNortheastInMeters.x += oxy[0]
          baseLayer._imageryProvider._tilingScheme._rectangleNortheastInMeters.y += oxy[1]
        }
        catch (error) {
          console.log(error)
        }
      }
    })
  }
  // 消除锯齿
  removeJagged(viewer: any) {
    viewer.scene.postProcessStages.fxaa.enabled = false
    viewer.scene.fxaa = false
    const supportsImageRenderingPixelated =
      viewer.cesiumWidget._supportsImageRenderingPixelated
    if (supportsImageRenderingPixelated) {
      let vtxf_dpr = window.devicePixelRatio
      while (vtxf_dpr >= 2.0) {
        vtxf_dpr /= 2.0
      }
      viewer.resolutionScale = vtxf_dpr
    }
  }
  // 更改 cesium 着色的方法
  changeImageryProviderColors(viewer: any) {
    // 更改底图的着色器 代码
    const baseFragmentShaderSource =
      viewer.scene.globe._surfaceShaderSet.baseFragmentShaderSource.sources
    for (let i = 0; i < baseFragmentShaderSource.length; i++) {
      const oneSource = baseFragmentShaderSource[i]
      // 格式必须一致 不能多有空格 且保持版本一致性
      const strS = 'gl_FragColor = finalColor;\n\
}\n\
#ifdef GROUND_ATMOSPHERE\n'
      const strT = strS
      if (oneSource.indexOf(strS) !== -1) {
        baseFragmentShaderSource[i] = baseFragmentShaderSource[i].replace(
          strS,
          strT
        )
      }
    }
  }
}

export const GController = new Controller()
