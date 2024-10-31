<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { TabsRootProps, TabsRootEmits, TabsContentProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/tabs'
import type { AvatarProps } from '../types'
import type { DynamicSlotWithItems, MaybeReadonlyArray, PartialString } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { tabs: Partial<typeof theme> } }

const tabs = tv({ extend: tv(theme), ...(appConfig.ui?.tabs || {}) })

export interface TabsItem {
  label?: string
  icon?: string
  avatar?: AvatarProps
  slot?: string
  content?: string
  /** A unique value for the tab item. Defaults to the index. */
  value?: string | number
  disabled?: boolean
}

type TabsVariants = VariantProps<typeof tabs>

export interface TabsProps<I> extends Pick<TabsRootProps<string | number>, 'defaultValue' | 'modelValue' | 'activationMode'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  items?: I
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
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: string
  class?: any
  ui?: PartialString<typeof tabs.slots>
}

export interface TabsEmits extends TabsRootEmits<string | number> {}

type SlotProps<T> = (props: { item: T, index: number }) => any

export type TabsSlots<Items> = DynamicSlotWithItems<Items, null, 'leading' | 'trailing' | 'content' | 'default'> extends infer S ? { [K in keyof S]: SlotProps<S[K]> } & Record<string, any> : never

</script>

<script setup lang="ts" generic="I extends MaybeReadonlyArray<TabsItem>">
import { computed, reactive, toRef } from 'vue'
import { defu } from 'defu'
import { TabsRoot, TabsList, TabsIndicator, TabsTrigger, TabsContent, useForwardPropsEmits } from 'radix-vue'
import { get } from '../utils'

const props = withDefaults(defineProps<TabsProps<I>>(), {
  content: true,
  defaultValue: '0',
  orientation: 'horizontal',
  labelKey: 'label'
})
const emits = defineEmits<TabsEmits>()
const slots = defineSlots<TabsSlots<I>>()

const rootProps = useForwardPropsEmits(reactive({
  as: props.as,
  defaultValue: props.defaultValue,
  orientation: props.orientation,
  activationMode: props.activationMode,
  modelValue: props.modelValue
}), emits)

const contentProps = toRef(() => defu(props.content || {}, { forceMount: true }) as TabsContentProps)

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
      <TabsContent v-for="(item, index) of items" :key="index" v-bind="contentProps" :value="item.value || String(index)" :class="ui.content({ class: props.ui?.content })">
        <slot :name="item.slot || 'content'" :item="item" :index="index">
          {{ item.content }}
        </slot>
      </TabsContent>
    </template>
  </TabsRoot>
</template>
