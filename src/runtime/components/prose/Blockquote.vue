<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/blockquote'

type ProseBlockquote = ComponentConfig<typeof theme, AppConfig, 'blockquote', 'ui.prose'>

export interface ProseBlockquoteProps {
  class?: any
  ui?: ProseBlockquote['slots']
}

export interface ProseBlockquoteSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps, useComponentOverrides } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseBlockquoteProps>()

defineSlots<ProseBlockquoteSlots>()

const props = useComponentProps('prose.blockquote', _props, theme)

const appConfig = useAppConfig() as ProseBlockquote['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.prose?.blockquote)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())
</script>

<template>
  <blockquote :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot />
  </blockquote>
</template>
