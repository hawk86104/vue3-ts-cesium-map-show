import { http } from '../utils/http'

// 获取白膜list
export const getTitlesetList = (): any => {
  return http.request('get', '/titleset/getTitlesetList')
}