<script lang="ts">
import { tv } from 'tailwind-variants'
import type { PrimitiveProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/skeleton'

const appConfig = _appConfig as AppConfig & { ui: { skeleton: Partial<typeof theme> } }

const skeleton = tv({ extend: tv(theme), ...(appConfig.ui?.skeleton || {}) })

export interface SkeletonProps extends Omit<PrimitiveProps, 'asChild'> {
  class?: any
}
</script>

<script setup lang="ts">
import { Primitive } from 'radix-vue'

const props = withDefaults(defineProps<SkeletonProps>(), { as: 'div' })
</script>

<template>
  <Primitive :as="as" :class="skeleton({ class: props.class })">
    <slot />
  </Primitive>
</template>
