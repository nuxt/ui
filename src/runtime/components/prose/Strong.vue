<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/strong'

type ProseStrong = ComponentConfig<typeof theme, AppConfig, 'strong', 'ui.prose'>

export interface ProseStrongProps {
  class?: any
  ui?: { base?: any }
}

export interface ProseStrongSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../../composables/useComponentUI'
import { tv } from '../../utils/tv'

const props = defineProps<ProseStrongProps>()
defineSlots<ProseStrongSlots>()

const appConfig = useAppConfig() as ProseStrong['AppConfig']
const uiProp = useComponentUI('prose.strong', props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.strong || {}) }))
</script>

<template>
  <strong :class="ui({ class: [uiProp?.base, props.class] })">
    <slot />
  </strong>
</template>
