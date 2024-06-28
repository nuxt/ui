<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { TabsRootProps, TabsRootEmits, TabsContentProps, TabsTriggerProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/tabs'
import type { AvatarProps } from '../types'
import type { DynamicSlots } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { tabs: Partial<typeof theme> } }

const tabs = tv({ extend: tv(theme), ...(appConfig.ui?.tabs || {}) })

export interface TabsItem extends Partial<Pick<TabsTriggerProps, 'disabled' | 'value'>> {
  label?: string
  icon?: string
  avatar?: AvatarProps
  slot?: string
  content?: string
}

type TabsVariants = VariantProps<typeof tabs>

export interface TabsProps<T> extends Pick<TabsRootProps, 'defaultValue' | 'modelValue' | 'activationMode'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  items?: T[]
  color?: TabsVariants['color']
  variant?: TabsVariants['variant']
  size?: TabsVariants['size']
  /**
   * The orientation of the tabs.
   * @defaultValue 'horizontal'
   */
  orientation?: TabsRootProps['orientation']
  /**
   * The content of the tabs, can be disabled to prevent rendering the content.
   * @defaultValue true
   */
  content?: boolean | Omit<TabsContentProps, 'as' | 'asChild' | 'value'>
  class?: any
  ui?: Partial<typeof tabs.slots>
}

export interface TabsEmits extends TabsRootEmits {}

type SlotProps<T> = (props: { item: T, index: number }) => any

export type TabsSlots<T extends { slot?: string }> = {
  leading: SlotProps<T>
  default: SlotProps<T>
  trailing: SlotProps<T>
  content: SlotProps<T>
} & DynamicSlots<T, SlotProps<T>>
</script>

<script setup lang="ts" generic="T extends TabsItem">
import { computed, toRef } from 'vue'
import { defu } from 'defu'
import { TabsRoot, TabsList, TabsIndicator, TabsTrigger, TabsContent, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'

const props = withDefaults(defineProps<TabsProps<T>>(), {
  content: true,
  defaultValue: '0',
  orientation: 'horizontal'
})
const emits = defineEmits<TabsEmits>()
const slots = defineSlots<TabsSlots<T>>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'defaultValue', 'orientation', 'activationMode', 'modelValue'), emits)
const contentProps = toRef(() => defu(props.content || {}, { forceMount: true }) as TabsContentProps)

const ui = computed(() => tv({ extend: tabs, slots: props.ui })({
  color: props.color,
  variant: props.variant,
  size: props.size,
  orientation: props.orientation
}))
</script>

<template>
  <TabsRoot v-bind="rootProps" :class="ui.root({ class: props.class })">
    <TabsList :class="ui.list()">
      <TabsIndicator :class="ui.indicator()" />

      <TabsTrigger v-for="(item, index) of items" :key="index" :value="item.value || String(index)" :disabled="item.disabled" :class="ui.trigger()">
        <slot name="leading" :item="item" :index="index">
          <UAvatar v-if="item.avatar" :size="(ui.leadingAvatarSize() as any)" v-bind="item.avatar" :class="ui.leadingAvatar()" />
          <UIcon v-else-if="item.icon" :name="item.icon" :class="ui.leadingIcon()" />
        </slot>

        <span v-if="item.label || !!slots.default" :class="ui.label()">
          <slot :item="item" :index="index">{{ item.label }}</slot>
        </span>

        <slot name="trailing" :item="item" :index="index" />
      </TabsTrigger>
    </TabsList>

    <template v-if="!!content">
      <TabsContent v-for="(item, index) of items" :key="index" v-bind="contentProps" :value="item.value || String(index)" :class="ui.content()">
        <slot :name="item.slot || 'content'" :item="item" :index="index">
          {{ item.content }}
        </slot>
      </TabsContent>
    </template>
  </TabsRoot>
</template>
