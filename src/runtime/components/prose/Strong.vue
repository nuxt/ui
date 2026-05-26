<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/strong'

type ProseStrong = ComponentConfig<typeof theme, AppConfig, 'strong', 'ui.prose'>

export interface ProseStrongProps {
  class?: any
  ui?: { base?: any }
}

export interface ProseStrongSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseStrongProps>()

defineSlots<ProseStrongSlots>()

const props = useComponentProps('prose.strong', _props)

const appConfig = useAppConfig() as ProseStrong['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.strong || {}) }))
</script>

<template>
  <strong :class="ui({ class: [props.ui?.base, props.class] })">
    <slot />
  </strong>
</template>
