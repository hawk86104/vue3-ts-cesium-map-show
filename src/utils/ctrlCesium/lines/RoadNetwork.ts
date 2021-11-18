/*
 * @Description: 大型路网
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-08-26 10:48:22
 * @LastEditors: Hawk
 * @LastEditTime: 2021-09-28 16:28:17
 */
/* eslint-disable no-debugger */
import { getLinesEffectList } from '@/api/effect'
import { init } from './MaterialProperty/PolylineTrailMaterialProperty'
import { init as init2 } from './MaterialProperty/Spriteline1MaterialProperty'

import * as turf from '@turf/turf'
class RoadNetwork {
  viewer: any
  id: string
  FlyLinesEntities: any
  BusLinesEntities: any
  RoadPicEntities: any
  constructor(viewer: any, id: string) {
    this.viewer = viewer
    this.id = id
    this.FlyLinesEntities = []
    this.BusLinesEntities = []
    this.RoadPicEntities = []
  }
  async init() {
    // 首先从数据中 获取需要展示的数据
    const res: any = await getLinesEffectList()
    const _this = this
    if (res.data) {
      res.data.forEach((element: any, index: number) => {
        let setup_param = JSON.parse(element.setup_param)
        for (let key in setup_param) {
          if (key !== 'color') {
            setup_param[key] = parseFloat(setup_param[key])
          }
        }
        if (element.type === 'FlyLines') {
          this.addFlyLines([setup_param.startPoint_lng, setup_param.startPoint_lat, setup_param.endPoint_ing, setup_param.endPoint_lat]
            , setup_param.color, element.width, setup_param.height, setup_param.speed, setup_param.percent, setup_param.gradient, setup_param.random)
        }
        else if (element.type === 'BusLines') {
          this.addBusLines(element.geojsonfile,
            setup_param.color, element.width, setup_param.speed, setup_param.percent, setup_param.gradient
          )
        }
        else if (element.type === 'RoadPic') {
          this.addRoadPic(element.geojsonfile, element.effectimage, element.width, setup_param.time)
        }
      })
    }
  }
  changeLinesPercent(type: string, val: number) {
    let entityC = null
    if (type === 'FlyLines') {
      entityC = this.FlyLinesEntities
    }
    if (type === 'BusLines') {
      entityC = this.BusLinesEntities
    }
    entityC.forEach((item: any) => {
      item.polyline.material.percent = val
    })
  }
  changeLinesSpeed(type: string, val: number) {
    let entityC = null
    if (type === 'FlyLines') {
      entityC = this.FlyLinesEntities
    }
    if (type === 'BusLines') {
      entityC = this.BusLinesEntities
    }
    entityC.forEach((item: any) => {
      item.polyline.material.speed = val
    })
  }
  changeLinesGradient(type: string, val: number) {
    let entityC = null
    if (type === 'FlyLines') {
      entityC = this.FlyLinesEntities
    }
    if (type === 'BusLines') {
      entityC = this.BusLinesEntities
    }
    entityC.forEach((item: any) => {
      item.polyline.material.gradient = val
    })
  }
  changeLinesColor(type: string, color: string) {
    let entityC = null
    if (type === 'FlyLines') {
      entityC = this.FlyLinesEntities
    }
    if (type === 'BusLines') {
      entityC = this.BusLinesEntities
    }
    entityC.forEach((item: any) => {
      item.polyline.material.color = new Cesium.Color.fromCssColorString(color)
    })
  }
  changeLinesWidth(type: string, width: number) {
    let entityC = null
    if (type === 'FlyLines') {
      entityC = this.FlyLinesEntities
    }
    if (type === 'BusLines') {
      entityC = this.BusLinesEntities
    }
    if (type === 'RoadPic') {
      entityC = this.RoadPicEntities
    }
    entityC.forEach((item: any) => {
      item.polyline.width = width
    })
  }
  changeLinesTime(type: string, time: number) {
    let entityC = this.RoadPicEntities
    entityC.forEach((item: any) => {
      item.polyline.material.duration = time
    })
  }
  remakeFlyLines(bbox: any, color: string, width: number, height: number, speed: number, percent: number, gradient: number, random: number) {
    this.clearFlyLines()
    this.addFlyLines(bbox, color, width, height, speed, percent, gradient, random)
  }
  clearFlyLines() {
    const _this = this
    this.FlyLinesEntities.forEach((item) => {
      _this.viewer.entities.removeById(item.id)
    })
    this.FlyLinesEntities = []
  }
  addFlyLines(bbox: any, color: string, width: number, height: number, speed: number, percent: number, gradient: number, random: number) {
    init()
    const _this = this
    // 生成随机点
    let points = turf.randomPoint(random, {
      bbox: bbox,
    })
    let features = points.features
    let point: any
    let startPosition: any
    let endPosition: any
    features.forEach((item) => {
      point = item.geometry.coordinates
      startPosition = Cesium.Cartesian3.fromDegrees(point[0], point[1], 0)
      endPosition = Cesium.Cartesian3.fromDegrees(
        point[0],
        point[1],
        height * Math.random()
      )
      _this.FlyLinesEntities.push(_this.viewer.entities.add({
        polyline: {
          positions: [startPosition, endPosition],
          width: width,
          material: new Cesium.PolylineTrailMaterialProperty({
            speed: speed * Math.random(),
            color: new Cesium.Color.fromCssColorString(color),
            percent: percent, // 尾巴拖多少长
            gradient: gradient, // 变化率
          }),
        },
      })
      )
    })
  }
  addBusLines(url: string, color: string, width: number, speed: number, percent: number, gradient: number) {
    init()
    const _this = this
    let promise = Cesium.GeoJsonDataSource.load(url)
    promise.then(function(dataSource: any) {
      _this.viewer.dataSources.add(dataSource)
      _this.BusLinesEntities = dataSource.entities.values
      let del_list = []
      for (let i = 0; i < _this.BusLinesEntities.length; i++) {
        const entity = _this.BusLinesEntities[i]
        if (entity.polyline.positions._value.length > 6) { // 这里把街道复杂度小余6的进行筛除
          entity.polyline.width = width
          entity.polyline.material = new Cesium.PolylineTrailMaterialProperty({
            speed: speed * Math.random(),
            color: new Cesium.Color.fromCssColorString(color),
            percent: percent, // 尾巴拖多少长
            gradient: gradient, // 变化率
          })
        }
        else {
          del_list.push(entity.id)
        }
      }
      del_list.forEach((id: number) => {
        dataSource.entities.removeById(id)
      })
    })
  }
  addRoadPic(url: string, Picurl: string, width: number, time: number) {
    init2()
    const _this = this
    let promise = Cesium.GeoJsonDataSource.load(url)
    promise.then(function(dataSource: any) {
      _this.viewer.dataSources.add(dataSource)
      _this.RoadPicEntities = dataSource.entities.values
      for (let i = 0; i < _this.RoadPicEntities.length; i++) {
        const entity = _this.RoadPicEntities[i]
        entity.polyline.width = width
        entity.polyline.material = new Cesium.Spriteline1MaterialProperty(time, Picurl)
      }
    })
  }
  // 飞线 [ 用于 测试 ]
  // 代码
  loadFlyLines() {
    init()
    const _this = this
    Cesium.Resource.fetchJson(
      'https://mapv-data.oss-cn-hangzhou.aliyuncs.com/geojson/nanshan-road1.geojson'
    ).then(function(res: any) {
      let bbox = turf.bbox(res)
      let points = turf.randomPoint(100, {
        bbox: bbox,
      }) // 生成随机点
      let features = points.features
      let point: any
      let startPosition: any
      let endPosition: any
      features.forEach((item) => {
        point = item.geometry.coordinates
        startPosition = Cesium.Cartesian3.fromDegrees(point[0], point[1], 0)
        endPosition = Cesium.Cartesian3.fromDegrees(
          point[0],
          point[1],
          3000 * Math.random()
        )
        _this.viewer.entities.add({
          polyline: {
            positions: [startPosition, endPosition],
            width: 2,
            material: new Cesium.PolylineTrailMaterialProperty({
              speed: 6 * Math.random(),
              color: new Cesium.Color.fromCssColorString('#32B47E'),
              percent: 0.1, // 尾巴拖多少长
              gradient: 0.01, // 变化率
            }),
          },
        })
      })
    })
  }
  // 道路穿梭线
  loadRoadPicEffect() {
    init2()
    const _this = this
    let promise = Cesium.GeoJsonDataSource.load(
      'https://mapv-data.oss-cn-hangzhou.aliyuncs.com/geojson/nanshan-road1.geojson'
    )
    promise.then(function(dataSource: any) {
      _this.viewer.dataSources.add(dataSource)
      const entities = dataSource.entities.values
      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i]
        entity.polyline.width = 3.0
        entity.polyline.material = new Cesium.Spriteline1MaterialProperty(
          1000,
          'https://mapv-data.oss-cn-hangzhou.aliyuncs.com/pic/spriteline1.png'
        )
      }
    })

    promise = Cesium.GeoJsonDataSource.load(
      'https://mapv-data.oss-cn-hangzhou.aliyuncs.com/geojson/nanshan-road2.geojson'
    )
    promise.then(function(dataSource: any) {
      _this.viewer.dataSources.add(dataSource)
      const entities = dataSource.entities.values
      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i]
        entity.polyline.width = 3.0
        entity.polyline.material = new Cesium.Spriteline1MaterialProperty(
          500,
          'https://mapv-data.oss-cn-hangzhou.aliyuncs.com/pic/spriteline2.png'
        )
      }
    })

    promise = Cesium.GeoJsonDataSource.load(
      'https://mapv-data.oss-cn-hangzhou.aliyuncs.com/geojson/nanshan-road3.geojson'
    )
    promise.then(function(dataSource: any) {
      _this.viewer.dataSources.add(dataSource)
      const entities = dataSource.entities.values
      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i]
        entity.polyline.width = 3.0
        entity.polyline.material = new Cesium.Spriteline1MaterialProperty(
          500,
          'https://mapv-data.oss-cn-hangzhou.aliyuncs.com/pic/spriteline3.png'
        )
      }
    })
  }
  loadShenZhengLinesData() {
    init()
    const _this = this
    let promise = Cesium.GeoJsonDataSource.load('https://mapv-data.oss-cn-hangzhou.aliyuncs.com/geojson/shenzhen-nanshan.geojson')
    promise.then(function(dataSource: any) {
      _this.viewer.dataSources.add(dataSource)
      const entities = dataSource.entities.values
      let del_list = []
      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i]
        if (entity.polyline.positions._value.length > 6) {
          entity.polyline.width = 3.6
          entity.polyline.material = new Cesium.PolylineTrailMaterialProperty({
            speed: 12 * Math.random(),
            color: new Cesium.Color.fromCssColorString('#32B47E'),
            percent: 0.3, // 尾巴拖多少长
            gradient: 0.02, // 变化率
          })
        }
        else {
          del_list.push(entity.id)
        }
      }
      del_list.forEach((id: number) => {
        dataSource.entities.removeById(id)
      })
    })
  }
  loadBeijingLinesData() {
    const _this = this
    Cesium.Resource.fetchJson('https://mapv-data.oss-cn-hangzhou.aliyuncs.com/geojson/bj-lines-bus.json').then(function(i: any) {
      let t = []
      i.map(function(e: any, i: number) {
        let n = []
        let s = []
        for (let a = 0; a < e.length; a += 2) {
          let r = [e[a], e[a + 1]]
          a > 0 && (r = [n[0] + r[0], n[1] + r[1]])
          n = r
          let o = r[0] / 1e4
          let c = r[1] / 1e4
          s.push(o)
          s.push(c)
        }
        t.push({
          positions: s,
          color: new Cesium.Color(
            0,
            0.8 * Math.random() + 0.2,
            0.5 * Math.random() + 0.5,
            1
          ),
          width: 2,
        })
      })
      _this.addLineDatas(t)
    })
  }
  addLineDatas(e: any) {
    const _this = this
    e.forEach(function(e: any) {
      _this.viewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray(e.positions),
          width: e.width,
          material: new Cesium.PolylineTrailMaterialProperty({
            speed: 30 * Math.random(),
            color: e.color,
            percent: 0.01,
            gradient: 0.1,
          }),
        },
      })
    })
  }
}
export default RoadNetwork
