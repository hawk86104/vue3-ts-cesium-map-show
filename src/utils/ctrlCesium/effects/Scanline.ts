// eslint-disable-line no-unused-vars
/* eslint-disable no-debugger */
import { init } from './MaterialProperty/ScanlineMaterialProperty'
declare const Cesium: any
// 六边形扩散效果
class Scanline {
  viewer: any
  constructor(viewer: any) {
    this.viewer = viewer
  }
  add(position: any, color: string, maxRadius: number, speed: number) {
    init()
    this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(
        position[0],
        position[1],
        position[2]
      ),
      ellipse: {
        semiMinorAxis: maxRadius,
        semiMajorAxis: maxRadius,
        material: new Cesium.ScanlineMaterialProperty(new Cesium.Color.fromCssColorString(color), speed),
        classificationType: Cesium.ClassificationType.BOTH
      },
    })
  }
}
export default Scanline
