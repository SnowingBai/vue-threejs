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
        meta: { title: 'Demo' },
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
            meta: { title: 'Array' },
            component: () => import('@/views/camera/array.vue')
          },
          {
            path: 'group',
            name: 'CameraGroup',
            meta: { title: 'Group' },
            component: () => import('@/views/camera/group.vue')
          },
          {
            path: 'cube',
            name: 'CameraCube',
            meta: { title: 'Cube' },
            component: () => import('@/views/camera/cube.vue')
          },
          {
            path: 'stereo',
            name: 'CameraStereo',
            meta: { title: 'Stereo' },
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
            meta: { title: 'Box' },
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
            meta: { title: 'Teapot' },
            component: () => import('@/views/geometry/teapot.vue')
          },
          {
            path: 'car',
            name: 'GeoCar',
            meta: { title: 'Car' },
            component: () => import('@/views/geometry/car.vue')
          },
          {
            path: 'modelCar',
            name: 'GeoModelCar',
            meta: { title: 'ModelCar' },
            component: () => import('@/views/geometry/modelCar.vue')
          },
          {
            path: '/sphereGeometry',
            name: 'SphereGeometry',
            meta: { title: 'Sphere' },
            component: () => import('@/views/geometry/sphereGeometry.vue')
          }
        ]
      },
      {
        path: '/light',
        name: 'Light',
        redirect: '/light/spotLight',
        component: RouterTransition,
        children: [
          {
            path: 'spotLight',
            name: 'SpotLight',
            meta: { title: 'SpotLight' },
            component: () => import('@/views/light/spotLight.vue')
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
            meta: { title: 'Line' },
            component: () => import('@/views/others/line.vue')
          },
          {
            path: '/half',
            name: 'Half',
            meta: { title: 'Half' },
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
