<script lang="ts">
import { tv } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/skeleton'

const appConfig = _appConfig as AppConfig & { ui: { skeleton: Partial<typeof theme> } }

const skeleton = tv({ extend: tv(theme), ...(appConfig.ui?.skeleton || {}) })

export interface SkeletonProps {
  as?: string
  class?: any
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<SkeletonProps>(), { as: 'div' })
</script>

<template>
  <component :is="as" :class="skeleton({ class: props.class })">
    <slot />
  </component>
</template>