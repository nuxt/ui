<script lang="ts">
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
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import { useComponentUI } from '../composables/useComponentUI'

const props = defineProps<ContainerProps>()
defineSlots<ContainerSlots>()

const appConfig = useAppConfig() as Container['AppConfig']
const uiProp = useComponentUI('container', props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.container || {}) }))
</script>

<template>
  <Primitive :as="as" :class="ui({ class: [uiProp?.base, props.class] })">
    <slot />
  </Primitive>
</template>
