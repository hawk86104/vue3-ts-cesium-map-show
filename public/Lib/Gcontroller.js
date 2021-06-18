class Controller {
  // 初始化 controller 类
  constructor() {
    this.init_data();
  }
  init_data() {
    this.viewer = null;
  }
  async init(env) {
    const mapID = "cesiumContainer";
    var viewer = new Cesium.Viewer("cesiumContainer", {
      //加载单张影像
      imageryProvider: new Cesium.UrlTemplateImageryProvider({
        url: "http://webst03.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&style=7",
        defaultSaturation: 0.0,
      }),
      contextOptions: {
        webgl: {
          alpha: false,
        },
      },
      baseLayerPicker: false, //基础影响图层选择器
      navigationHelpButton: false, //导航帮助按钮
      animation: false, //动画控件
      timeline: false, //时间控件
      shadows: false, //显示阴影
      shouldAnimate: true, //模型动画效果,//大气
      skyBox: false, //天空盒
    });

    // var baseLayer = viewer.imageryLayers.get(0);
    // baseLayer.saturation = 0.0;
    // baseLayer.brightness = 0.6;
    // baseLayer.contrast = 1.8;
    // baseLayer.hue = 1;
    // baseLayer.gamma = 0.3;

    this.removeJagged(viewer);

    this.viewer = viewer;
    return viewer;
  }

  removeJagged(viewer) {
    // 消除锯齿
    viewer.scene.postProcessStages.fxaa.enabled = false;
    viewer.scene.fxaa = false;
    var supportsImageRenderingPixelated =
      viewer.cesiumWidget._supportsImageRenderingPixelated;
    if (supportsImageRenderingPixelated) {
      var vtxf_dpr = window.devicePixelRatio;
      while (vtxf_dpr >= 2.0) {
        vtxf_dpr /= 2.0;
      }
      viewer.resolutionScale = vtxf_dpr;
    }
  }
}

var GController = new Controller();
