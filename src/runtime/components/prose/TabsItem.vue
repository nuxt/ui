<script lang="ts">
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
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../../composables/useComponentUI'
import { tv } from '../../utils/tv'

const props = defineProps<ProseTabsItemProps>()
defineSlots<ProseTabsItemSlots>()

const appConfig = useAppConfig() as ProseTabsItem['AppConfig']
const uiProp = useComponentUI('prose.tabsItem', props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.tabsItem || {}) }))
</script>

<template>
  <div :class="ui({ class: [uiProp?.base, props.class] })">
    <slot>
      {{ description }}
    </slot>
  </div>
</template>
