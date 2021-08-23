// eslint-disable-line no-unused-vars
/* eslint-disable no-debugger */
import Effect from './Effect'
// 雷达平扫
class RaderScan extends Effect {
  step: number
  scanColor: string
  constructor(viewer: any, id: string) {
    super(viewer, id)
    this.step = -0.2
    this.scanColor = 'rgba(19, 206, 102, 0.8)'
  }
  change_step(step: number) {
    this.step = step
  }
  change_color(val: string) {
    this.scanColor = val
  }
  add(position: any, scanColor: string, maxRadius: number, step: number, isedit = false) {
    super.add(position, scanColor, maxRadius, step, isedit)
    this.step = step
    this.scanColor = scanColor
    const _this = this
    let rotation = 0

    // 因为画布内变化CallbackProperty监控不到，所以用两个画布切换的方式达成效果
    let linkA = document.createElement('canvas')
    linkA.setAttribute('width', '800px')
    linkA.setAttribute('height', '800px')
    linkA.setAttribute('id', 'canvas-a')
    let linkB = document.createElement('canvas')
    linkB.setAttribute('width', '800px')
    linkB.setAttribute('height', '800px')
    linkB.setAttribute('id', 'canvas-b')
    let canvasCollection: any = linkA

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
        rotation: new Cesium.CallbackProperty(() => {
          rotation -= _this.step || -0.02
          return rotation
        }, false),
        stRotation: new Cesium.CallbackProperty(() => {
          rotation -= _this.step || -0.02
          return rotation
        }, false),
        material: new Cesium.ImageMaterialProperty({
          image: new Cesium.CallbackProperty(() => {
            canvasCollection =
              canvasCollection.id === 'canvas-a' ? linkB : linkA // 切换画布
            let context = canvasCollection.getContext('2d')
            context.clearRect(0, 0, canvasCollection.width, canvasCollection.height) // 清空画布
            let scanColor0 = _this.scanColor || 'rgba(255,0,0,1)'
            let scanColorTmp = scanColor0.split(',')
            scanColorTmp[3] = '0)'
            let scanColor1 = scanColorTmp.join()
            let grd = context.createLinearGradient(
              175,
              100,
              canvasCollection.width,
              canvasCollection.height / 2
            )
            grd.addColorStop(0, scanColor0)
            grd.addColorStop(1, scanColor1)
            context.fillStyle = grd
            context.beginPath()
            context.moveTo(400, 400)
            context.arc(
              400,
              400,
              400,
              (-30 / 180) * Math.PI,
              (0 / 180) * Math.PI
            )
            context.fill()
            return canvasCollection
          }, false),
          transparent: true,
        }),
      },
    })
  }
}
export default RaderScan

/*
function colors_tran(co) { // 颜色转换
  // 16进制颜色值的正则
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/
  // 把颜色值变成小写
  let color = co.toLowerCase()
  if (reg.test(color)) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    if (color.length === 4) {
      let colorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        colorNew += color
          .slice(i, i + 1)
          .concat(color.slice(i, i + 1))
      }
      color = colorNew
    }
    // 处理六位的颜色值，转为RGB
    const colorChange = []
    for (let i = 1; i < 7; i += 2) {
      colorChange.push(parseInt('0x' + color.slice(i, i + 2)))
    }
    return 'RGBA(' + colorChange.join(',') + ',0.3)'
  } 
  return color
}
*/
