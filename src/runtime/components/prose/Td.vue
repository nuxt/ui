<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/td'

type ProseTd = ComponentConfig<typeof theme, AppConfig, 'td', 'ui.prose'>

export interface ProseTdProps {
  align?: 'left' | 'center' | 'right'
  class?: any
  ui?: { base?: any }
}

export interface ProseTdSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../../composables/useComponentUI'
import { tv } from '../../utils/tv'

const props = defineProps<ProseTdProps>()
defineSlots<ProseTdSlots>()

const appConfig = useAppConfig() as ProseTd['AppConfig']
const uiProp = useComponentUI('prose.td', props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.td || {}) }))
</script>

<template>
  <td :class="ui({ align: props.align, class: [uiProp?.base, props.class] })">
    <slot />
  </td>
</template>
