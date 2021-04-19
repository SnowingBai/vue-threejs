<template>
  <div class="menus-wrap">
    <template
      v-for="(menu, index) in menus"
      :key="index"
    >
      <div
        v-if="menu.children && menu.children.length"
        class="parent-wrap"
      >
        <div
          class="parent-item"
          @click="toggleOpen(menu.name)"
        >
          {{ menu.name }}
        </div>
        <div
          class="child-wrap"
          v-show="openKeys.includes(menu.name)"
        >
          <div
            v-for="(child, idx) in menu.children"
            :key="`${index}-${idx}`"
            :class="selectedKeys.includes(child.name) ? 'selected' : ''"
            class="child-item"
            @click="clickMenuItem(child)"
          >
            {{ child.meta && child.meta.title }}
          </div>
        </div>
      </div>
      <div
        v-else
        class="parent-item"
        @click="clickMenuItem(menu)"
      >
        {{ menu.name }}
      </div>
    </template>
  </div>
</template>

<script>
import { computed, defineComponent, reactive, watch, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { routes } from '@/router'

export default defineComponent({
  name: 'Menus',
  setup () {
    // 当前路由
    const currentRoute = useRoute()
    const router = useRouter()

    // 获取当前打开的子菜单
    const getOpenKeys = () => [currentRoute.matched[1].name]

    const menus = computed(() => routes.find(route => route.name === 'Layout').children)
    const state = reactive({
      openKeys: getOpenKeys(),
      selectedKeys: [currentRoute.name]
    })

    const toggleOpen = (name) => {
      const idx = state.openKeys.indexOf(name)
      idx > -1 ? state.openKeys.splice(idx, 1) : state.openKeys.push(name)
    }

    watch(() => currentRoute.fullPath, () => {
      state.openKeys = getOpenKeys()
      state.selectedKeys = [currentRoute.name]
    })

    // 点击菜单
    const clickMenuItem = ({ name, path }) => {
      router.push({ name })
    }

    return {
      ...toRefs(state),
      menus,
      toggleOpen,
      clickMenuItem
    }
  }
})
</script>

<style lang='scss' scoped>
.menus-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 200px;
  height: 100%;
  background: rgba(0, 0, 0, .5);
  color: #fff;
  .parent-item {
    height: 40px;
    line-height: 40px;
    padding: 0 12px;
    cursor: pointer;
  }
  .child-item {
    height: 34px;
    line-height: 34px;
    padding: 0 20px;
    background: rgba(255, 255, 255, 0.1);
    cursor: pointer;
    &.selected,
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

// fade-updown
.fade-updown-leave-active,
.fade-updown-enter-active {
  transition: .6s;
}

.fade-updown-enter {
  top: 100%;
}

.fade-updown-leave-to {
  top: 100%;
}
</style>
