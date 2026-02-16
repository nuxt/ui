<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/ol'

type ProseOl = ComponentConfig<typeof theme, AppConfig, 'ol', 'ui.prose'>

export interface ProseOlProps {
  class?: any
  ui?: { base?: any }
}

export interface ProseOlSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../../composables/useComponentUI'
import { tv } from '../../utils/tv'

const props = defineProps<ProseOlProps>()
defineSlots<ProseOlSlots>()

const appConfig = useAppConfig() as ProseOl['AppConfig']
const uiProp = useComponentUI('prose.ol', props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.ol || {}) }))
</script>

<template>
  <ol :class="ui({ class: [uiProp?.base, props.class] })">
    <slot />
  </ol>
</template>
