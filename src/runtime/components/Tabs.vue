<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { ComponentPublicInstance, VNode } from 'vue'
import type { TabsRootProps, TabsRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/tabs'
import type { AvatarProps, BadgeProps, IconProps } from '../types'
import type { DynamicSlots, GetItemKeys } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type Tabs = ComponentConfig<typeof theme, AppConfig, 'tabs'>

export interface TabsItem {
  label?: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  avatar?: AvatarProps
  /**
   * Display a badge on the item.
   * `{ size: 'sm', color: 'neutral', variant: 'outline' }`{lang="ts-type"}
   */
  badge?: string | number | BadgeProps
  slot?: string
  content?: string
  /**
   * A unique value for the tab item. Defaults to the index.
   * Also used as the Vue `key` for this item, so providing a stable value prevents tab
   * content (and its local state) from remounting when items are added, removed, or reordered.
   */
  value?: string | number
  disabled?: boolean
  class?: any
  ui?: Pick<Tabs['slots'], 'trigger' | 'leadingIcon' | 'leadingAvatar' | 'leadingAvatarSize' | 'label' | 'trailingBadge' | 'trailingBadgeSize' | 'content'>
  [key: string]: any
}

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
  color?: Tabs['variants']['color']
  /**
   * @defaultValue 'pill'
   */
  variant?: Tabs['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: Tabs['variants']['size']
  /**
   * The orientation of the tabs.
   * @defaultValue 'horizontal'
   */
  orientation?: Tabs['variants']['orientation']
  /**
   * The content of the tabs, can be disabled to prevent rendering the content.
   * @defaultValue true
   */
  content?: boolean
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
  ui?: Tabs['slots']
}

export interface TabsEmits extends TabsRootEmits<string | number> {}

type SlotProps<T extends TabsItem> = (props: { item: T, index: number, ui: Tabs['ui'] }) => VNode[]

export type TabsSlots<T extends TabsItem = TabsItem> = {
  'leading'?: SlotProps<T>
  'default'?(props: { item: T, index: number }): VNode[]
  'trailing'?: SlotProps<T>
  'content'?: SlotProps<T>
  'list-leading'?(props?: {}): VNode[]
  'list-trailing'?(props?: {}): VNode[]
} & DynamicSlots<T, undefined, { index: number, ui: Tabs['ui'] }>

</script>

<script setup lang="ts" generic="T extends TabsItem">
import { ref, computed } from 'vue'
import { TabsRoot, TabsList, TabsIndicator, TabsTrigger, TabsContent } from 'reka-ui'
import { useForwardProps } from '../composables/useForwardProps'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { get } from '../utils'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UBadge from './Badge.vue'

const _props = withDefaults(defineProps<TabsProps<T>>(), {
  content: true,
  defaultValue: '0',
  orientation: 'horizontal',
  unmountOnHide: true,
  valueKey: 'value',
  labelKey: 'label'
})
const emits = defineEmits<TabsEmits>()
const slots = defineSlots<TabsSlots<T>>()

const props = useComponentProps<TabsProps<T>>('tabs', _props)

const appConfig = useAppConfig() as Tabs['AppConfig']

const rootProps = useForwardProps(reactivePick(props, 'as', 'unmountOnHide'), emits)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.tabs || {}) })({
  color: props.color,
  variant: props.variant,
  size: props.size,
  orientation: props.orientation
}))

const triggersRef = ref<ComponentPublicInstance[]>([])

function setTriggerRef(index: number, el: Element | ComponentPublicInstance | null) {
  // @ts-expect-error - ComponentPublicInstance type mismatch in Nuxt module augmentation
  triggersRef.value[index] = el
}

defineExpose({
  triggersRef
})
</script>

<template>
  <TabsRoot
    v-bind="rootProps"
    :model-value="props.modelValue"
    :default-value="props.defaultValue"
    :orientation="props.orientation"
    :activation-mode="props.activationMode"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <TabsList data-slot="list" :class="ui.list({ class: props.ui?.list })">
      <TabsIndicator data-slot="indicator" :class="ui.indicator({ class: props.ui?.indicator })" />

      <slot name="list-leading" />

      <TabsTrigger
        v-for="(item, index) of props.items"
        :key="get(item, props.valueKey as string) ?? index"
        :ref="el => setTriggerRef(index, el)"
        :value="get(item, props.valueKey as string) ?? String(index)"
        :disabled="item.disabled"
        data-slot="trigger"
        :class="ui.trigger({ class: [props.ui?.trigger, item.ui?.trigger] })"
      >
        <slot name="leading" :item="item" :index="index" :ui="ui">
          <UIcon v-if="item.icon" :name="item.icon" data-slot="leadingIcon" :class="ui.leadingIcon({ class: [props.ui?.leadingIcon, item.ui?.leadingIcon] })" />
          <UAvatar v-else-if="item.avatar" :size="((item.ui?.leadingAvatarSize || props.ui?.leadingAvatarSize || ui.leadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" data-slot="leadingAvatar" :class="ui.leadingAvatar({ class: [props.ui?.leadingAvatar, item.ui?.leadingAvatar] })" />
        </slot>

        <span v-if="get(item, props.labelKey as string) || !!slots.default" data-slot="label" :class="ui.label({ class: [props.ui?.label, item.ui?.label] })">
          <slot :item="item" :index="index">{{ get(item, props.labelKey as string) }}</slot>
        </span>

        <slot name="trailing" :item="item" :index="index" :ui="ui">
          <UBadge
            v-if="item.badge || item.badge === 0"
            color="neutral"
            variant="outline"
            :size="((item.ui?.trailingBadgeSize || props.ui?.trailingBadgeSize || ui.trailingBadgeSize()) as BadgeProps['size'])"
            v-bind="(typeof item.badge === 'string' || typeof item.badge === 'number') ? { label: item.badge } : item.badge"
            data-slot="trailingBadge"
            :class="ui.trailingBadge({ class: [props.ui?.trailingBadge, item.ui?.trailingBadge] })"
          />
        </slot>
      </TabsTrigger>

      <slot name="list-trailing" />
    </TabsList>

    <template v-if="!!props.content">
      <TabsContent v-for="(item, index) of props.items" :key="get(item, props.valueKey as string) ?? index" :value="get(item, props.valueKey as string) ?? String(index)" data-slot="content" :class="ui.content({ class: [props.ui?.content, item.ui?.content, item.class] })">
        <slot :name="((item.slot || 'content') as keyof TabsSlots<T>)" :item="(item as Extract<T, { slot: string; }>)" :index="index" :ui="ui">
          {{ item.content }}
        </slot>
      </TabsContent>
    </template>
  </TabsRoot>
</template>
