// eslint-disable-line no-unused-vars
/* eslint-disable no-debugger */
import Effect from './Effect'
import { init } from './MaterialProperty/CircleWaveMaterialProperty'
declare const Cesium: any
// 水波纹
class CircleWave extends Effect {
  count: number
  constructor(viewer: any, id: string) {
    super(viewer, id)
  }
  change_duration(d: number) {
    super.change_duration(d)
    const curEntity = this.viewer.entities.getById(this.id)
    curEntity._ellipse._material.duration = d
  }
  change_waveCount(d: number) {
    const curEntity = this.viewer.entities.getById(this.id)
    curEntity._ellipse._material.count = d
  }
  add(position: any, color: string, maxRadius: number, duration: number, count = 3) {
    init()
    super.add(position, color, maxRadius, duration)
    const _this = this
    this.count = count
    this.viewer.entities.add({
      id: _this.id,
      position: Cesium.Cartesian3.fromDegrees(
        position[0],
        position[1],
        position[2]
      ),
      ellipse: {
        // height: position[2],
        semiMinorAxis: new Cesium.CallbackProperty(function(n: any) {
          return _this.maxRadius
        }, false),
        semiMajorAxis: new Cesium.CallbackProperty(function(n: any) {
          return _this.maxRadius
        }, false),
        material: new Cesium.CircleWaveMaterialProperty({
          duration: duration,
          gradient: 0,
          color: new Cesium.Color.fromCssColorString(color),
          count: count,
        }),
      },
    })
  }
}
export default CircleWave
