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
  /** A unique value for the tab item. Defaults to the index. */
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
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { TabsRoot, TabsList, TabsIndicator, TabsTrigger, TabsContent, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig, useNuxtApp } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { get } from '../utils'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UBadge from './Badge.vue'

const props = withDefaults(defineProps<TabsProps<T>>(), {
  content: true,
  defaultValue: '0',
  orientation: 'horizontal',
  unmountOnHide: true,
  valueKey: 'value',
  labelKey: 'label'
})
const emits = defineEmits<TabsEmits>()
const slots = defineSlots<TabsSlots<T>>()

const appConfig = useAppConfig() as Tabs['AppConfig']
const nuxtApp = useNuxtApp()
const uiProp = useComponentUI('tabs', props)

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'unmountOnHide'), emits)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.tabs || {}) })({
  color: props.color,
  variant: props.variant,
  size: props.size,
  orientation: props.orientation
}))

const hydrationKeyPrefix = ref(import.meta.server || nuxtApp.isHydrating ? 0 : 1)
const rootRef = ref<Element | ComponentPublicInstance | null>(null)

const resolvedItems = computed(() => {
  if (!props.items) {
    return []
  }

  return props.items.map((item, index) => {
    const value = get(item, props.valueKey as string) ?? String(index)
    const stableId = get(item, props.valueKey as string) ?? get(item, props.labelKey as string) ?? String(index)

    return {
      key: `${hydrationKeyPrefix.value}-${stableId}`,
      item,
      index,
      value
    }
  })
})

const triggersRef = ref<ComponentPublicInstance[]>([])

watch(resolvedItems, (items) => {
  triggersRef.value = triggersRef.value.slice(0, items.length)
}, { immediate: true })

function getElement(el: Element | ComponentPublicInstance | null) {
  if (!el) {
    return null
  }

  if ('$el' in el) {
    return el.$el as HTMLElement
  }

  return el as HTMLElement
}

function setTriggerRef(index: number, el: Element | ComponentPublicInstance | null) {
  // @ts-expect-error - ComponentPublicInstance type mismatch in Nuxt module augmentation
  triggersRef.value[index] = el
}

function shouldRefreshHydratedItems() {
  if (props.modelValue === undefined) {
    return false
  }

  const rootEl = getElement(rootRef.value)

  if (!rootEl) {
    return false
  }

  const tabs = Array.from(rootEl.querySelectorAll<HTMLElement>(':scope > [data-slot="list"] > [data-slot="trigger"][role="tab"]'))
  const activeIndexes = tabs.flatMap((tab, index) => tab.dataset.state === 'active' ? [index] : [])
  const expectedIndex = resolvedItems.value.findIndex(item => item.value === props.modelValue)

  return expectedIndex !== -1 && (activeIndexes.length !== 1 || activeIndexes[0] !== expectedIndex)
}

onMounted(async () => {
  if (hydrationKeyPrefix.value !== 0) {
    return
  }

  await nextTick()

  if (shouldRefreshHydratedItems()) {
    hydrationKeyPrefix.value = 1
  }
})

defineExpose({
  triggersRef
})
</script>

<template>
  <TabsRoot
    :key="hydrationKeyPrefix"
    ref="rootRef"
    v-bind="rootProps"
    :model-value="modelValue"
    :default-value="defaultValue"
    :orientation="orientation"
    :activation-mode="activationMode"
    data-slot="root"
    :class="ui.root({ class: [uiProp?.root, props.class] })"
  >
    <TabsList data-slot="list" :class="ui.list({ class: uiProp?.list })">
      <TabsIndicator data-slot="indicator" :class="ui.indicator({ class: uiProp?.indicator })" />

      <slot name="list-leading" />

      <TabsTrigger
        v-for="{ item, index, key, value } of resolvedItems"
        :key="key"
        :ref="el => setTriggerRef(index, el)"
        :value="value"
        :disabled="item.disabled"
        data-slot="trigger"
        :class="ui.trigger({ class: [uiProp?.trigger, item.ui?.trigger] })"
      >
        <slot name="leading" :item="item" :index="index" :ui="ui">
          <UIcon v-if="item.icon" :name="item.icon" data-slot="leadingIcon" :class="ui.leadingIcon({ class: [uiProp?.leadingIcon, item.ui?.leadingIcon] })" />
          <UAvatar v-else-if="item.avatar" :size="((item.ui?.leadingAvatarSize || uiProp?.leadingAvatarSize || ui.leadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" data-slot="leadingAvatar" :class="ui.leadingAvatar({ class: [uiProp?.leadingAvatar, item.ui?.leadingAvatar] })" />
        </slot>

        <span v-if="get(item, props.labelKey as string) || !!slots.default" data-slot="label" :class="ui.label({ class: [uiProp?.label, item.ui?.label] })">
          <slot :item="item" :index="index">{{ get(item, props.labelKey as string) }}</slot>
        </span>

        <slot name="trailing" :item="item" :index="index" :ui="ui">
          <UBadge
            v-if="item.badge || item.badge === 0"
            color="neutral"
            variant="outline"
            :size="((item.ui?.trailingBadgeSize || uiProp?.trailingBadgeSize || ui.trailingBadgeSize()) as BadgeProps['size'])"
            v-bind="(typeof item.badge === 'string' || typeof item.badge === 'number') ? { label: item.badge } : item.badge"
            data-slot="trailingBadge"
            :class="ui.trailingBadge({ class: [uiProp?.trailingBadge, item.ui?.trailingBadge] })"
          />
        </slot>
      </TabsTrigger>

      <slot name="list-trailing" />
    </TabsList>

    <template v-if="!!content">
      <TabsContent v-for="{ item, index, key, value } of resolvedItems" :key="key" :value="value" data-slot="content" :class="ui.content({ class: [uiProp?.content, item.ui?.content, item.class] })">
        <slot :name="((item.slot || 'content') as keyof TabsSlots<T>)" :item="(item as Extract<T, { slot: string; }>)" :index="index" :ui="ui">
          {{ item.content }}
        </slot>
      </TabsContent>
    </template>
  </TabsRoot>
</template>
