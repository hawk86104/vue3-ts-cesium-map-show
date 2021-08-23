import Effect from './Effect'
import { init as efmInit } from './MaterialProperty/EllipsoidFadeMaterialProperty'

// 扩散点 圆
class EllipsoidFade extends Effect {
  constructor(viewer: any, id: string) {
    super(viewer, id)
  }
  add(position: any, color: string, maxRadius: number, duration: number, isedit = false) {
    efmInit()
    super.add(position, color, maxRadius, duration, isedit)
    const _this = this
    let currentRadius = 1
    const entity = this.viewer.entities.add({
      id: _this.id,
      position: Cesium.Cartesian3.fromDegrees(
        position[0],
        position[1],
        position[2]
      ),
      ellipse: {
        // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        // extrudedHeightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        // height: position[2],
        // extrudedHeight: position[2], // 如果这里设置高度 那么就会直接穿透 不洒在建筑物上
        semiMajorAxis: new Cesium.CallbackProperty(function(n: any) {
          currentRadius += (1000 / _this.duration) * 50
          if (currentRadius > _this.maxRadius) {
            currentRadius = 1
          }
          return currentRadius
        }, false),
        semiMinorAxis: new Cesium.CallbackProperty(function(n: any) {
          return currentRadius
        }, false),
        material: new Cesium.EllipsoidFadeMaterialProperty(
          new Cesium.Color.fromCssColorString(color),
          _this.duration
        ),
      },
    })
    return entity.id
  }
  /*
  viewer: any
  id: string
  duration: number
  maxRadius: number
  pointDraged: any
  leftDownFlag: boolean
  update_position: any
  constructor(viewer: any, id: string) {
    this.viewer = viewer
    this.id = id
    this.duration = 1000
    this.maxRadius = 1000
    this.pointDraged = null
    this.leftDownFlag = false
  }
  change_position(p: any) {
    const cartesian3 = Cesium.Cartesian3.fromDegrees(parseFloat(p[0]), parseFloat(p[1]), parseFloat(p[2]))
    const curEntity = this.viewer.entities.getById(this.id)
    curEntity.position = cartesian3
  }
  add(position: any, color: string, maxRadius: number, duration: number) {
    const _this = this
    function leftDownAction(e: any) {
      _this.pointDraged = _this.viewer.scene.pick(e.position) // 选取当前的entity
      if (
        _this.pointDraged &&
        _this.pointDraged.id &&
        _this.pointDraged.id.id === _this.id
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
        _this.pointDraged.id.position = cartesian // 此处根据具体entity来处理，也可能是pointDraged.id.position=cartesian;
        // 这里笛卡尔坐标转 经纬度
        const ellipsoid = _this.viewer.scene.globe.ellipsoid
        const cartographic = ellipsoid.cartesianToCartographic(cartesian)
        const lat = Cesium.Math.toDegrees(cartographic.latitude)
        const lng = Cesium.Math.toDegrees(cartographic.longitude)
        let alt = cartographic.height
        alt = alt < 0 ? 0 : alt
        _this.update_position([lng.toFixed(8), lat.toFixed(8), alt])
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
    efmInit()
    this.duration = duration
    this.maxRadius = maxRadius
    let currentRadius = 1

    const entity = this.viewer.entities.add({
      id: _this.id,
      position: Cesium.Cartesian3.fromDegrees(
        position[0],
        position[1],
        position[2]
      ),
      ellipse: {
        // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        // extrudedHeightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        // height: position[2],
        // extrudedHeight: position[2], // 如果这里设置高度 那么就会直接穿透 不洒在建筑物上
        semiMajorAxis: new Cesium.CallbackProperty(function(n: any) {
          currentRadius += (1000 / _this.duration) * 50
          if (currentRadius > _this.maxRadius) {
            currentRadius = 1
          }
          return currentRadius
        }, false),
        semiMinorAxis: new Cesium.CallbackProperty(function(n: any) {
          return currentRadius
        }, false),
        material: new Cesium.EllipsoidFadeMaterialProperty(
          new Cesium.Color.fromCssColorString(color),
          _this.duration
        ),
      },
    })

    this.id = entity.id
    return entity.id
  }
*/
}
export default EllipsoidFade
