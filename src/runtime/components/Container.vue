<script lang="ts">
import { tv } from 'tailwind-variants'
import type { PrimitiveProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/container'

const appConfig = _appConfig as AppConfig & { ui: { container: Partial<typeof theme> } }

const container = tv({ extend: tv(theme), ...(appConfig.ui?.container || {}) })

export interface ContainerProps extends Omit<PrimitiveProps, 'asChild'> {
  class?: any
}

export interface ContainerSlots {
  default(props?: any): any
}
</script>

<script setup lang="ts">
import { Primitive } from 'radix-vue'

const props = withDefaults(defineProps<ContainerProps>(), { as: 'div' })
defineSlots<ContainerSlots>()
</script>

<template>
  <Primitive :as="as" :class="container({ class: props.class })">
    <slot />
  </Primitive>
</template>
