<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '../theme/page-grid'
import type { ComponentConfig } from '../types/tv'

type PageGrid = ComponentConfig<typeof theme, AppConfig, 'pageGrid'>

export interface PageGridProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
  ui?: PageGrid['slots']
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
import { useComponentProps, useComponentOverrides } from '../composables/useComponentProps'

const _props = defineProps<PageGridProps>()

defineSlots<PageGridSlots>()

const props = useComponentProps('pageGrid', _props, theme)

const appConfig = useAppConfig() as PageGrid['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.pageGrid)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())
</script>

<template>
  <Primitive :as="props.as" data-slot="page-grid" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot />
  </Primitive>
</template>
