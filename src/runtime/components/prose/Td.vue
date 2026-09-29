<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '../../theme/prose/td'

type ProseTd = ComponentConfig<typeof theme, AppConfig, 'td', 'ui.prose'>

export interface ProseTdProps {
  align?: 'left' | 'center' | 'right'
  class?: any
  ui?: ProseTd['slots']
}

export interface ProseTdSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseTdProps>()

defineSlots<ProseTdSlots>()

const props = useComponentProps('prose.td', _props, theme)

const appConfig = useThemeConfig() as ProseTd['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.prose?.td)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({ align: props.align }))
</script>

<template>
  <td :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot />
  </td>
</template>
