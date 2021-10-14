/* eslint-disable no-debugger */
/*
 * @Description: Primitive控制类
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-10-12 09:24:13
 * @LastEditors: Hawk
 * @LastEditTime: 2021-10-14 09:36:01
 */
class PrimitiveController {
  viewer: any
  pointDraged: any
  leftDownFlag: boolean
  id: string
  update_position: any
  constructor(viewer: any) {
    this.viewer = viewer
    this.pointDraged = null
    this.leftDownFlag = false
    this.id = ''
    this.update_position = null
  }
  addMouseEvent() {
    const _this = this
    function leftDownAction(e: any) {
      _this.pointDraged = _this.viewer.scene.pick(e.position) // 选取当前
      if (
        _this.pointDraged &&
        _this.pointDraged.id === _this.id
      ) {
        _this.leftDownFlag = true
        _this.viewer.scene.screenSpaceCameraController.enableRotate = false // 锁定相机
      }
    }
    function leftUpAction(e: any) {
      _this.leftDownFlag = false
      _this.pointDraged = null
      _this.viewer.scene.screenSpaceCameraController.enableRotate = true // 解锁相机
    }
    function mouseMoveAction(e: any) {
      if (
        _this.leftDownFlag === true &&
        _this.pointDraged !== null &&
        _this.pointDraged !== undefined
      ) {
        const ray = _this.viewer.camera.getPickRay(e.endPosition)
        const cartesian = _this.viewer.scene.globe.pick(ray, _this.viewer.scene)
        // _this.pointDraged.id.position = cartesian // 此处根据具体entity来处理，也可能是pointDraged.id.position=cartesian;
        // 这里笛卡尔坐标转 经纬度
        const ellipsoid = _this.viewer.scene.globe.ellipsoid
        const cartographic = ellipsoid.cartesianToCartographic(cartesian)
        const lat = Cesium.Math.toDegrees(cartographic.latitude)
        const lng = Cesium.Math.toDegrees(cartographic.longitude)
        _this.pointDraged.primitive.attributes.lon = lng
        _this.pointDraged.primitive.attributes.lat = lat
        if (_this.update_position) {
          _this.update_position({lon: lng.toFixed(8), lat: lat.toFixed(8)})
        }
      }
    }
    this.viewer.screenSpaceEventHandler.setInputAction(
      leftDownAction,
      Cesium.ScreenSpaceEventType.LEFT_DOWN
    )
    this.viewer.screenSpaceEventHandler.setInputAction(
      leftUpAction,
      Cesium.ScreenSpaceEventType.LEFT_UP
    )
    this.viewer.screenSpaceEventHandler.setInputAction(
      mouseMoveAction,
      Cesium.ScreenSpaceEventType.MOUSE_MOVE
    )
  }
  /**
   * 控制primitiveCollection显隐
   * @param {Array} primitiveCollection
   * @param {Boolean} flag
   */
  changePrimitiveVisibility(primitiveCollection: any, flag: boolean) {
    primitiveCollection.forEach((value: any) => {
      value.show = flag
    })
  }

  /**
   * 删除primitiveCollection
   * @param {Array} primitiveCollection
   */
  deletePrimitiveCollection(primitiveCollection: any) {
    primitiveCollection.forEach((value: any) => {
      // 清除模型绑定的定时器
      if (value.setIntervalId) clearInterval(value.setIntervalId)
      this.viewer.scene.primitives.remove(value)
    })
  }

