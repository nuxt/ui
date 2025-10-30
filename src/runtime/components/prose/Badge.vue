<script lang="ts">
import type { HTMLAttributes } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/badge'
import type { ComponentConfig } from '../../types/tv'

type ProseBadge = ComponentConfig<typeof theme, AppConfig, 'badge', 'ui.prose'>

export interface ProseBadgeProps extends /** @vue-ignore */ HTMLAttributes {
  class?: any
}

export interface ProseBadgeSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'
import UBadge from '../Badge.vue'

const props = defineProps<ProseBadgeProps>()
defineSlots<ProseBadgeSlots>()

const appConfig = useAppConfig() as ProseBadge['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.badge || {}) }))
</script>

<template>
  <UBadge color="primary" variant="subtle" :class="ui({ class: props.class })">
    <slot mdc-unwrap="p" />
  </UBadge>
</template>
