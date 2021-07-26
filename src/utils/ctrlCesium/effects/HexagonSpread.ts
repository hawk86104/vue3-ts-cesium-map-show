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
  add(position: any, maxRadius: number, color: string) {
    init()
    let e = 0.1
    this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]),
      ellipse: {
        semiMajorAxis: new Cesium.CallbackProperty(function(n: any) {
          return (e += 8) > maxRadius && (e = 0.1), e
        }, false),
        semiMinorAxis: new Cesium.CallbackProperty(function(n: any) {
          return e
        }, false),
        material: new Cesium.HexagonSpreadMaterialProperty(
          {
            color: new Cesium.Color.fromCssColorString(color),
            duration: 10000
          }),
      },
    })
  }
}
export default HexagonSpread
