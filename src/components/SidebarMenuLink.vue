<template>
  <a v-bind="$attrs">
    <slot />
  </a>  
</template>

<script lang="ts">
import { Component, Vue, toNative, Prop } from 'vue-facing-decorator'

@Component
class SidebarMenuLink extends Vue {
  @Prop
  item = {}
}

export default toNative(SidebarMenuLink)
</script>

