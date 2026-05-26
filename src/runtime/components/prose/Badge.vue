<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/badge'
import type { ComponentConfig } from '../../types/tv'

type ProseBadge = ComponentConfig<typeof theme, AppConfig, 'badge', 'ui.prose'>

export interface ProseBadgeProps {
  class?: any
  ui?: { base?: any }
}

export interface ProseBadgeSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'
import UBadge from '../Badge.vue'

const _props = defineProps<ProseBadgeProps>()

defineSlots<ProseBadgeSlots>()

const props = useComponentProps('prose.badge', _props)

const appConfig = useAppConfig() as ProseBadge['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.badge || {}) }))
</script>

<template>
  <UBadge color="primary" variant="subtle" :class="ui({ class: [props.ui?.base, props.class] })">
    <slot mdc-unwrap="p" />
  </UBadge>
</template>