  /**
   * 根据id，控制单个primitive的显示隐藏
   * @param {String} id
   * @param {Boolean} flag
   */
  changePrimitiveVisibilityById(id: string, flag: boolean) {
    const primitives = this.viewer.scene.primitives
    let primitive = null
    primitives.forEach((value: any) => {
      if (value.id === id) {
        primitive = value
      }
    })
    if (primitive) {
      primitive.show = flag
    }
    else {
      console.log(`不存在id为${id}的primitive`)
    }
  }
  /**
   * 控制单个primitiv的颜色
   * @param {String} id
   * @param {String} color
   */
  changePrimitiveColor(id: string, color: string) {
    let primitive = this.findPrimitiveById(id)
    if (primitive) {
      primitive.color = new Cesium.Color.fromCssColorString(color)
    }
  }
  changePrimitiveIntervalTime(id: string, time: number) {
    const _this = this
    let primitive = this.findPrimitiveById(id)
    if (primitive) {
      if (primitive.setIntervalId) clearInterval(primitive.setIntervalId)
      const setIntervalId = setInterval(() => {
        primitive.modelMatrix = _this._changeModelMatrix(primitive)
      }, time)
      primitive.setIntervalId = setIntervalId // 用于清除定时器
    }
  }
  changePrimitiveRotate(id: string, rotate: number) {
    let primitive = this.findPrimitiveById(id)
    if (primitive) {
      primitive.attributes.rotate = rotate
    }
  }
  changePrimitiveMinimumPixelSize(id: string, minimumPixelSize: number) {
    let primitive = this.findPrimitiveById(id)
    if (primitive) {
      primitive.minimumPixelSize = minimumPixelSize
    }
  }
  changePrimitiveHeight(id: string, height: number) {
    let primitive = this.findPrimitiveById(id)
    if (primitive) {
      primitive.attributes.height = height
    }
  }
  changePrimitivePosition(id: string, positionLon: number, positionLat: number) {
    let primitive = this.findPrimitiveById(id)
    if (primitive) {
      primitive.attributes.lon = positionLon
      primitive.attributes.lat = positionLat
    }
  }
  changePrimitiveScale(id: string, scale: number) {
    let primitive = this.findPrimitiveById(id)
    if (primitive) {
      primitive.scale = scale
    }
  }
  changePrimitiveColorBlendMode(id: string, mode: string) {
    let primitive = this.findPrimitiveById(id)
    if (primitive) {
      let modeA = Cesium.ColorBlendMode.HIGHLIGHT
      switch (mode) {
        case 'HIGHLIGHT':
          modeA = Cesium.ColorBlendMode.HIGHLIGHT
          break
        case 'MIX':
          modeA = Cesium.ColorBlendMode.MIX
          break
        case 'REPLACE':
          modeA = Cesium.ColorBlendMode.REPLACE
          break
        default :
      }
      primitive.colorBlendMode = modeA
    }
  }
  findPrimitiveById(id: string) {
    const primitives = this.viewer.scene.primitives._primitives
    let primitive = null
    primitives.forEach((value: any) => {
      if (value.id === id) {
        primitive = value
      }
    })
    return primitive
  }
  /**
   * 根据id，删除单个pimitive
   * @param {String} id
   */
  deleteprimitiveById(id: string) {
    const primitives = this.viewer.scene.primitives
    let primitive = null
    primitives.forEach((value) => {
      if (value.id === id) {
        primitive = value
      }
    })
    if (primitive) {
      // 清除模型绑定的定时器
      if (primitive.setIntervalId) clearInterval(primitive.setIntervalId)
      this.viewer.scene.primitives.remove(primitive)
    }
    else {
      console.log(`不存在id为${id}的primitive`)
    }
  }
  _changeModelMatrix(model: any) {
    model.heading += Cesium.Math.toRadians(model.attributes.rotate || 0)
    const pitch = Cesium.defaultValue(model.attributes.pitch, 0.0)
    const roll = Cesium.defaultValue(model.attributes.roll, 0.0)
    const hpr = new Cesium.HeadingPitchRoll(model.heading, pitch, roll)

    const position = Cesium.Cartesian3.fromDegrees(
      model.attributes.lon,
      model.attributes.lat,
      model.attributes.height
    )
    const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
      position,
      hpr
    )
    return modelMatrix
  }
}

/**
 * primitive要素类
 */
class Primitives extends PrimitiveController {
  constructor(viewer: any) {
    super(viewer)
  }

  /**
   * 添加模型
   * @param {*} points 点集
   * @param {*} options 模型配置
   */
  showModels(points: any, options: any) {
    const _this = this
    const primitives = this.viewer.scene.primitives
    let id, model, toRadians, position, modelMatrix, hpr, modelColor
    toRadians = Cesium.Math.toRadians
    let value = points
    id = value.id ? value.id : 'pimitiveModel_0'
    _this.id = id
    modelColor = new Cesium.Color.fromCssColorString(
      value.modelColor || options.modelColor || 'rgba(0,255,255,0.5)'
    ) // 模型颜色
    position = Cesium.Cartesian3.fromDegrees(
      value.lon,
      value.lat,
      value.height
    )
    hpr = new Cesium.HeadingPitchRoll(
      toRadians(value.heading),
      toRadians(value.pitch),
      toRadians(value.roll)
    )
    modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
      position,
      hpr
    )
    model = primitives.add(
      Cesium.Model.fromGltf({
        id: id,
        url: value.uri,
        scale: value.scale,
        modelMatrix: modelMatrix,
        color: modelColor,
        colorBlendMode: Cesium.ColorBlendMode.MIX,
        maximumScale: 5000,
        minimumPixelSize: value.minimumPixelSize || 20,
      })
    )
    this.changePrimitiveColorBlendMode(id, value.colorMode)
    model.attributes = value
    model.heading = value.heading
    model.readyPromise.then(function(model: any) {
      const setIntervalId = setInterval(() => {
        model.modelMatrix = _this._changeModelMatrix(model)
      }, value.duration)
      model.setIntervalId = setIntervalId // 用于清除定时器
    })
    return model
  }
}
export default Primitives
