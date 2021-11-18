import { http } from '../utils/http'
// import qs from 'qs'

// 获取地图配置信息
export const getMapConfig = (): any => {
  return http.request('get', '/base/getMapConfig')
}

// 获取地图初始化视角
export const getMapView = (): any => {
  return http.request('get', '/base/getMapView')
}

// 获取底图层级list
export const getMapImageryList = (): any => {
  return http.request('get', '/base/getMapImageryList')
}

// 设置地图初始化视角
export const setMapView = (data: any): any => {
  return http.post('/base/setMapView', data)
}
