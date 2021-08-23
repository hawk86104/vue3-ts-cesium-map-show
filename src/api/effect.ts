/*
 * @Description: 
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-08-23 13:54:51
 * @LastEditors: Hawk
 * @LastEditTime: 2021-08-23 14:10:30
 */
import { http } from '../utils/http'
export const getPointsEffectList = (): any => {
  return http.request('get', '/effect/getPointsEffectList')
}