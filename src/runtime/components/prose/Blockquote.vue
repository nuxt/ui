<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/blockquote'

type ProseBlockquote = ComponentConfig<typeof theme, AppConfig, 'blockquote', 'ui.prose'>

export interface ProseBlockquoteProps {
  class?: any
  ui?: { base?: any }
}

export interface ProseBlockquoteSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../../composables/useComponentUI'
import { tv } from '../../utils/tv'

const props = defineProps<ProseBlockquoteProps>()
defineSlots<ProseBlockquoteSlots>()

const appConfig = useAppConfig() as ProseBlockquote['AppConfig']
const uiProp = useComponentUI('prose.blockquote', props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.blockquote || {}) }))
</script>

<template>
  <blockquote :class="ui({ class: [uiProp?.base, props.class] })">
    <slot />
  </blockquote>
</template>
