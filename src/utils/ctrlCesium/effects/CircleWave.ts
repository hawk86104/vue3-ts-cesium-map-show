// eslint-disable-line no-unused-vars
/* eslint-disable no-debugger */
import { init } from './MaterialProperty/CircleWaveMaterialProperty'
declare const Cesium: any
// 水波纹
class CircleWave {
  viewer: any
  constructor(viewer: any) {
    this.viewer = viewer
  }
  add(position: any, color: string) {
    init()
    this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(
        position[0],
        position[1],
        position[2]
      ),
      ellipse: {
        // height: position[2],
        semiMinorAxis: 600,
        semiMajorAxis: 600,
        material: new Cesium.CircleWaveMaterialProperty({
          duration: 2000,
          gradient: 0,
          color: new Cesium.Color.fromCssColorString(color),
          count: 3,
        }),
      },
    })
  }
}
export default CircleWave
