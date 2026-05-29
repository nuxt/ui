<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/container'
import type { ComponentConfig } from '../types/tv'

type Container = ComponentConfig<typeof theme, AppConfig, 'container'>

export interface ContainerProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
  ui?: { base?: any }
}

export interface ContainerSlots {
  default?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import { useComponentProps } from '../composables/useComponentProps'

const _props = defineProps<ContainerProps>()

defineSlots<ContainerSlots>()

const props = useComponentProps('container', _props)

const appConfig = useAppConfig() as Container['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.container || {}) }))
</script>

<template>
  <Primitive :as="props.as" :class="ui({ class: [props.ui?.base, props.class] })">
    <slot />
  </Primitive>
</template>
