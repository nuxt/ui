<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/tr'

type ProseTr = ComponentConfig<typeof theme, AppConfig, 'tr', 'ui.prose'>

export interface ProseTrProps {
  class?: any
  ui?: { base?: any }
}

export interface ProseTrSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseTrProps>()

defineSlots<ProseTrSlots>()

const props = useComponentProps('prose.tr', _props)

const appConfig = useAppConfig() as ProseTr['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.tr || {}) }))
</script>

<template>
  <tr :class="ui({ class: [props.ui?.base, props.class] })">
    <slot />
  </tr>
</template>
