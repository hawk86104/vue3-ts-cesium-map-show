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
    debugger
    this.viewer.entities.add({
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
        semiMinorAxis: maxRadius || 1000,
        semiMajorAxis: maxRadius || 1000,
        material: new Cesium.EllipsoidFadeMaterialProperty(
          new Cesium.Color.fromCssColorString(color),
          duration
        ),
      },
    })
  }
}
export default EllipsoidFade
