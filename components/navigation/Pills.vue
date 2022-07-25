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
import type { PropType } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'
import Link from '../elements/Link.vue'
import { $theme } from '#theme'

defineProps({
  links: {
    type: Array as PropType<{ to: RouteLocationNormalized, exact: boolean, label: string }[]>,
    required: true
  },
  wrapperClass: {
    type: String,
    default () { return $theme('ui.pills.wrapper') }
  },
  baseClass: {
    type: String,
    default () { return $theme('ui.pills.base') }
  },
  activeClass: {
    type: String,
    default () { return $theme('ui.pills.active') }
  },
  inactiveClass: {
    type: String,
    default () { return $theme('ui.pills.inactive') }
  }
})
</script>

<script lang="ts">
export default { name: 'UPills' }
</script>
