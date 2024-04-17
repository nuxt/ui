<script lang="ts">
import { tv } from 'tailwind-variants'
import type { AccordionRootProps, AccordionRootEmits, AccordionContentProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/accordion'
import type { IconProps } from '#ui/types'

const appConfig = _appConfig as AppConfig & { ui: { accordion: Partial<typeof theme> } }

const accordion = tv({ extend: tv(theme), ...(appConfig.ui?.accordion || {}) })

export interface AccordionItem {
  label?: string
  icon?: IconProps['name']
  slot?: string
  value?: string
  content?: string
  disabled?: boolean
}

export interface AccordionProps<T> extends Omit<AccordionRootProps, 'asChild' | 'dir' | 'orientation'> {
  items?: T[]
  content?: Omit<AccordionContentProps, 'asChild'>
  class?: any
  ui?: Partial<typeof accordion.slots>
}

export interface AccordionEmits extends AccordionRootEmits {}

type SlotProps<T> = (props: { item: T, index: number }) => any

export type AccordionSlots<T> = {
  default: SlotProps<T>
  leading: SlotProps<T>
  label: SlotProps<T>
  trailing: SlotProps<T>
  content: SlotProps<T>
  [key: string]: SlotProps<T>
}
</script>

<script setup lang="ts" generic="T extends AccordionItem">
import { computed, toRef } from 'vue'
import { AccordionRoot, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'

const props = withDefaults(defineProps<AccordionProps<T>>(), {
  type: 'single',
  collapsible: true
})
const emits = defineEmits<AccordionEmits>()
defineSlots<AccordionSlots<T>>()

const appConfig = useAppConfig()
const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'collapsible', 'defaultValue', 'disabled', 'modelValue', 'type'), emits)
const contentProps = toRef(() => props.content)

const ui = computed(() => tv({ extend: accordion, slots: props.ui })({ disabled: props.disabled }))
</script>

<template>
  <AccordionRoot v-bind="rootProps" :class="ui.root({ class: props.class })">
    <AccordionItem v-for="(item, index) in items" :key="index" :value="item.value || String(index)" :disabled="item.disabled" :class="ui.item()">
      <AccordionHeader :class="ui.header()">
        <AccordionTrigger :class="ui.trigger({ disabled: item.disabled })">
          <slot :item="item" :index="index">
            <slot name="leading" :item="item" :index="index">
              <UIcon v-if="item.icon" :name="item.icon" :class="ui.leadingIcon()" />
            </slot>

            <span v-if="item.label || $slots.label" :class="ui.label()">
              <slot name="label" :item="item" :index="index">{{ item.label }}</slot>
            </span>

            <slot name="trailing" :item="item" :index="index">
              <UIcon :name="appConfig.ui.icons.chevronDown" :class="ui.trailingIcon()" />
            </slot>
          </slot>
        </AccordionTrigger>
      </AccordionHeader>

      <AccordionContent v-if="item.content || $slots.content || (item.slot && $slots[item.slot])" v-bind="contentProps" :class="ui.content()">
        <slot :name="item.slot || 'content'" :item="item" :index="index">
          {{ item.content }}
        </slot>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
