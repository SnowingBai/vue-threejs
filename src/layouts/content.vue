<template>
  <router-view v-slot="{ Component }">
    <transition name="zoom-fade" mode="out-in" appear>
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Content',
  setup () {
    return {}
  }
})
</script>
