/*
 * @Description: 
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-11-10 14:19:34
 * @LastEditors: Hawk
 * @LastEditTime: 2021-11-10 14:19:34
 */
import { http } from '../utils/http'
export const getPrimitivesList = (): any => {
  return http.request('get', '/primitive/getPrimitivesList')
}