<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '../../theme/prose/em'

type ProseEm = ComponentConfig<typeof theme, AppConfig, 'em', 'ui.prose'>

export interface ProseEmProps {
  class?: string
  ui?: ProseEm['slots']
}

export interface ProseEmSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useComponentProps, useComponentOverrides } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseEmProps>()

defineSlots<ProseEmSlots>()

const props = useComponentProps('prose.em', _props, theme)

const overrides = useComponentOverrides((ui: ProseEm['AppConfig']['ui']) => ui.prose?.em)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())
</script>

<template>
  <em :class="ui.base({ class: [props.ui?.base, props.class] })"><slot /></em>
</template>
