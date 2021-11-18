/*
 * @Description:
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-08-23 13:39:41
 * @LastEditors: Hawk
 * @LastEditTime: 2021-09-28 16:43:54
 */
/* eslint-disable no-debugger */
import { getPointsEffectList } from '@/api/effect'
import EllipsoidFade from '@/utils/ctrlCesium/effects/EllipsoidFade'
import HexagonSpread from '@/utils/ctrlCesium/effects/HexagonSpread'
import Scanline from '@/utils/ctrlCesium/effects/Scanline'
import CircleWave from '@/utils/ctrlCesium/effects/CircleWave'
import RaderScan from '@/utils/ctrlCesium/effects/RaderScan'
import SpreadWall from '@/utils/ctrlCesium/effects/SpreadWall'
// 效果集合管理控制
class Manager {
  viewer: any
  EffectsList: Array<any>
  constructor(viewer: any) {
    this.viewer = viewer
    this.EffectsList = []
  }
  async init() {
    // 首先从数据中 获取需要展示的数据
    const res: any = await getPointsEffectList()
    const _this = this
    if (res.data) {
      res.data.forEach((element: any, index: number) => {
        _this.add(element, index)
      })
    }
  }
  add(ele: any, index: number) {
    let curEntityC = null
    let pe = [ele.lon, ele.lat, ele.height]
    let ext: any
    switch (ele.effect_type) {
      case 'CircleDiffusion':
        curEntityC = new EllipsoidFade(
          this.viewer,
          'effect-set-config' + ele.effect_type + index
        )
        curEntityC.add(pe, ele.color, ele.radius, ele.duration)
        break
      case 'Scanline':
        curEntityC = new Scanline(
          this.viewer,
          'effect-set-config' + ele.effect_type + index
        )
        curEntityC.add(pe, ele.color, ele.radius, ele.duration)
        break
      case 'CircleWave':
        curEntityC = new CircleWave(
          this.viewer,
          'effect-set-config' + ele.effect_type + index
        )
        ext = JSON.parse(ele.ext)
        curEntityC.add(pe, ele.color, ele.radius, ele.duration, false, ext.waveCount)
        break
      case 'HexagonSpread':
        curEntityC = new HexagonSpread(
          this.viewer,
          'effect-set-config' + ele.effect_type + index
        )
        curEntityC.add(pe, ele.color, ele.radius, ele.duration)
        break
      case 'CircleScan':
        curEntityC = new RaderScan(
          this.viewer,
          'effect-set-config' + ele.effect_type + index
        )
        ext = JSON.parse(ele.ext)
        curEntityC.add(pe, ele.color, ele.radius, ext.step)
        break
      case 'SpreadWall':
        curEntityC = new SpreadWall(
          this.viewer,
          'effect-set-config' + ele.effect_type + index
        )
        ext = JSON.parse(ele.ext)
        curEntityC.add(
          pe,
          ele.color,
          ele.radius,
          ele.duration,
          ext.height,
          ext.edgeCount
        )
        break
      default:
    }
    if (curEntityC) {
      this.EffectsList.push(curEntityC)
    }
  }
}
export default Manager
