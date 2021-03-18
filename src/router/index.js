import { createRouter, createWebHashHistory } from 'vue-router'
import RouterTransition from '@/components/transition/router-transition.vue'

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
    path: '/half',
    name: 'Half',
    component: () => import('@/views/Half.vue')
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
    redirect: 'texture/index',
    component: RouterTransition,
    children: [
      {
        path: 'index',
        name: 'TextureIndex',
        component: () => import('@/views/texture/index.vue')
      }
    ]
  },
  {
    path: '/geometry',
    name: 'Geometry',
    redirect: 'geometry/teapot',
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
        component: () => import('@/views/geometry/car/index.vue')
      },
      {
        path: 'carmodel',
        name: 'CarModel',
        component: () => import('@/views/geometry/car/models.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
