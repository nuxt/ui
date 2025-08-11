<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/a'
import type { ComponentConfig } from '../../types/tv'

type ProseA = ComponentConfig<typeof theme, AppConfig, 'a', 'ui.prose'>

export interface ProseAProps {
  href?: string
  target?: '_blank' | '_parent' | '_self' | '_top' | (string & object) | null | undefined
  class?: any
}

export interface ProseASlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'
import ULink from '../Link.vue'

const appConfig = useAppConfig() as ProseA['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.a || {}) }))

const props = defineProps<ProseAProps>()
defineSlots<ProseASlots>()
</script>

<template>
  <ULink :href="href" :target="target" :class="ui({ class: props.class })" raw>
    <slot />
  </ULink>
</template>
