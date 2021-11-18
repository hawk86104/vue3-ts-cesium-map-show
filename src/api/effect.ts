/*
 * @Description: 
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-08-23 13:54:51
 * @LastEditors: Hawk
 * @LastEditTime: 2021-09-28 15:58:20
 */
import { http } from '../utils/http'
export const getPointsEffectList = (): any => {
  return http.request('get', '/effect/getPointsEffectList')
}

export const getLinesEffectList = (): any => {
  return http.request('get', '/effect/getLinesEffectList')
}