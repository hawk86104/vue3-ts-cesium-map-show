declare const Cesium:any
// import * as Cesium from 'cesium'

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
      url: './Cesium-1.82/background.png',
    })
    if (MapImageryList.length !== 0) {
      imageryProviderConfig = new Cesium[MapImageryList[0].type](
        MapImageryList[0].classConfig
      )
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

    // 增加配置图层
    this.setConfigMapList(viewer, MapImageryList)
    // 增加底图的配色方案
    this.changeImageryProviderColors(viewer)
    // 消除锯齿
    this.removeJagged(viewer)
    this.viewer = viewer
    return viewer
  }
  setConfigMapList(viewer: any, MapImageryList: any) {
    const imageryLayers = viewer.imageryLayers
    MapImageryList.some((elem: any, index: number) => {
      if (index === 0) {
        return false
      }
      imageryLayers.addImageryProvider(new Cesium[elem.type](elem.classConfig))
    })
    // 设置具体的 ImageryLayer 参数
    MapImageryList.some((elem: any, index: number) => {
      if (elem.interfaceConfig) {
        const baseLayer = viewer.imageryLayers.get(index)
        Object.getOwnPropertyNames(elem.interfaceConfig).forEach(function(
          key
        ) {
          baseLayer[key] = elem.interfaceConfig[key]
        })
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
  // 更改配色
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
      const strT =
        '   finalColor.r = 1.0 - finalColor.r;\n\
            finalColor.g = 1.0 - finalColor.g;\n\
            finalColor.b = 1.0 - finalColor.b;\n\
            finalColor.r = finalColor.r * 78.0/255.0;\n\
            finalColor.g = finalColor.g * 112.0/255.0;\n\
            finalColor.b = finalColor.b * 166.0/255.0;\n\
        ' +
        strS
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
