<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/container'
import { tv } from '../utils/tv'

const appConfigContainer = _appConfig as AppConfig & { ui: { container: Partial<typeof theme> } }

const container = tv({ extend: tv(theme), ...(appConfigContainer.ui?.container || {}) })

export interface ContainerProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
}

export interface ContainerSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

const props = defineProps<ContainerProps>()
defineSlots<ContainerSlots>()
</script>

<template>
  <Primitive :as="as" :class="container({ class: props.class })">
    <slot />
  </Primitive>
</template>
