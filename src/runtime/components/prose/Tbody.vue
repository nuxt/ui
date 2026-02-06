<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/tbody'

type ProseTbody = ComponentConfig<typeof theme, AppConfig, 'tbody', 'ui.prose'>

export interface ProseTbodyProps {
  class?: any
  ui?: { base?: any }
}

export interface ProseTbodySlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../../composables/useComponentUI'
import { tv } from '../../utils/tv'

const props = defineProps<ProseTbodyProps>()
defineSlots<ProseTbodySlots>()

const appConfig = useAppConfig() as ProseTbody['AppConfig']
const uiProp = useComponentUI('prose.tbody', props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.tbody || {}) }))
</script>

<template>
  <tbody :class="ui({ class: [uiProp?.base, props.class] })">
    <slot />
  </tbody>
</template>
