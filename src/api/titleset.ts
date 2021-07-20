import { http } from '../utils/http'

// 获取白膜list
export const getTitlesetList = (): any => {
  return http.request('get', '/titleset/getTitlesetList')
}

// 获取一条白膜
export const getOneTitleset = (id: string): any => {
  return http.request('get', '/titleset/getOneTitleset?id=' + id)
}
