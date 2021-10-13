/*
 * @Description: 
 * @Version: 1.668
 * @Autor: Hawk
 * @Date: 2021-06-17 15:09:06
 * @LastEditors: Hawk
 * @LastEditTime: 2021-10-13 09:35:10
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import TitleSet from '../views/SetConfigPages/TitleSet.vue'
import Lines from '../views/SetConfigPages/Lines.vue'
import Effect from '../views/SetConfigPages/Effect.vue'
import Imagery from '../views/SetConfigPages/Imagery.vue'
import Model from '../views/SetConfigPages/Model.vue'
import Cesium from '../views/Cesium3DIndex.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/model',
    name: 'Model',
    component: Model,
  },
  {
    path: '/effect',
    name: 'Effect',
    component: Effect,
  },
  {
    path: '/imagery',
    name: 'Imagery',
    component: Imagery,
  },
  {
    path: '/lines',
    name: 'Lines',
    component: Lines,
  },
  {
    path: '/titleset',
    name: 'TitleSet',
    component: TitleSet,
  },
  {
    path: '/',
    name: 'Cesium',
    component: Cesium,
  },
]

const router = createRouter({
  // hash模式：createWebHashHistory，
  // history模式：createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

export default router
