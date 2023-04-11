<template>
  <span :class="badgeClass">
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import { classNames } from '../../utils'
import $appConfig from '#build/app.config'
import { useAppConfig } from '#imports'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator (value: string) {
      return Object.keys($appConfig.ui.badge.size).includes(value)
    }
  },
  variant: {
    type: String,
    default: 'primary',
    validator (value: string) {
      return Object.keys($appConfig.ui.badge.variant).includes(value)
    }
  },
  label: {
    type: String,
    default: null
  },
  ui: {
    type: Object as PropType<Partial<typeof $appConfig.ui.badge>>,
    default: () => $appConfig.ui.badge
  }
})

const appConfig = useAppConfig()

const ui = computed<Partial<typeof appConfig.ui.badge>>(() => defu({}, props.ui, appConfig.ui.badge))

const badgeClass = computed(() => {
  return classNames(
    ui.value.base,
    ui.value.rounded,
    ui.value.size[props.size],
    ui.value.variant[props.variant]
  )
})
</script>
