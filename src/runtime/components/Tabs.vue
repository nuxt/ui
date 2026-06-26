<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { ComponentPublicInstance, VNode } from 'vue'
import type { TabsRootProps, TabsRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/tabs'
import type { AvatarProps, BadgeProps, IconProps, DropdownMenuItem } from '../types'
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
   * The orientation of the tab list.
   * @defaultValue 'horizontal'
   */
  orientation?: Tabs['variants']['orientation']
  /**
   * Controls how the tab list handles items that don't fit:
   * - `'scroll'` enables scrolling along the list axis.
   * - `'wrap'` allows tabs to wrap onto multiple lines.
   * - `'collapse'` hides overflowing tabs behind a "more" dropdown.
   *
   * When omitted, no overflow handling is applied.
   */
  overflow?: Tabs['variants']['overflow']
  /**
   * The label for the "more" trigger shown when `overflow="collapse"`.
   * @defaultValue 'More'
   */
  moreLabel?: string
  /**
   * The icon for the "more" trigger shown when `overflow="collapse"`.
   * @defaultValue appConfig.ui.icons.ellipsis
   * @IconifyIcon
   */
  moreIcon?: IconProps['name']
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

export interface TabsEmits extends TabsRootEmits<string | number> {
  'update:modelValue': [value: string | number]
}

type SlotProps<T extends TabsItem> = (props: { item: T, index: number, ui: Tabs['ui'] }) => VNode[]

export type TabsSlots<T extends TabsItem = TabsItem> = {
  'leading'?: SlotProps<T>
  'default'?(props: { item: T, index: number }): VNode[]
  'trailing'?: SlotProps<T>
  'content'?: SlotProps<T>
  'list-leading'?(props?: {}): VNode[]
  'list-trailing'?(props?: {}): VNode[]
  'more'?(props: { items: T[], isActive: boolean, ui: Tabs['ui'] }): VNode[]
} & DynamicSlots<T, undefined, { index: number, ui: Tabs['ui'] }>

</script>

<script setup lang="ts" generic="T extends TabsItem">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
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
import UDropdownMenu from './DropdownMenu.vue'

const _props = withDefaults(defineProps<TabsProps<T>>(), {
  content: true,
  defaultValue: '0',
  orientation: 'horizontal',
  unmountOnHide: true,
  valueKey: 'value',
  labelKey: 'label',
  moreLabel: 'More'
})
const emits = defineEmits<TabsEmits>()
const slots = defineSlots<TabsSlots<T>>()

const props = useComponentProps<TabsProps<T>>('tabs', _props)

const appConfig = useAppConfig() as Tabs['AppConfig']

const rootProps = useForwardProps(reactivePick(props, 'as', 'unmountOnHide'))

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.tabs || {}) })({
  color: props.color,
  variant: props.variant,
  size: props.size,
  orientation: props.orientation,
  overflow: props.overflow
}))

const triggersRef = ref<ComponentPublicInstance[]>([])

function setTriggerRef(index: number, el: Element | ComponentPublicInstance | null) {
  // @ts-expect-error - ComponentPublicInstance type mismatch in Nuxt module augmentation
  triggersRef.value[index] = el
}

// --- Active value tracking (used to highlight the "More" button when the active
// item is currently hidden in the overflow dropdown).
const activeValue = ref<string | number | undefined>(props.modelValue ?? props.defaultValue)
watch(() => props.modelValue, (v) => {
  if (v !== undefined) activeValue.value = v
})

function onValueChange(value: string | number) {
  activeValue.value = value
  emits('update:modelValue', value)
}

// --- Overflow: collapse mode
const isCollapse = computed(() => props.overflow === 'collapse')
const isWrap = computed(() => props.overflow === 'wrap')
const isVerticalList = computed(() => props.orientation === 'vertical')

const listRef = ref<HTMLElement | null>(null)
const moreRef = ref<HTMLElement | null>(null)
// Rendered client-side only so the CSS active-trigger fallback (see `ssr` in the theme)
// keeps highlighting the active tab during SSR / pre-hydration.
const isMounted = ref(false)
const customIndicatorStyle = ref<Record<string, string>>({ visibility: 'hidden' })
const visibleCount = ref<number>(props.items?.length ?? 0)
const naturalSizes = ref<number[]>([])
const moreSize = ref<number>(0)
const measuring = ref<boolean>(false)

function getEl(maybe: any): HTMLElement | null {
  if (!maybe) return null
  return (maybe.$el ?? maybe) as HTMLElement
}

