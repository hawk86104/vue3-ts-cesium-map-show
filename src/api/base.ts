import { http } from '../utils/http'

// 获取地图配置信息
export const getMapConfig = (): any => {
  return http.request('get', '/base/getMapConfig')
}
