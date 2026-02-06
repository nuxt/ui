<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/accordion-item'

type ProseAccordionItem = ComponentConfig<typeof theme, AppConfig, 'accordionItem', 'ui.prose'>

export interface ProseAccordionItemProps {
  label: string
  description?: string
  class?: any
  ui?: { base?: any }
}

export interface ProseAccordionItemSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../../composables/useComponentUI'
import { tv } from '../../utils/tv'

const props = defineProps<ProseAccordionItemProps>()
defineSlots<ProseAccordionItemSlots>()

const appConfig = useAppConfig() as ProseAccordionItem['AppConfig']
const uiProp = useComponentUI('prose.accordionItem', props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.accordionItem || {}) }))
</script>

<template>
  <div :class="ui({ class: [uiProp?.base, props.class] })">
    <slot>
      {{ description }}
    </slot>
  </div>
</template>
