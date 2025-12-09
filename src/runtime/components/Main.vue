<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/main'
import type { ComponentConfig } from '../types/tv'

type Main = ComponentConfig<typeof theme, AppConfig, 'main'>

export interface MainProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
}

export interface MainSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = defineProps<MainProps>()
defineSlots<MainSlots>()

const appConfig = useAppConfig() as Main['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.main || {}) }))
</script>

<template>
  <Primitive :as="as" :class="ui({ class: props.class })">
    <slot />
  </Primitive>
</template>
