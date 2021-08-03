// eslint-disable-line no-unused-vars
/* eslint-disable no-debugger */
import { init } from './MaterialProperty/EllipsoidFadeMaterialProperty'
declare const Cesium: any
// 扩散点 圆
class EllipsoidFade {
  viewer: any
  constructor(viewer: any) {
    this.viewer = viewer
  }
  add(position: any, color: string, maxRadius: number, duration: number) {
    init()
    let currentRadius = 1

    const entity = this.viewer.entities.add({
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
          currentRadius += (1000 / duration) * 50
          if (currentRadius > maxRadius) {
            currentRadius = 1
          }
          return currentRadius
        }, false),
        semiMinorAxis: new Cesium.CallbackProperty(function(n: any) {
          return currentRadius
        }, false),
        material: new Cesium.EllipsoidFadeMaterialProperty(
          new Cesium.Color.fromCssColorString(color),
          duration
        ),
      },
    })

    return entity.id
  }
}
export default EllipsoidFade