function measureNaturalSizes() {
  const sizes: number[] = []
  for (const t of triggersRef.value) {
    const el = getEl(t)
    if (!el) {
      sizes.push(0)
      continue
    }
    sizes.push(isVerticalList.value ? el.offsetHeight : el.offsetWidth)
  }
  naturalSizes.value = sizes
  if (moreRef.value) {
    moreSize.value = isVerticalList.value ? moreRef.value.offsetHeight : moreRef.value.offsetWidth
  }
}

function computeVisibleCount() {
  const listEl = getEl(listRef.value)
  if (!listEl || !props.items?.length) return
  const containerSize = isVerticalList.value ? listEl.clientHeight : listEl.clientWidth
  if (!containerSize) return

  const totalNatural = naturalSizes.value.reduce((a, b) => a + b, 0)
  if (totalNatural <= containerSize) {
    visibleCount.value = naturalSizes.value.length
    return
  }
  const budget = containerSize - moreSize.value
  let used = 0
  let count = 0
  for (let i = 0; i < naturalSizes.value.length; i++) {
    const next = used + (naturalSizes.value[i] ?? 0)
    if (next > budget) break
    used = next
    count++
  }
  visibleCount.value = Math.max(1, count)
}

async function remeasure() {
  if (!isCollapse.value) {
    visibleCount.value = props.items?.length ?? 0
    return
  }
  // Show all triggers AND the more button so we can read their natural sizes.
  measuring.value = true
  visibleCount.value = props.items?.length ?? 0
  await nextTick()
  measureNaturalSizes()
  measuring.value = false
  computeVisibleCount()
  updateCustomIndicator()
}

const overflowItems = computed<T[]>(() => {
  if (!isCollapse.value || !props.items) return []
  return props.items.slice(visibleCount.value)
})

const isOverflowActive = computed(() => {
  return overflowItems.value.some((item, idx) => {
    const value = get(item, props.valueKey as string) ?? String(visibleCount.value + idx)
    return value === activeValue.value
  })
})

// Use a single custom indicator for wrap/collapse so position animates consistently
// (including visible tab ↔ More transitions in collapse mode).
const useCustomIndicator = computed(() => isWrap.value || isCollapse.value)

const indicatorClass = computed(() => ui.value.indicator({
  class: props.ui?.indicator
}))

