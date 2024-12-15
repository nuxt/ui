<script lang="ts">
import { tv } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/skeleton'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'

const appConfig = _appConfig as AppConfig & { ui: { skeleton: Partial<typeof theme> } }

const skeleton = tv({ extend: tv(theme), ...(appConfig.ui?.skeleton || {}) })

export interface SkeletonProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
}

extendDevtoolsMeta({ example: 'SkeletonExample' })
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
