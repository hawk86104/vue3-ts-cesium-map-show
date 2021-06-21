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
  init(BaseMapConfig) {
    const mapID = 'cesiumContainer'
    debugger
    const viewer = new Cesium.Viewer(mapID, {
      // 加载单张影像 第一层最小最透明的
      imageryProvider: new Cesium.UrlTemplateImageryProvider ({
        // url: './Cesium-1.82/background.png',// SingleTileImageryProvider
        url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
        show: false
        
      }),
      contextOptions: {
        webgl: {
          alpha: false,
        },
      },
      baseLayerPicker: BaseMapConfig['map_config_baseLayerPicker'] ? BaseMapConfig['map_config_baseLayerPicker'].value === '1' : false, // 基础影响图层选择器
      navigationHelpButton: BaseMapConfig['map_config_navigationHelpButton'] ? BaseMapConfig['map_config_navigationHelpButton'].value === '1' : false, // 导航帮助按钮
      animation: BaseMapConfig['map_config_animation'] ? BaseMapConfig['map_config_animation'].value === '1' : false, // 动画控件
      timeline: BaseMapConfig['map_config_timeline'] ? BaseMapConfig['map_config_timeline'].value === '1' : false, // 时间控件
      shadows: BaseMapConfig['map_config_shadows'] ? BaseMapConfig['map_config_shadows'].value === '1' : false, // 显示阴影
      shouldAnimate: BaseMapConfig['map_config_shouldAnimate'] ? BaseMapConfig['map_config_shouldAnimate'].value === '1' : false, // 模型动画效果 大气
      skyBox: BaseMapConfig['map_config_skyBox'] ? BaseMapConfig['map_config_skyBox'].value === '1' : false, // 天空盒
      infoBox: BaseMapConfig['map_config_infoBox'] ? BaseMapConfig['map_config_infoBox'].value === '1' : false,
      fullscreenButton: BaseMapConfig['map_config_fullscreenButton'] ? BaseMapConfig['map_config_fullscreenButton'].value === '1' : false, // 是否显示全屏按钮 
      homeButton: BaseMapConfig['map_config_homeButton'] ? BaseMapConfig['map_config_homeButton'].value === '1' : false, // 是否显示首页按钮 
      geocoder: false, // 默认不显示搜索栏地址
      sceneModePicker: BaseMapConfig['map_config_sceneModePicker'] ? BaseMapConfig['map_config_sceneModePicker'].value === '1' : false, // 是否显示视角切换按钮
    })
    if (BaseMapConfig['map_config_logo'] && BaseMapConfig['map_config_logo'].value === '0') {
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 影藏logo
    }

    // 增加图层
    // const imageryLayers = viewer.imageryLayers
    // imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
    //   // url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
    //   url: 'http://webst03.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&style=7',
    // }))
    // var baseLayer = viewer.imageryLayers.get(1);
    // baseLayer.saturation = 0.0;
    // baseLayer.brightness = 0.6;
    // baseLayer.contrast = 1.8;
    // baseLayer.hue = 1;
    // baseLayer.gamma = 0.3;

    this.removeJagged(viewer)

    this.viewer = viewer
    return viewer
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
