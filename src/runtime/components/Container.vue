<script lang="ts">
import { tv } from 'tailwind-variants'
import _appConfig from '#build/app.config'
import theme from '#build/ui/container'
import type { AppConfig } from '@nuxt/schema'

const appConfig = _appConfig as AppConfig & { ui: { container: Partial<typeof theme> } }

const container = tv({ extend: tv(theme), ...(appConfig.ui?.container || {}) })

export interface ContainerProps {
  as?: string
  class?: any
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<ContainerProps>(), {
  as: 'div'
})
</script>

<template>
  <component :is="as" :class="container({ class: props.class })">
    <slot />
  </component>
</template>