/* eslint-disable no-debugger */
declare const Cesium: any

class Titleset {
  viewer: any
  modalEntities: any
  constructor(viewer: any) {
    this.viewer = viewer
  }
  addtest() {
    this.viewer.scene.primitives
      .add(
        new Cesium.Cesium3DTileset({
          url: 'http://myhome.217dan.com:8081/sz_ns2/tileset.json',
        })
      )
      .readyPromise.then(function(tileset: any) {
        // 设置白膜的默认透明度
        tileset.style = new Cesium.Cesium3DTileStyle({
          color: {
            conditions: [['true', "color('rgba(255,255,255,0.5)')"]],
          },
        })
        tileset.tileVisible.addEventListener(function(cesium3DTile: any) {
          // 以下设置白膜的打光效果
          const cesium3DTileCon: any = cesium3DTile.content
          const featuresLength: number = cesium3DTileCon.featuresLength
          for (let i = 0; i < featuresLength; i += 2) {
            const _model = cesium3DTileCon.getFeature(i).content._model
            if (_model && _model._sourcePrograms && _model._rendererResources) {
              Object.getOwnPropertyNames(_model._sourcePrograms).forEach(
                function(i: any) {
                  const msp = _model._sourcePrograms[i]
                  _model._rendererResources.sourceShaders[
                    msp.fragmentShader
                  ] = `
                varying vec3 v_positionEC;
                void main(void){
                  vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
                  float glowRange = 100.0; // 光环的移动范围(高度)
                  gl_FragColor = vec4(0.2,  0.5, 1.0, 1.0); // 颜色
                  gl_FragColor *= vec4(vec3(position.z / 100.0), 1.0); // 渐变
                  // 动态光环
                  float time = fract(czm_frameNumber / 360.0);
                  time = abs(time - 0.5) * 2.0;
                  float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));
                  gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);
                }
                `
                }
              )
              _model._shouldRegenerateShaders = true // 控制
            }
          }
        })
      })
    this.viewer.scene.camera.flyTo({
      // setView
      destination: {
        x: -2394510.2078150916,
        y: 5395360.292764892,
        z: 2420140.372624237,
      },
      orientation: {
        direction: new Cesium.Cartesian3(
          0.41752728100630826,
          -0.6312054016802423,
          0.6536441772900325
        ),
        up: new Cesium.Cartesian3(
          -0.21208294240644568,
          0.6311630077718327,
          0.7460925432951585
        ),
      },
      duration: 6, // 延迟秒数
    })
  }
  add(inParam: any) {
    console.log(inParam)
    // const url = 'http://data.marsgis.cn/3dtiles/jzw-chengdu-gcj/tileset.json' // 程度
    // const url = 'http://211.149.185.229:8081/data/buildmapping/tileset.json' // 深圳
    const url =
      'https://lab.earthsdk.com/model/702aa950d03c11e99f7ddd77cbe22fea/tileset.json' // 上海
    const tiles = new Cesium.Cesium3DTileset({
      url: url, // 带网络属性模板
    })
    this.modalEntities = this.viewer.scene.primitives.add(tiles)
    this.viewer.scene.camera.setView({
      destination: {
        // x: -2393550.3357974524,
        // y: 5386606.88313247,
        // z: 2429438.0059398483,
        x: -2395783.5309640486,
        y: 5392694.777928539,
        z: 2424816.601754499,
      },
      orientation: {
        heading: 0.42631000693466764,
        pitch: -0.8022459306450823,
        roll: 0.4179249271708612,
      },
      duration: 1,
    })
    // tiles.readyPromise.then(function(tileset) {
    //   tiles.show = false
    //   var handler = new Cesium.ScreenSpaceEventHandler(CtrlTileset.Gmap.viewer.scene.canvas)
    //   handler.setInputAction(function(wheelment) {
    //     var height = CtrlTileset.Gmap.viewer.camera.positionCartographic.height
    //     // console.log('白膜部分检测高度:' + height)
    //     if (height < 15000) {
    //       tiles.show = true
    //     } else {
    //       tiles.show = false
    //     }
    //   }, Cesium.ScreenSpaceEventType.WHEEL)
    // })
  }
}

export default Titleset
