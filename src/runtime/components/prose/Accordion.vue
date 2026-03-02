<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/accordion'
import type { AccordionProps } from '../../types'
import type { ComponentConfig } from '../../types/tv'

type ProseAccordion = ComponentConfig<typeof theme, AppConfig, 'accordion', 'ui.prose'>

export interface ProseAccordionProps {
  type?: 'single' | 'multiple'
  class?: any
  ui?: ProseAccordion['slots'] & AccordionProps['ui']
}

export interface ProseAccordionSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../../composables/useComponentUI'
import { transformUI } from '../../utils'
import { tv } from '../../utils/tv'
import UAccordion from '../Accordion.vue'

const props = withDefaults(defineProps<ProseAccordionProps>(), {
  type: 'multiple'
})
const slots = defineSlots<ProseAccordionSlots>()

const appConfig = useAppConfig() as ProseAccordion['AppConfig']
const uiProp = useComponentUI('prose.accordion', props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.accordion || {}) }))

// Slot children are collected and transformed via getItems(), called from the template
// (render function). This ensures slots.default?.() is invoked during the render phase,
// avoiding: "[Vue warn]: Slot "default" invoked outside of the render function"
function getItems() {
  return slots.default?.()?.flatMap(transformSlot).filter(Boolean) || []
}

function transformSlot(slot: any, index: number) {
  if (typeof slot.type === 'symbol') {
    return slot.children?.map(transformSlot)
  }

  return {
    index,
    label: slot.props?.label || `${index}`,
    description: slot.props?.description,
    icon: slot.props?.icon,
    component: slot
  }
}
</script>

<template>
  <UAccordion :type="type" :items="getItems()" :unmount-on-hide="false" :class="props.class" :ui="transformUI(ui(), uiProp)">
    <template #content="{ item }">
      <component :is="item.component" />
    </template>
  </UAccordion>
</template>
