<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/kbd'
import type { ComponentConfig } from '../../types/tv'

type ProseKbd = ComponentConfig<typeof theme, AppConfig, 'kbd', 'ui.prose'>

export interface ProseKbdProps {
  value: string
  class?: any
  ui?: { base?: any }
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../../composables/useComponentUI'
import { tv } from '../../utils/tv'
import UKbd from '../Kbd.vue'

const props = defineProps<ProseKbdProps>()

const appConfig = useAppConfig() as ProseKbd['AppConfig']
const uiProp = useComponentUI('prose.kbd', props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.kbd || {}) }))
</script>

<template>
  <UKbd :value="value" :class="ui({ class: [uiProp?.base, props.class] })" />
</template>
