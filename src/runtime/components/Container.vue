<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '../theme/container'
import type { ComponentConfig } from '../types/tv'

type Container = ComponentConfig<typeof theme, AppConfig, 'container'>

export interface ContainerProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
  ui?: Container['slots']
}

export interface ContainerSlots {
  default?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { tv } from '../utils/tv'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../composables/useComponentProps'

const _props = defineProps<ContainerProps>()

defineSlots<ContainerSlots>()

const props = useComponentProps('container', _props, theme)

const appConfig = useThemeConfig() as Container['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.container)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())
</script>

<template>
  <Primitive :as="props.as" data-slot="container" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot />
  </Primitive>
</template>
