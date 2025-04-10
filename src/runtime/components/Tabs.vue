<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { TabsRootProps, TabsRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/tabs'
import { tv } from '../utils/tv'
import type { AvatarProps } from '../types'
import type { DynamicSlots, PartialString } from '../types/utils'

const appConfigTabs = _appConfig as AppConfig & { ui: { tabs: Partial<typeof theme> } }

const tabs = tv({ extend: tv(theme), ...(appConfigTabs.ui?.tabs || {}) })

export interface TabsItem {
  label?: string
  /**
   * @IconifyIcon
   */
  icon?: string
  avatar?: AvatarProps
  slot?: string
  content?: string
  /** A unique value for the tab item. Defaults to the index. */
  value?: string | number
  disabled?: boolean
  [key: string]: any
}

type TabsVariants = VariantProps<typeof tabs>

export interface TabsProps<T extends TabsItem = TabsItem> extends Pick<TabsRootProps<string | number>, 'defaultValue' | 'modelValue' | 'activationMode' | 'unmountOnHide'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  items?: T[]
  /**
   * @defaultValue 'primary'
   */
  color?: TabsVariants['color']
  /**
   * @defaultValue 'pill'
   */
  variant?: TabsVariants['variant']
  /**
   * @defaultValue 'md'
   */
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
  content?: boolean
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: string
  class?: any
  ui?: PartialString<typeof tabs.slots>
}

export interface TabsEmits extends TabsRootEmits<string | number> {}

type SlotProps<T extends TabsItem> = (props: { item: T, index: number }) => any

export type TabsSlots<T extends TabsItem = TabsItem> = {
  leading: SlotProps<T>
  default: SlotProps<T>
  trailing: SlotProps<T>
  content: SlotProps<T>
} & DynamicSlots<T, undefined, { index: number }>

</script>

<script setup lang="ts" generic="T extends TabsItem">
import { computed } from 'vue'
import { TabsRoot, TabsList, TabsIndicator, TabsTrigger, TabsContent, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { get } from '../utils'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

const props = withDefaults(defineProps<TabsProps<T>>(), {
  content: true,
  defaultValue: '0',
  orientation: 'horizontal',
  unmountOnHide: true,
  labelKey: 'label'
})
const emits = defineEmits<TabsEmits>()
const slots = defineSlots<TabsSlots<T>>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'modelValue', 'defaultValue', 'orientation', 'activationMode', 'unmountOnHide'), emits)

const ui = computed(() => tabs({
  color: props.color,
  variant: props.variant,
  size: props.size,
  orientation: props.orientation
}))
</script>

<template>
  <TabsRoot v-bind="rootProps" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <TabsList :class="ui.list({ class: props.ui?.list })">
      <TabsIndicator :class="ui.indicator({ class: props.ui?.indicator })" />

      <TabsTrigger v-for="(item, index) of items" :key="index" :value="item.value || String(index)" :disabled="item.disabled" :class="ui.trigger({ class: props.ui?.trigger })">
        <slot name="leading" :item="item" :index="index">
          <UIcon v-if="item.icon" :name="item.icon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
          <UAvatar v-else-if="item.avatar" :size="((props.ui?.leadingAvatarSize || ui.leadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar })" />
        </slot>

        <span v-if="get(item, props.labelKey as string) || !!slots.default" :class="ui.label({ class: props.ui?.label })">
          <slot :item="item" :index="index">{{ get(item, props.labelKey as string) }}</slot>
        </span>

        <slot name="trailing" :item="item" :index="index" />
      </TabsTrigger>
    </TabsList>

    <template v-if="!!content">
      <TabsContent v-for="(item, index) of items" :key="index" :value="item.value || String(index)" :class="ui.content({ class: props.ui?.content })">
        <slot :name="((item.slot || 'content') as keyof TabsSlots<T>)" :item="(item as Extract<T, { slot: string; }>)" :index="index">
          {{ item.content }}
        </slot>
      </TabsContent>
    </template>
  </TabsRoot>
</template>
