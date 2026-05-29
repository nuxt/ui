<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/kbd'
import type { ComponentConfig } from '../../types/tv'

type ProseKbd = ComponentConfig<typeof theme, AppConfig, 'kbd', 'ui.prose'>

export interface ProseKbdProps {
  value?: string
  class?: any
  ui?: { base?: any }
}

export interface ProseKbdSlots {
  default?(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'
import UKbd from '../Kbd.vue'

const _props = defineProps<ProseKbdProps>()
defineSlots<ProseKbdSlots>()

const props = useComponentProps('prose.kbd', _props)

const appConfig = useAppConfig() as ProseKbd['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.kbd || {}) }))
</script>

<template>
  <UKbd :value="props.value" :class="ui({ class: [props.ui?.base, props.class] })">
    <slot />
  </UKbd>
</template>
