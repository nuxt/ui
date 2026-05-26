<script lang="ts">
import type { VNode } from 'vue'
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
  default?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import { useComponentProps } from '../composables/useComponentProps'

const _props = defineProps<PageBodyProps>()

defineSlots<PageBodySlots>()

const props = useComponentProps('pageBody', _props)

const appConfig = useAppConfig() as PageBody['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.pageBody || {}) }))
</script>

<template>
  <Primitive :as="props.as" :class="ui({ class: [props.ui?.base, props.class] })">
    <slot />
  </Primitive>
</template>
