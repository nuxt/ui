<template>
  <nav :class="wrapperClass">
    <Link
      v-for="(link, index) of links"
      :key="index"
      :to="link.to"
      :exact="link.exact"
      :class="baseClass"
      :active-class="activeClass"
      :inactive-class="inactiveClass"
    >
      {{ link.label }}
    </Link>
  </nav>
</template>

<script setup lang="ts">
import Link from '../elements/Link'
import $ui from '#build/ui'

defineProps({
  links: {
    type: Array,
    required: true
  },
  wrapperClass: {
    type: String,
    default: () => $ui.tabs.wrapper
  },
  baseClass: {
    type: String,
    default: () => $ui.tabs.base
  },
  activeClass: {
    type: String,
    default: () => $ui.tabs.active
  },
  inactiveClass: {
    type: String,
    default: () => $ui.tabs.inactive
  }
})
</script>

<script lang="ts">
export default { name: 'UTabs' }
</script>
