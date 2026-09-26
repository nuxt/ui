<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '../../theme/prose/table'

type ProseTable = ComponentConfig<typeof theme, AppConfig, 'table', 'ui.prose'>

export interface ProseTableProps {
  class?: any
  ui?: ProseTable['slots']
}

export interface ProseTableSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseTableProps>()

defineSlots<ProseTableSlots>()

const props = useComponentProps('prose.table', _props, theme)

const appConfig = useThemeConfig() as ProseTable['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.prose?.table)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())
</script>

<template>
  <div :class="ui.root({ class: [props.ui?.root, props.class] })">
    <table :class="ui.base({ class: props.ui?.base })">
      <slot />
    </table>
  </div>
</template>
