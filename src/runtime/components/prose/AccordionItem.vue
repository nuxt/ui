<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '../../theme/prose/accordion-item'

type ProseAccordionItem = ComponentConfig<typeof theme, AppConfig, 'accordionItem', 'ui.prose'>

export interface ProseAccordionItemProps {
  label: string
  description?: string
  class?: any
  ui?: ProseAccordionItem['slots']
}

export interface ProseAccordionItemSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps, useComponentOverrides } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseAccordionItemProps>()

defineSlots<ProseAccordionItemSlots>()

const props = useComponentProps('prose.accordionItem', _props, theme)

const appConfig = useAppConfig() as ProseAccordionItem['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.prose?.accordionItem)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())
</script>

<template>
  <div :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot>
      {{ props.description }}
    </slot>
  </div>
</template>
