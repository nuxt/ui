<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/page-body'
import type { ComponentConfig } from '../types/tv'

type PageBody = ComponentConfig<typeof theme, AppConfig, 'pageBody'>

export interface PageBodyProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
  ui?: { base?: any }
}

export interface PageBodySlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import { useComponentUI } from '../composables/useComponentUI'

const props = defineProps<PageBodyProps>()
defineSlots<PageBodySlots>()

const appConfig = useAppConfig() as PageBody['AppConfig']
const uiProp = useComponentUI('pageBody', props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.pageBody || {}) }))
</script>

<template>
  <Primitive :as="as" :class="ui({ class: [uiProp?.base, props.class] })">
    <slot />
  </Primitive>
</template>
