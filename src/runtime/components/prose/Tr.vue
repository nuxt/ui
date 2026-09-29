<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '../../theme/prose/tr'

type ProseTr = ComponentConfig<typeof theme, AppConfig, 'tr', 'ui.prose'>

export interface ProseTrProps {
  class?: any
  ui?: ProseTr['slots']
}

export interface ProseTrSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseTrProps>()

defineSlots<ProseTrSlots>()

const props = useComponentProps('prose.tr', _props, theme)

const appConfig = useThemeConfig() as ProseTr['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.prose?.tr)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())
</script>

<template>
  <tr :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot />
  </tr>
</template>
