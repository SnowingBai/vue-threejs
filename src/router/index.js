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
        path: '/areas',
        name: 'Areas',
        redirect: '/areas/building',
        component: RouterTransition,
        children: [
          {
            path: 'building',
            name: 'Building',
            meta: { title: 'Building' },
            component: () => import('@/views/areas/building.vue')
          },
          {
            path: 'city',
            name: 'City',
            meta: { title: 'City' },
            component: () => import('@/views/areas/city.vue')
          },
          {
            path: 'snowCity',
            name: 'SnowCity',
            meta: { title: 'SnowCity' },
            component: () => import('@/views/areas/snowCity.vue')
          },
          {
            path: 'cityGroup',
            name: 'CityGroup',
            meta: { title: 'CityGroup' },
            component: () => import('@/views/areas/cityGroup.vue')
          },
          {
            path: 'zj',
            name: 'ZJ',
            meta: { title: 'ZJ' },
            component: () => import('@/views/areas/zj.vue')
          },
          {
            path: 'cityModel',
            name: 'CityModel',
            meta: { title: 'CityModel' },
            component: () => import('@/views/areas/cityModel.vue')
          },
          {
            path: 'earth',
            name: 'Earth',
            meta: { title: 'Earth' },
            component: () => import('@/views/areas/earth.vue')
          },
          {
            path: 'hangzhou',
            name: 'Hangzhou',
            meta: { title: 'Hangzhou' },
            component: () => import('@/views/areas/hangzhou.vue')
          }
        ]
      },
      {
        path: '/animation',
        name: 'Animation',
        redirect: '/animation/moveLine',
        component: RouterTransition,
        children: [
          {
            path: 'moveLine',
            name: 'MoveLine',
            meta: { title: 'MoveLine' },
            component: () => import('@/views/animation/moveLine.vue')
          },
          {
            path: 'movePath',
            name: 'MovePath',
            meta: { title: 'MovePath' },
            component: () => import('@/views/animation/movePath.vue')
          },
          {
            path: 'wall',
            name: 'Wall',
            meta: { title: 'Wall' },
            component: () => import('@/views/animation/wall.vue')
          }
          // {
          //   path: 'test',
          //   name: 'Test',
          //   meta: { title: 'Test' },
          //   component: () => import('@/views/animation/test.vue')
          // }
        ]
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
            path: '/mirror',
            name: 'Mirror',
            meta: { title: 'Mirror' },
            component: () => import('@/views/geometry/mirror.vue')
          },
          {
            path: '/factory',
            name: 'Factory',
            meta: { title: 'Factory' },
            component: () => import('@/views/geometry/factory.vue')
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
      // {
      //   path: '/sprites',
      //   name: 'Sprites',
      //   redirect: '/sprites/snow',
      //   component: RouterTransition,
      //   children: [
      //     {
      //       path: 'snow',
      //       name: 'Snow',
      //       meta: { title: 'Snow' },
      //       component: () => import('@/views/sprites/snow.vue')
      //     }
      //   ]
      // },
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
          },
          {
            path: 'mine',
            name: 'Mine',
            meta: { title: 'Mine' },
            component: () => import('@/views/texture/mine.vue')
          }
        ]
      },
      {
        path: '/shapes',
        name: 'Shapes',
        redirect: '/shapes/fonts',
        component: RouterTransition,
        children: [
          {
            path: 'fonts',
            name: 'Fonts',
            meta: { title: 'Fonts' },
            component: () => import('@/views/shapes/fonts.vue')
          },
          {
            path: 'fontStroke',
            name: 'FontStroke',
            meta: { title: 'FontStroke' },
            component: () => import('@/views/shapes/fontStroke')
          }
        ]
      },
      {
        path: '/modellist',
        name: 'Modellist',
        redirect: '/modellist/diamond',
        component: RouterTransition,
        children: [
          {
            path: 'diamond',
            name: 'Diamond',
            meta: { title: 'Diamond' },
            component: () => import('@/views/modellist/diamond.vue')
          },
          {
            path: 'drive',
            name: 'Drive',
            meta: { title: 'Drive' },
            component: () => import('@/views/modellist/drive')
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
          },
          {
            path: '/water',
            name: 'Water',
            meta: { title: 'Water' },
            component: () => import('@/views/others/water.vue')
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
