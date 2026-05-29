<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/tabs-item'

type ProseTabsItem = ComponentConfig<typeof theme, AppConfig, 'tabsItem', 'ui.prose'>

export interface ProseTabsItemProps {
  label: string
  description?: string
  class?: any
  ui?: { base?: any }
}

export interface ProseTabsItemSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseTabsItemProps>()

defineSlots<ProseTabsItemSlots>()

const props = useComponentProps('prose.tabsItem', _props)

const appConfig = useAppConfig() as ProseTabsItem['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.tabsItem || {}) }))
</script>

<template>
  <div :class="ui({ class: [props.ui?.base, props.class] })">
    <slot>
      {{ props.description }}
    </slot>
  </div>
</template>
