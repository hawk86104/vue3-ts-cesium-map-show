// eslint-disable-line no-unused-vars
/* eslint-disable no-debugger */
import { init } from './MaterialProperty/WallGradientsMaterialProperty'
declare const Cesium: any
// 推动墙扩散
class SpreadWall {
  viewer: any
  constructor(viewer: any) {
    this.viewer = viewer
  }
  add(
    position: any,
    color: string,
    maxRadius: number,
    duration: number,
    wallHeight: number
  ) {
    init()
    position = Cesium.Cartographic.fromDegrees(
      position[0],
      position[1],
      position[2]
    )
    if (position.height < 0) {
      position.height = 0
    }
    const baseHeight = position.height
    const centerDegrees = [
      Cesium.Math.toDegrees(position.longitude),
      Cesium.Math.toDegrees(position.latitude),
      position.height,
    ]
    let currentRadius = maxRadius
    let rPositions = {}
    position = this.generateCirclePoints(
      [centerDegrees[0], centerDegrees[1]],
      currentRadius
    )
    position = this.pointsToPositions(position, centerDegrees[2])
    rPositions[maxRadius] = position

    const positions = position || []
    const minimumHeights = new Array(positions.length).fill(baseHeight)
    const maximumHeights = new Array(positions.length).fill(
      baseHeight + wallHeight
    )
    const _this = this
    this.viewer.entities.add({
      wall: {
        positions: new Cesium.CallbackProperty(function(e: any) {
          const reData = _this.getPositions(
            currentRadius,
            maxRadius,
            rPositions,
            centerDegrees,
            duration
          )
          currentRadius = reData.currentRadius
          rPositions = reData.rPositions
          return rPositions[currentRadius]
        }, false),
        minimumHeights: minimumHeights,
        maximumHeights: maximumHeights,
        material: new Cesium.WallGradientsMaterialProperty(new Cesium.Color.fromCssColorString(color)),
      },
    })
  }
  getPositions(
    currentRadius: number,
    radius: number,
    rPositions: any,
    centerDegrees: any,
    duration: number
  ) {
    if (
      (currentRadius += 1000 / duration * 5,
      currentRadius > radius && (currentRadius = 1),
      rPositions[currentRadius])
    ) {
      return { rPositions: rPositions, currentRadius: currentRadius }
    }

    let t = this.generateCirclePoints(
      [centerDegrees[0], centerDegrees[1]],
      currentRadius
    )
    t = this.pointsToPositions(t, centerDegrees[2])

    rPositions[currentRadius] = t
    return { rPositions: rPositions, currentRadius: currentRadius }
  }
  pointsToPositions(t: any, e: any) {
    const n = []
    return (
      t.map(function(t: any) {
        n.push(Cesium.Cartesian3.fromDegrees(t[0], t[1], e))
      }),
      n
    )
  }
  generateCirclePoints(t: any, e: any) {
    const n = []
    for (let i = 0; i <= 360; i += 2) {
      n.push(this.getCirclePoint(t[0], t[1], i, e))
    }
    return n
  }
  getCirclePoint(t: any, e: any, n: any, i: any) {
    const r = i * Math.sin((n * Math.PI) / 180)
    i *= Math.cos((n * Math.PI) / 180)
    return [
      (180 *
        (r /
          ((n = 6356725 + (21412 * (90 - e)) / 90) *
            Math.cos((e * Math.PI) / 180)) +
          (t * Math.PI) / 180)) /
        Math.PI,
      (180 * (i / n + (e * Math.PI) / 180)) / Math.PI,
    ]
  }
}
export default SpreadWall
