<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { AccordionRootProps, AccordionRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/accordion'
import type { IconProps } from '../types'
import type { DynamicSlots, GetItemKeys } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type Accordion = ComponentConfig<typeof theme, AppConfig, 'accordion'>

export interface AccordionItem {
  label?: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /**
   * @IconifyIcon
   */
  trailingIcon?: IconProps['name']
  slot?: string
  content?: string
  /** A unique value for the accordion item. Defaults to the index. */
  value?: string
  disabled?: boolean
  class?: any
  ui?: Pick<Accordion['slots'], 'item' | 'header' | 'trigger' | 'leadingIcon' | 'label' | 'trailingIcon' | 'content' | 'body'>
  [key: string]: any
}

export interface AccordionProps<T extends AccordionItem = AccordionItem> extends Pick<AccordionRootProps, 'collapsible' | 'defaultValue' | 'modelValue' | 'type' | 'disabled' | 'unmountOnHide'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  items?: T[]
  /**
   * The icon displayed on the right side of the trigger.
   * @defaultValue appConfig.ui.icons.chevronDown
   * @IconifyIcon
   */
  trailingIcon?: IconProps['name']
  /**
   * The key used to get the value from the item.
   * @defaultValue 'value'
   */
  valueKey?: GetItemKeys<T>
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: GetItemKeys<T>
  class?: any
  ui?: Accordion['slots']
}

export interface AccordionEmits extends AccordionRootEmits {}

type SlotProps<T extends AccordionItem> = (props: { item: T, index: number, open: boolean, ui: Accordion['ui'] }) => any

export type AccordionSlots<T extends AccordionItem = AccordionItem> = {
  leading: SlotProps<T>
  default(props: { item: T, index: number, open: boolean }): any
  trailing: SlotProps<T>
  content: SlotProps<T>
  body: SlotProps<T>
} & DynamicSlots<T, 'body', { index: number, open: boolean, ui: Accordion['ui'] }>

</script>

<script setup lang="ts" generic="T extends AccordionItem">
import { computed } from 'vue'
import { AccordionRoot, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { get } from '../utils'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'

const props = withDefaults(defineProps<AccordionProps<T>>(), {
  type: 'single',
  collapsible: true,
  unmountOnHide: true,
  valueKey: 'value',
  labelKey: 'label'
})
const emits = defineEmits<AccordionEmits>()
const slots = defineSlots<AccordionSlots<T>>()

const appConfig = useAppConfig() as Accordion['AppConfig']
const uiProp = useComponentUI('accordion', props)

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'collapsible', 'defaultValue', 'disabled', 'modelValue', 'unmountOnHide'), emits)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.accordion || {}) })({
  disabled: props.disabled
}))
</script>

<template>
  <AccordionRoot v-bind="rootProps" :type="type" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <AccordionItem
      v-for="(item, index) in props.items"
      v-slot="{ open }"
      :key="index"
      :value="get(item, props.valueKey as string) ?? String(index)"
      :disabled="item.disabled"
      data-slot="item"
      :class="ui.item({ class: [uiProp?.item, item.ui?.item, item.class] })"
    >
      <AccordionHeader as="div" data-slot="header" :class="ui.header({ class: [uiProp?.header, item.ui?.header] })">
        <AccordionTrigger data-slot="trigger" :class="ui.trigger({ class: [uiProp?.trigger, item.ui?.trigger], disabled: item.disabled })">
          <slot name="leading" :item="item" :index="index" :open="open" :ui="ui">
            <UIcon v-if="item.icon" :name="item.icon" data-slot="leadingIcon" :class="ui.leadingIcon({ class: [uiProp?.leadingIcon, item?.ui?.leadingIcon] })" />
          </slot>

          <span v-if="get(item, props.labelKey as string) || !!slots.default" data-slot="label" :class="ui.label({ class: [uiProp?.label, item.ui?.label] })">
            <slot :item="item" :index="index" :open="open">{{ get(item, props.labelKey as string) }}</slot>
          </span>

          <slot name="trailing" :item="item" :index="index" :open="open" :ui="ui">
            <UIcon :name="item.trailingIcon || trailingIcon || appConfig.ui.icons.chevronDown" data-slot="trailingIcon" :class="ui.trailingIcon({ class: [uiProp?.trailingIcon, item.ui?.trailingIcon] })" />
          </slot>
        </AccordionTrigger>
      </AccordionHeader>

      <AccordionContent v-if="item.content || !!slots.content || (item.slot && !!slots[item.slot as keyof AccordionSlots<T>]) || !!slots.body || (item.slot && !!slots[`${item.slot}-body` as keyof AccordionSlots<T>])" data-slot="content" :class="ui.content({ class: [uiProp?.content, item.ui?.content] })">
        <slot :name="((item.slot || 'content') as keyof AccordionSlots<T>)" :item="(item as Extract<T, { slot: string; }>)" :index="index" :open="open" :ui="ui">
          <div data-slot="body" :class="ui.body({ class: [uiProp?.body, item.ui?.body] })">
            <slot :name="((item.slot ? `${item.slot}-body`: 'body') as keyof AccordionSlots<T>)" :item="(item as Extract<T, { slot: string; }>)" :index="index" :open="open" :ui="ui">
              {{ item.content }}
            </slot>
          </div>
        </slot>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
