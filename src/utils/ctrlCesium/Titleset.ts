/* eslint-disable no-debugger */
declare const Cesium: any

class Titleset {
  viewer: any
  modalEntities: any
  constructor(viewer: any) {
    this.viewer = viewer
  }
  update3dtilesMaxtrix(tileset: any) {
    // xyz 笛卡尔  lat lon 弧度   【 lat lon 经纬度 】
    debugger
    // 根据tileset的边界球体中心点的笛卡尔坐标得到经纬度坐标
    const cartographic = Cesium.Cartographic.fromCartesian(
      tileset.boundingSphere.center
    )
    // 根据经纬度和高度0，得到地面笛卡尔坐标
    const surface = Cesium.Cartesian3.fromRadians(
      cartographic.longitude,
      cartographic.latitude,
      0 // cartographic.height
    )
    // 根据经纬度和需要的高度，得到偏移后的笛卡尔坐标
    const offset = Cesium.Cartesian3.fromRadians(
      cartographic.longitude, // + Cesium.Math.toRadians(0.0001), 这里更改的是经纬度偏移
      cartographic.latitude,
      -500 // 程度的高度 需要偏移 下降500米
    )
    offset.x += 100 // 这里可以更改 真实 米的偏移
    // const offset = Cesium.Cartesian3.fromDegrees(
    //   tileset.boundingSphere.center.x + 10,
    //   tileset.boundingSphere.center.y,
    //   0.0
    // )
    // 计算坐标变换，得到新的笛卡尔坐标
    const translation = Cesium.Cartesian3.subtract(
      offset,
      surface,
      new Cesium.Cartesian3()
    )
    // 调整3dtiles位置
    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
  }
  addtest() {
    const _this = this
    this.viewer.scene.primitives
      .add(
        new Cesium.Cesium3DTileset({
          url: 'http://myhome.217dan.com:8081/chengdu_all/tileset.json',
        })
      )
      .readyPromise.then(function(tileset: any) {
        setTimeout(() => {
          _this.viewer.zoomTo(tileset) // 切到白膜的位置
        }, 2000)

        // 白膜的 更改3dtiles姿态，包括位置，旋转角度，高度
        _this.update3dtilesMaxtrix(tileset)
        // 设置白膜的默认透明度
        tileset.style = new Cesium.Cesium3DTileStyle({
          color: {
            conditions: [['true', "color('rgba(255,255,255,0.9)')"]],
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

    // const x = -2394510.2078150916
    // const y = 5395360.292764892
    // const z = 2420140.372624237

    // // 这里是世界坐标 xyz 转 经纬度数
    // const ellipsoid = this.viewer.scene.globe.ellipsoid
    // const cartesian3 = new Cesium.Cartesian3(x, y, z)
    // const cartographic = ellipsoid.cartesianToCartographic(cartesian3)
    // const lat = Cesium.Math.toDegrees(cartographic.latitude)
    // const lng = Cesium.Math.toDegrees(cartographic.longitude)
    // const alt = cartographic.height

    // // 这里是 经纬度 转 世界坐标xyz
    // const ellipsoidz = this.viewer.scene.globe.ellipsoid
    // const cartographicz = Cesium.Cartographic.fromDegrees(lng, lat, alt)
    // const cartesianXYZ = ellipsoidz.cartographicToCartesian(cartographicz)

    // this.viewer.scene.camera.flyTo({
    //   // setView
    //   destination: {
    //     x: cartesianXYZ.x,
    //     y: cartesianXYZ.y,
    //     z: cartesianXYZ.z,
    //   },
    //   orientation: {
    //     direction: new Cesium.Cartesian3(
    //       0.41752728100630826,
    //       -0.6312054016802423,
    //       0.6536441772900325
    //     ),
    //     up: new Cesium.Cartesian3(
    //       -0.21208294240644568,
    //       0.6311630077718327,
    //       0.7460925432951585
    //     ),
    //   },
    //   duration: 1, // 延迟秒数
    // })
  }
  add(inParam: any) {
    console.log(inParam)
    // const url = 'http://data.marsgis.cn/3dtiles/jzw-chengdu-gcj/tileset.json' // 成都
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
