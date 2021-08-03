import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import TitleSet from '../views/SetConfigPages/TitleSet.vue'
import Effect from '../views/SetConfigPages/Effect.vue'
import Cesium from '../views/Cesium3DIndex.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/effect',
    name: 'Effect',
    component: Effect,
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
