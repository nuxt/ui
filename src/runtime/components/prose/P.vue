<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/p'

type ProseP = ComponentConfig<typeof theme, AppConfig, 'p', 'ui.prose'>

export interface ProsePProps {
  class?: any
  ui?: { base?: any }
}

export interface ProsePSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../../composables/useComponentUI'
import { tv } from '../../utils/tv'

const props = defineProps<ProsePProps>()
defineSlots<ProsePSlots>()

const appConfig = useAppConfig() as ProseP['AppConfig']
const uiProp = useComponentUI('prose.p', props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.p || {}) }))
</script>

<template>
  <p :class="ui({ class: [uiProp?.base, props.class] })">
    <slot />
  </p>
</template>
