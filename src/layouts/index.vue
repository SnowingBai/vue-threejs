<template>
  <div class="layout-wrap">
    <Menu />
    <Content />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

import Menu from './menu'
import Content from './content'

export default defineComponent({
  name: 'LayoutIndex',
  components: {
    Menu,
    Content
  },
  setup () {
    return {}
  }
})
</script>

<style lang='less' scoped>
</style>
