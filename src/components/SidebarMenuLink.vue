<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator'

@Component
export default class SidebarMenuLink extends Vue {
  @Prop
  item = {}
}

</script>
<template>
    <a v-bind="$attrs">
        <slot />
    </a>
</template>
