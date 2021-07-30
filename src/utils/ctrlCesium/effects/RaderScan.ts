// eslint-disable-line no-unused-vars
/* eslint-disable no-debugger */
declare const Cesium: any
// 雷达平扫
class RaderScan {
  viewer: any
  constructor(viewer: any) {
    this.viewer = viewer
  }
  add(
    position: any,
    scanColor: string,
    maxRadius: number,
    step: number
  ) {
    let rotation = 0
    let canvasCollection = null
    this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(
        position[0],
        position[1],
        position[2]
      ),
      ellipse: {
        semiMinorAxis: maxRadius || 1000,
        semiMajorAxis: maxRadius || 1000,
        rotation: new Cesium.CallbackProperty(() => {
          rotation -= step || -0.02
          return rotation
        }, false),
        stRotation: new Cesium.CallbackProperty(() => {
          rotation -= step || -0.02
          return rotation
        }, false),
        material: new Cesium.ImageMaterialProperty({
          image: new Cesium.CallbackProperty(() => {
            if (!canvasCollection) {
              canvasCollection = document.createElement('canvas')
            }
            function colors_tran(co) {
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
            scanColor = scanColor || 'rgba(255,0,0,1)'
            scanColor = colors_tran(scanColor)
            const scanColorTmp = scanColor.split(',')
            scanColorTmp[3] = '0)'
            const scanColor1 = scanColorTmp.join()

            canvasCollection.setAttribute('width', 3000)
            canvasCollection.setAttribute('height', 3000)
            const context = canvasCollection.getContext('2d')
            const grd = context.createLinearGradient(
              175,
              100,
              canvasCollection.width,
              canvasCollection.height / 2
            )
            grd.addColorStop(0, scanColor)
            grd.addColorStop(1, scanColor1)
            context.fillStyle = grd
            context.beginPath()
            context.moveTo(1500, 1500)
            context.arc(
              1500,
              1500,
              1500,
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
