import { createRouter, createWebHashHistory } from 'vue-router'
import Layouts from '@/layouts'
import RouterTransition from '@/layouts/content.vue'

export const routes = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/demo',
    component: Layouts,
    children: [
      {
        path: '/demo',
        name: 'Demo',
        component: () => import('@/views/Demo.vue')
      },
      {
        path: '/camera',
        name: 'Camera',
        redirect: '/camera/array',
        component: RouterTransition,
        children: [
          {
            path: 'array',
            name: 'CameraArray',
            component: () => import('@/views/camera/array.vue')
          },
          {
            path: 'group',
            name: 'CameraGroup',
            component: () => import('@/views/camera/group.vue')
          },
          {
            path: 'cube',
            name: 'CameraCube',
            component: () => import('@/views/camera/cube.vue')
          },
          {
            path: 'stereo',
            name: 'CameraStereo',
            component: () => import('@/views/camera/stereo.vue')
          }
        ]
      },
      {
        path: '/texture',
        name: 'Texture',
        redirect: '/texture/box',
        component: RouterTransition,
        children: [
          {
            path: 'box',
            name: 'TextureBox',
            component: () => import('@/views/texture/box.vue')
          }
        ]
      },
      {
        path: '/geometry',
        name: 'Geometry',
        redirect: '/geometry/teapot',
        component: RouterTransition,
        children: [
          {
            path: 'teapot',
            name: 'GeoTeapot',
            component: () => import('@/views/geometry/teapot.vue')
          },
          {
            path: 'car',
            name: 'GeoCar',
            component: () => import('@/views/geometry/car.vue')
          },
          {
            path: 'modelCar',
            name: 'GeoModelCar',
            component: () => import('@/views/geometry/modelCar.vue')
          },
          {
            path: '/sphereGeometry',
            name: 'SphereGeometry',
            component: () => import('@/views/geometry/sphereGeometry.vue')
          }
        ]
      },
      {
        path: '/others',
        name: 'Others',
        redirect: '/others/line',
        component: RouterTransition,
        children: [
          {
            path: 'line',
            name: 'Line',
            component: () => import('@/views/others/line.vue')
          },
          {
            path: '/activeline',
            name: 'ActiveLine',
            component: () => import('@/views/others/activeLine.vue')
          },
          {
            path: '/half',
            name: 'Half',
            component: () => import('@/views/others/half.vue')
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
