/* eslint-disable no-debugger */
/* eslint-disable no-undef */
class Controller {
  // 初始化 controller 类
  constructor() {
    this.init_data()
  }
  init_data() {
    this.viewer = null
  }
  init(BaseMapConfig, MapImageryList) {
    const mapID = 'cesiumContainer'
    let imageryProviderConfig = new Cesium.SingleTileImageryProvider ({
      url: './Cesium-1.82/background.png',
    })
    if (MapImageryList.length !== 0) {
      imageryProviderConfig = new Cesium[MapImageryList[0].type] (MapImageryList[0].classConfig)
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
      skyBox: false, // 天空盒
      infoBox: false, // 显示 信息框
      fullscreenButton: false, // 是否显示全屏按钮 
      homeButton: true, // 是否显示首页按钮 
      geocoder: false, // 默认不显示搜索栏地址
      sceneModePicker: true, // 是否显示视角切换按钮
    }
    vConfig = Object.assign(vConfig, BaseMapConfig) // 后台接口配置 融合替换 默认配置
    const viewer = new Cesium.Viewer(mapID, vConfig)
    if (!BaseMapConfig['logo']) {
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 影藏logo
    }

    // 增加配置图层
    this.setConfigMapList(viewer, MapImageryList)
    // 消除锯齿
    this.removeJagged(viewer)
    this.viewer = viewer
    return viewer
  }
  setConfigMapList(viewer, MapImageryList) {
    const imageryLayers = viewer.imageryLayers
    MapImageryList.some((elem, index) => {
      if (index === 0) {
        return false
      }
      imageryLayers.addImageryProvider(new Cesium[elem.type] (elem.classConfig))
    })
    // 设置具体的 ImageryLayer 参数
    MapImageryList.some((elem, index) => {
      if (elem.interfaceConfig) {
        // eslint-disable-next-line prefer-const
        let baseLayer = viewer.imageryLayers.get(index)
        Object.getOwnPropertyNames(elem.interfaceConfig).forEach(function(key) {
          baseLayer[key] = elem.interfaceConfig[key]
        })
      }
    })
  }
  // 消除锯齿
  removeJagged(viewer) {
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
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GController = new Controller()
