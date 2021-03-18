<template>
  <div class="menus-wrap">
    <div v-for="(menu, index) in menus" :key="index">
      <div class="parent-item">{{ menu.name }}</div>
      <!-- <div class="child-wrap">
        <div v-for="(child, idx) in menus.children" :key="`${index}-${idx}`" class="child-item">
          <router-link :to="child.path">{{ child.name }}</router-link>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'
// import { useRoute, useRouter } from 'vue-router'
import { routes } from '@/router'

export default defineComponent({
  name: 'Menus',
  setup () {
    const menus = computed(() => routes.find(route => route.name === 'Layout').children)
    return {
      menus
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
}
</style>