function setCustomIndicatorRect(listEl: HTMLElement, rect: DOMRect) {
  const listRect = listEl.getBoundingClientRect()
  const top = rect.top - listRect.top + listEl.scrollTop
  const left = rect.left - listRect.left + listEl.scrollLeft

  if (props.variant === 'link') {
    if (props.orientation === 'vertical') {
      customIndicatorStyle.value = {
        visibility: 'visible',
        top: `${top}px`,
        left: `${left}px`,
        width: '1px',
        height: `${rect.height}px`,
        transform: 'none'
      }
    } else {
      customIndicatorStyle.value = {
        visibility: 'visible',
        top: `${top + rect.height - 1}px`,
        left: `${left}px`,
        width: `${rect.width}px`,
        height: '1px',
        transform: 'none'
      }
    }
    return
  }

  customIndicatorStyle.value = {
    visibility: 'visible',
    top: `${top}px`,
    left: `${left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    transform: 'none'
  }
}

async function updateCustomIndicator() {
  if (!useCustomIndicator.value) {
    customIndicatorStyle.value = { visibility: 'hidden' }
    return
  }

  await nextTick()
  const listEl = getEl(listRef.value)
  if (!listEl) {
    customIndicatorStyle.value = { visibility: 'hidden' }
    return
  }

  if (isCollapse.value && isOverflowActive.value) {
    if (!moreRef.value) {
      customIndicatorStyle.value = { visibility: 'hidden' }
      return
    }
    setCustomIndicatorRect(listEl, moreRef.value.getBoundingClientRect())
    return
  }

  const activeTab = listEl.querySelector('[role="tab"][data-state="active"]') as HTMLElement | null
  if (!activeTab) {
    customIndicatorStyle.value = { visibility: 'hidden' }
    return
  }

  setCustomIndicatorRect(listEl, activeTab.getBoundingClientRect())
}

function setupCustomIndicator() {
  customResizeObserver?.disconnect()
  customResizeObserver = null
  if (!useCustomIndicator.value) return
  updateCustomIndicator()
  const listEl = getEl(listRef.value)
  if (listEl && typeof ResizeObserver !== 'undefined') {
    customResizeObserver = new ResizeObserver(() => updateCustomIndicator())
    customResizeObserver.observe(listEl)
  }
}

let resizeObserver: ResizeObserver | null = null
let customResizeObserver: ResizeObserver | null = null

onMounted(() => {
  isMounted.value = true
  if (isCollapse.value) {
    remeasure()
    const listEl = getEl(listRef.value)
    if (listEl && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        // Sizes don't change on container resize; only the budget does.
        computeVisibleCount()
        updateCustomIndicator()
      })
      resizeObserver.observe(listEl)
    }
  }
  setupCustomIndicator()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
  customResizeObserver?.disconnect()
  customResizeObserver = null
})

watch(() => [props.overflow, props.orientation, props.size, props.variant, props.items?.length], () => {
  if (!isCollapse.value) {
    visibleCount.value = props.items?.length ?? 0
  } else {
    remeasure()
  }
  setupCustomIndicator()
})

watch([activeValue, isOverflowActive, visibleCount], () => {
  updateCustomIndicator()
})

function isTriggerHidden(index: number) {
  return isCollapse.value && index >= visibleCount.value
}

function activateOverflowItem(realIndex: number) {
  const item = props.items?.[realIndex]
  if (!item) return
  const value = get(item, props.valueKey as string) ?? String(realIndex)
  onValueChange(value)
}

const moreMenuItems = computed<DropdownMenuItem[]>(() => {
  return overflowItems.value.map((item, idx) => {
    const realIndex = visibleCount.value + idx
    const value = get(item, props.valueKey as string) ?? String(realIndex)
    return {
      label: get(item, props.labelKey as string),
      icon: item.icon,
      avatar: item.avatar,
      type: 'checkbox',
      checked: value === activeValue.value,
      disabled: item.disabled,
      onSelect: (e: Event) => {
        e.preventDefault()
        activateOverflowItem(realIndex)
      },
      onUpdateChecked: () => {
        activateOverflowItem(realIndex)
      }
    } as DropdownMenuItem
  })
})

defineExpose({
  triggersRef
})
</script>

<template>
  <TabsRoot
    v-bind="rootProps"
    :model-value="activeValue"
    :default-value="props.defaultValue"
    :orientation="props.orientation"
    :activation-mode="props.activationMode"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @update:model-value="onValueChange"
  >
    <div ref="listRef" data-slot="list" :class="ui.list({ class: props.ui?.list })">
      <div
        v-if="useCustomIndicator && isMounted"
        aria-hidden="true"
        data-slot="indicator"
        :class="indicatorClass"
        :style="customIndicatorStyle"
      />
      <TabsIndicator v-else data-slot="indicator" :class="ui.indicator({ class: props.ui?.indicator })" />

      <TabsList data-slot="tablist" :class="ui.tablist({ class: props.ui?.tablist })">
        <slot name="list-leading" />

        <TabsTrigger
          v-for="(item, index) of props.items"
          :key="get(item, props.valueKey as string) ?? index"
          :ref="el => setTriggerRef(index, el)"
          :value="get(item, props.valueKey as string) ?? String(index)"
          :disabled="item.disabled"
          data-slot="trigger"
          :class="ui.trigger({ class: [props.ui?.trigger, item.ui?.trigger, isTriggerHidden(index) && 'hidden', measuring && isCollapse && 'grow-0 shrink-0'] })"
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

      <UDropdownMenu
        v-if="isCollapse"
        :items="moreMenuItems"
      >
        <button
          ref="moreRef"
          type="button"
          data-slot="more"
          :data-state="isOverflowActive ? 'active' : 'inactive'"
          :class="ui.trigger({ class: [ui.more({ class: props.ui?.more }), measuring && 'grow-0 shrink-0', !measuring && !overflowItems.length && 'hidden'] })"
        >
          <slot name="more" :items="overflowItems" :is-active="isOverflowActive" :ui="ui">
            <UIcon :name="props.moreIcon || appConfig.ui.icons.ellipsis" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
            <span data-slot="label" :class="ui.label({ class: props.ui?.label })">{{ props.moreLabel }}</span>
          </slot>
        </button>
      </UDropdownMenu>
    </div>

    <template v-if="!!props.content">
      <TabsContent v-for="(item, index) of props.items" :key="get(item, props.valueKey as string) ?? index" :value="get(item, props.valueKey as string) ?? String(index)" data-slot="content" :class="ui.content({ class: [props.ui?.content, item.ui?.content, item.class] })">
        <slot :name="((item.slot || 'content') as keyof TabsSlots<T>)" :item="(item as Extract<T, { slot: string; }>)" :index="index" :ui="ui">
          {{ item.content }}
        </slot>
      </TabsContent>
    </template>
  </TabsRoot>
</template>
