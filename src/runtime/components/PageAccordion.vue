<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/page-accordion'
import type { AccordionProps, AccordionSlots, AccordionItem } from '../types'
import type { ComponentConfig } from '../types/tv'

type PageAccordion = ComponentConfig<typeof theme, AppConfig, 'pageAccordion'>

export interface PageAccordionProps<T extends AccordionItem = AccordionItem> extends /** @vue-ignore */ Omit<AccordionProps<T>, 'type'> {
  type?: AccordionProps<T>['type']
  class?: any
  ui?: PageAccordion['slots'] & AccordionProps['ui']
}

type PageAccordionSlotItem<T extends AccordionItem> = { item: Extract<T, { slot: string }> } & { index: number, open: boolean }

export type PageAccordionSlots<T extends AccordionItem = AccordionItem> = AccordionSlots<T>

</script>

<script setup lang="ts" generic="T extends AccordionItem">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { omit, transformUI } from '../utils'
import { tv } from '../utils/tv'
import UAccordion from './Accordion.vue'

const props = withDefaults(defineProps<PageAccordionProps<T>>(), {
  type: 'multiple'
})
const slots = defineSlots<PageAccordionSlots<T>>()

const appConfig = useAppConfig() as PageAccordion['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.pageAccordion || {}) })())
</script>

<template>
  <UAccordion :type="type" :unmount-on-hide="false" :class="ui.base({ class: [props.ui?.base, props.class] })" :ui="transformUI(omit(ui, ['base']), props.ui)">
    <template v-for="(_, name) in slots" #[name]="slotData">
      <slot :name="name" v-bind="(slotData as PageAccordionSlotItem<T>)" />
    </template>
  </UAccordion>
</template>
