<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/skeleton'
import { tv } from '../utils/tv'

const appConfigSkeleton = _appConfig as AppConfig & { ui: { skeleton: Partial<typeof theme> } }

const skeleton = tv({ extend: tv(theme), ...(appConfigSkeleton.ui?.skeleton || {}) })

export interface SkeletonProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

const props = defineProps<SkeletonProps>()
</script>

<template>
  <Primitive :as="as" :class="skeleton({ class: props.class })">
    <slot />
  </Primitive>
</template>
