<template>
  <span :class="badgeClass">
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { classNames } from '../../utils'
import $ui from '#build/ui'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator (value: string) {
      return Object.keys($ui.badge.size).includes(value)
    }
  },
  variant: {
    type: String,
    default: 'primary',
    validator (value: string) {
      return Object.keys($ui.badge.variant).includes(value)
    }
  },
  baseClass: {
    type: String,
    default: () => $ui.badge.base
  },
  rounded: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: null
  }
})

const badgeClass = computed(() => {
  return classNames(
    props.baseClass,
    $ui.badge.size[props.size],
    $ui.badge.variant[props.variant],
    props.rounded ? 'rounded-full' : 'rounded-md'
  )
})
</script>

<script lang="ts">
export default { name: 'UBadge' }
</script>
