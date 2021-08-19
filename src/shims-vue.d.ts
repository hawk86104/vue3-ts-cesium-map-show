/*
 * @Description: 
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-06-17 15:09:06
 * @LastEditors: Hawk
 * @LastEditTime: 2021-08-18 13:34:57
 */
/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
  declare var $: any
  declare const Cesium: any
  declare global {
    interface Window { Gviewer: any; }
  }
}
declare var $: any
declare const Cesium: any
declare global {
  interface Window { Gviewer: any; }
}