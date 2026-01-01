<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/card-group'

type ProseCardGroup = ComponentConfig<typeof theme, AppConfig, 'cardGroup', 'ui.prose'>

export interface ProseCardGroupProps {
  class?: any
}

export interface ProseCardGroupSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'

const props = defineProps<ProseCardGroupProps>()
defineSlots<ProseCardGroupSlots>()

const appConfig = useAppConfig() as ProseCardGroup['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.cardGroup || {}) }))
</script>

<template>
  <div :class="ui({ class: props.class })">
    <slot />
  </div>
</template>
