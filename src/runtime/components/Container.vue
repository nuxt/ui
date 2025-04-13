<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/container'
import type { ComponentConfig } from '../types/utils'

type Container = ComponentConfig<typeof theme, AppConfig, 'container'>

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
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = defineProps<ContainerProps>()
defineSlots<ContainerSlots>()

const appConfig = useAppConfig() as Container['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.container || {}) }))
</script>

<template>
  <Primitive :as="as" :class="ui({ class: props.class })">
    <slot />
  </Primitive>
</template>
