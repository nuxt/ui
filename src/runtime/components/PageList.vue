<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/page-list'
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
  ui?: { base?: any }
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
import { useComponentProps } from '../composables/useComponentProps'

const _props = withDefaults(defineProps<PageListProps>(), {
  divide: false
})
defineSlots<PageListSlots>()

const props = useComponentProps('pageList', _props)

const appConfig = useAppConfig() as PageList['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.pageList || {}) }))
</script>

<template>
  <Primitive :as="props.as" role="list" :class="ui({ class: [props.ui?.base, props.class], divide: props.divide })">
    <slot />
  </Primitive>
</template>
