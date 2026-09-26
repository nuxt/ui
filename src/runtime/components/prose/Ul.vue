<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '../../theme/prose/ul'

type ProseUl = ComponentConfig<typeof theme, AppConfig, 'ul', 'ui.prose'>

export interface ProseUlProps {
  class?: any
  ui?: ProseUl['slots']
}

export interface ProseUlSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseUlProps>()

defineSlots<ProseUlSlots>()

const props = useComponentProps('prose.ul', _props, theme)

const appConfig = useThemeConfig() as ProseUl['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.prose?.ul)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())
</script>

<template>
  <ul :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot />
  </ul>
</template>
