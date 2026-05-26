<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/page-grid'
import type { ComponentConfig } from '../types/tv'

type PageGrid = ComponentConfig<typeof theme, AppConfig, 'pageGrid'>

export interface PageGridProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
  ui?: { base?: any }
}

export interface PageGridSlots {
  default?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import { useComponentProps } from '../composables/useComponentProps'

const _props = defineProps<PageGridProps>()

defineSlots<PageGridSlots>()

const props = useComponentProps('pageGrid', _props)

const appConfig = useAppConfig() as PageGrid['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.pageGrid || {}) }))
</script>

<template>
  <Primitive :as="props.as" :class="ui({ class: [props.ui?.base, props.class] })">
    <slot />
  </Primitive>
</template>
