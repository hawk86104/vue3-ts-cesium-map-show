// eslint-disable-line no-unused-vars
/* eslint-disable no-debugger */
import { init } from './MaterialProperty/Spriteline1MaterialProperty'
declare const Cesium: any

class Spriteline {
  viewer: any
  lastStageList: Array<any>
  constructor(viewer: any) {
    this.viewer = viewer
  }
  add() {
    const _this = this
    init()
    const promise = Cesium.GeoJsonDataSource.load('./gonglu.json')
    promise.then(function(dataSource) {
      console.log(dataSource)
      _this.viewer.dataSources.add(dataSource)
      const entities = dataSource.entities.values
      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i]
        if (i < 1000) {
          entity.polyline.width = 3.0
          entity.polyline.material = new Cesium.Spriteline1MaterialProperty(2e3)
        }
        else {
          _this.viewer.entities.removeById(entity.id)
          entity.show = false
        }
      }
    })
  }
}
export default Spriteline
