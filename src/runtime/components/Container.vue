<script lang="ts">
import { tv } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/container'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'

const appConfig = _appConfig as AppConfig & { ui: { container: Partial<typeof theme> } }

const container = tv({ extend: tv(theme), ...(appConfig.ui?.container || {}) })

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

extendDevtoolsMeta({ example: 'ContainerExample' })
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
