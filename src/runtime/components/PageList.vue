<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '../theme/page-list'
import type { ComponentConfig } from '../types/tv'

type PageList = ComponentConfig<typeof theme, AppConfig, 'pageList'>

export interface PageListProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  divide?: boolean
  class?: any
  ui?: PageList['slots']
}

export interface PageListSlots {
  default?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import { useComponentProps, useComponentOverrides } from '../composables/useComponentProps'

const _props = withDefaults(defineProps<PageListProps>(), {
  divide: false
})
defineSlots<PageListSlots>()

const props = useComponentProps('pageList', _props, theme)

const appConfig = useAppConfig() as PageList['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.pageList)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({ divide: props.divide }))
</script>

<template>
  <Primitive :as="props.as" role="list" data-slot="page-list" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot />
  </Primitive>
</template>
