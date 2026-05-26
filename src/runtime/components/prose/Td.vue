<script lang="ts">
import type { VNode } from 'vue'
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
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseTdProps>()

defineSlots<ProseTdSlots>()

const props = useComponentProps('prose.td', _props)

const appConfig = useAppConfig() as ProseTd['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.td || {}) }))
</script>

<template>
  <td :class="ui({ align: props.align, class: [props.ui?.base, props.class] })">
    <slot />
  </td>
</template>
