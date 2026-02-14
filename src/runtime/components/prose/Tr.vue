<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/tr'

type ProseTr = ComponentConfig<typeof theme, AppConfig, 'tr', 'ui.prose'>

export interface ProseTrProps {
  class?: any
  ui?: { base?: any }
}

export interface ProseTrSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../../composables/useComponentUI'
import { tv } from '../../utils/tv'

const props = defineProps<ProseTrProps>()
defineSlots<ProseTrSlots>()

const appConfig = useAppConfig() as ProseTr['AppConfig']
const uiProp = useComponentUI('prose.tr', props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.tr || {}) }))
</script>

<template>
  <tr :class="ui({ class: [uiProp?.base, props.class] })">
    <slot />
  </tr>
</template>
