<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/main'
import type { ComponentConfig } from '../types/tv'

type Main = ComponentConfig<typeof theme, AppConfig, 'main'>

export interface MainProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'main'
   */
  as?: any
  class?: any
  ui?: { base?: any }
}

export interface MainSlots {
  default?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import { useComponentProps } from '../composables/useComponentProps'

const _props = withDefaults(defineProps<MainProps>(), {
  as: 'main'
})
defineSlots<MainSlots>()

const props = useComponentProps('main', _props)

const appConfig = useAppConfig() as Main['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.main || {}) }))
</script>

<template>
  <Primitive :as="props.as" :class="ui({ class: [props.ui?.base, props.class] })">
    <slot />
  </Primitive>
</template>
