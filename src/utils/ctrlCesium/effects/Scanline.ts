/*
 * @Description: 
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-07-28 15:54:28
 * @LastEditors: Hawk
 * @LastEditTime: 2021-08-23 15:03:10
 */
/* eslint-disable no-debugger */
import Effect from './Effect'
import { init } from './MaterialProperty/ScanlineMaterialProperty'

// 线圈发光扩散效果
class Scanline extends Effect {
  constructor(viewer: any, id: string) {
    super(viewer, id)
  }
  change_duration(d: number) {
    super.change_duration(d)
    const curEntity = this.viewer.entities.getById(this.id)
    curEntity._ellipse._material.speed = d
  }
  add(position: any, color: string, maxRadius: number, speed: number, isedit = false) {
    init()
    super.add(position, color, maxRadius, speed, isedit)
    const _this = this
    this.viewer.entities.add({
      id: _this.id,
      position: Cesium.Cartesian3.fromDegrees(
        position[0],
        position[1],
        position[2]
      ),
      ellipse: {
        semiMinorAxis: new Cesium.CallbackProperty(function(n: any) {
          return _this.maxRadius
        }, false),
        semiMajorAxis: new Cesium.CallbackProperty(function(n: any) {
          return _this.maxRadius
        }, false),
        material: new Cesium.ScanlineMaterialProperty(
          new Cesium.Color.fromCssColorString(color),
          speed
        ),
        classificationType: Cesium.ClassificationType.BOTH,
      },
    })
  }
}
export default Scanline
