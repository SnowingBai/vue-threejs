import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Demo',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "demo" */ '@/views/Demo.vue')
  },
  {
    path: '/line',
    name: 'Line',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "demo" */ '@/views/Line.vue')
  },
  {
    path: '/activeline',
    name: 'ActiveLine',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "demo" */ '@/views/ActiveLine.vue')
  },
  {
    path: '/sphereGeometry',
    name: 'SphereGeometry',
    component: () => import('@/views/SphereGeometry.vue')
  },
  {
    path: '/geometry',
    name: 'Geometry',
    component: () => import('@/views/Geometry.vue')
  },
  {
    path: '/camera',
    name: 'Camera',
    component: () => import('@/views/Camera.vue')
  },
  {
    path: '/half',
    name: 'Half',
    component: () => import('@/views/Half.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
