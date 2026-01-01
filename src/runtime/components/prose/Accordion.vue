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
import { computed, ref, onBeforeUpdate } from 'vue'
import { useAppConfig } from '#imports'
import { transformUI } from '../../utils'
import { tv } from '../../utils/tv'
import UAccordion from '../Accordion.vue'

const props = withDefaults(defineProps<ProseAccordionProps>(), {
  type: 'multiple'
})
const slots = defineSlots<ProseAccordionSlots>()

const appConfig = useAppConfig() as ProseAccordion['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.accordion || {}) }))

const rerenderCount = ref(1)

const items = computed<{
  index: number
  label: string
  icon: string
  component: any
}[]>(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  rerenderCount.value
  return slots.default?.()?.flatMap(transformSlot).filter(Boolean) || []
})

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

onBeforeUpdate(() => rerenderCount.value++)
</script>

<template>
  <UAccordion :type="type" :items="items" :unmount-on-hide="false" :class="props.class" :ui="transformUI(ui(), props.ui)">
    <template #content="{ item }">
      <component :is="item.component" />
    </template>
  </UAccordion>
</template>
