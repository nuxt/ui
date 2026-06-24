<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/p'

type ProseP = ComponentConfig<typeof theme, AppConfig, 'p', 'ui.prose'>

export interface ProsePProps {
  class?: any
  ui?: { base?: any }
}

export interface ProsePSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProsePProps>()

defineSlots<ProsePSlots>()

const props = useComponentProps('prose.p', _props)

const appConfig = useAppConfig() as ProseP['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.p || {}) }))
</script>

<template>
  <p :class="ui({ class: [props.ui?.base, props.class] })">
    <slot />
  </p>
</template>
