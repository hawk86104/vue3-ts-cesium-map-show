/*
 * @Description: 
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-07-15 10:43:21
 * @LastEditors: Hawk
 * @LastEditTime: 2021-08-23 13:55:08
 */
import { http } from '../utils/http'

// 获取白膜list
export const getTitlesetList = (): any => {
  return http.request('get', '/titleset/getTitlesetList')
}

// 获取一条白膜
export const getOneTitleset = (id: string): any => {
  return http.request('get', '/titleset/getOneTitleset?id=' + id)
}
