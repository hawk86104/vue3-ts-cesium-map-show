// eslint-disable-line no-unused-vars
/* eslint-disable no-debugger */
import { init } from './MaterialProperty/HexagonSpreadMaterialProperty'
declare const Cesium: any
// 六边形扩散效果
class HexagonSpread {
  viewer: any
  constructor(viewer: any) {
    this.viewer = viewer
  }
  add(position: any, color: string, maxRadius: number, duration: number) {
    init()
    let start = 0.1
    this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(
        position[0],
        position[1],
        position[2]
      ),
      ellipse: {
        semiMajorAxis: new Cesium.CallbackProperty(function(n: any) {
          start += maxRadius / (duration / 50)
          if (start > maxRadius + 0.1) {
            start = 0.1
          }
          return start
        }, false),
        semiMinorAxis: new Cesium.CallbackProperty(function(n: any) {
          return start
        }, false),
        material: new Cesium.HexagonSpreadMaterialProperty(
          new Cesium.Color.fromCssColorString(color)
        ),
      },
    })
  }
}
export default HexagonSpread
