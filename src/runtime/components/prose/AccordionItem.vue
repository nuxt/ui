<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/accordion-item'

type ProseAccordionItem = ComponentConfig<typeof theme, AppConfig, 'accordionItem', 'ui.prose'>

export interface ProseAccordionItemProps {
  label: string
  description?: string
  class?: any
}

export interface ProseAccordionItemSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'

const props = defineProps<ProseAccordionItemProps>()
defineSlots<ProseAccordionItemSlots>()

const appConfig = useAppConfig() as ProseAccordionItem['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.accordionItem || {}) }))
</script>

<template>
  <div :class="ui({ class: props.class })">
    <slot>
      {{ description }}
    </slot>
  </div>
</template>
