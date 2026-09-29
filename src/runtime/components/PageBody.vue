<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '../theme/page-body'
import type { ComponentConfig } from '../types/tv'

type PageBody = ComponentConfig<typeof theme, AppConfig, 'pageBody'>

export interface PageBodyProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
  ui?: PageBody['slots']
}

export interface PageBodySlots {
  default?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { tv } from '../utils/tv'
import { useComponentProps, useComponentOverrides } from '../composables/useComponentProps'

const _props = defineProps<PageBodyProps>()

defineSlots<PageBodySlots>()

const props = useComponentProps('pageBody', _props, theme)

const overrides = useComponentOverrides((ui: PageBody['AppConfig']['ui']) => ui.pageBody)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())
</script>

<template>
  <Primitive :as="props.as" data-slot="page-body" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot />
  </Primitive>
</template>
