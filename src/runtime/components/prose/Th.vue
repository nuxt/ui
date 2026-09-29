<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '../../theme/prose/th'

type ProseTh = ComponentConfig<typeof theme, AppConfig, 'th', 'ui.prose'>

export interface ProseThProps {
  align?: 'left' | 'center' | 'right'
  class?: any
  ui?: ProseTh['slots']
}

export interface ProseThSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseThProps>()

defineSlots<ProseThSlots>()

const props = useComponentProps('prose.th', _props, theme)

const appConfig = useThemeConfig() as ProseTh['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.prose?.th)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({ align: props.align }))
</script>

<template>
  <th :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot />
  </th>
</template>
