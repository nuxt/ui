<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/wheel-picker'
import type { IconProps } from './Icon.vue'
import type { AcceptableValue, GetItemKeys, GetModelValue, GetModelValueEmits } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type WheelPicker = ComponentConfig<typeof theme, AppConfig, 'wheelPicker'>

export type WheelPickerValue = AcceptableValue

export type WheelPickerItem = WheelPickerValue | {
  label?: string
  /**
   * @IconifyIcon
   */
  icon?: string
  value?: WheelPickerValue
  disabled?: boolean
  class?: any
  ui?: Pick<WheelPicker['slots'], 'item' | 'itemLeading' | 'itemLabel'>
  [key: string]: any
}

export interface WheelPickerProps<T extends WheelPickerItem[] = WheelPickerItem[], VK extends GetItemKeys<T> = 'value'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /** The items to display in the wheel. */
  items?: T
  /** The controlled value of the WheelPicker. Can be bound with `v-model`. */
  modelValue?: GetModelValue<T, VK, false>
  /** The value of the WheelPicker when initially rendered. Use when you do not need to control its state. */
  defaultValue?: GetModelValue<T, VK, false>
  /**
   * When `items` is an array of objects, select the field to use as the value.
   * @defaultValue 'value'
   */
  valueKey?: VK
  /**
   * When `items` is an array of objects, select the field to use as the label.
   * @defaultValue 'label'
   */
  labelKey?: GetItemKeys<T>
  /** The name of the underlying field, submitted with a form. */
  name?: string
  /** The id of the wheel, wired to the `for` attribute of a wrapping label. */
  id?: string
  /**
   * @defaultValue 'neutral'
   */
  color?: WheelPicker['variants']['color']
  /**
   * @defaultValue 'pill'
   */
  variant?: WheelPicker['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: WheelPicker['variants']['size']
  /**
   * The orientation of the wheel.
   * @defaultValue 'vertical'
   */
  orientation?: WheelPicker['variants']['orientation']
  /** Disable the wheel and all of its interactions. */
  disabled?: boolean
  /** Keep the wheel focusable but prevent its value from changing. */
  readonly?: boolean
  /**
   * Vibrate briefly each time the selected item changes (where supported).
   * @defaultValue false
   */
  haptics?: boolean
  /**
   * Whether the wheel loops around infinitely.
   * @defaultValue false
   */
  loop?: boolean
  /**
   * The number of items visible at once. Must be an odd number to keep the
   * selected item centered.
   * @defaultValue 5
   */
  visibleItems?: number
  /**
   * The height (or width when horizontal) of a single item, in pixels.
   * @defaultValue 32
   */
  itemHeight?: number
  /** The text displayed when there are no items. */
  placeholder?: string
  /**
   * Enable inertia / momentum scrolling after a flick.
   * @defaultValue true
   */
  momentum?: boolean
  /**
   * Scroll sensitivity multiplier for wheel and drag gestures. Values above `1`
   * move faster, below `1` slower.
   * @defaultValue 1
   */
  sensitivity?: number
  /**
   * Snap to the nearest item when scrolling stops.
   * @defaultValue true
   */
  snap?: boolean
  /**
   * The base duration of the snap animation, in milliseconds.
   * @defaultValue 200
   */
  animationDuration?: number
  /** The accessible label of the wheel, announced by screen readers. */
  ariaLabel?: string
  class?: any
  ui?: WheelPicker['slots']
}

export type WheelPickerEmits<T extends WheelPickerItem[] = WheelPickerItem[], VK extends GetItemKeys<T> = 'value'> = GetModelValueEmits<T, VK, false> & {
  /** Emitted when the selected item changes. */
  'change': [payload: { value: WheelPickerValue, index: number }]
  /** Emitted when a scroll interaction begins. */
  'scroll-start': []
  /** Emitted when a scroll interaction ends. */
  'scroll-end': []
}

type NormalizedItem = {
  id: string
  value: WheelPickerValue
  label: string
  icon?: string
  disabled?: boolean
  class?: any
  ui?: any
  raw: WheelPickerItem
}

type SlotProps = { item: NormalizedItem, index: number, active: boolean, ui: WheelPicker['ui'] }

export interface WheelPickerSlots {
  default?(props: SlotProps): VNode[]
  item?(props: SlotProps): VNode[]
  selected?(props: { item: NormalizedItem, index: number, ui: WheelPicker['ui'] }): VNode[]
  prefix?(props: { ui: WheelPicker['ui'] }): VNode[]
  suffix?(props: { ui: WheelPicker['ui'] }): VNode[]
  empty?(props: { ui: WheelPicker['ui'] }): VNode[]
}
</script>

<script setup lang="ts" generic="T extends WheelPickerItem[], VK extends GetItemKeys<T> = 'value'">
import { computed, ref, inject, useId, watch, onMounted, nextTick, useTemplateRef } from 'vue'
import { Primitive } from 'reka-ui'
import { useVModel } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useFormField } from '../composables/useFormField'
import { useWheelPicker, wheelPickerGroupInjectionKey } from '../composables/useWheelPicker'
import { useLocale } from '../composables/useLocale'
import { get, compare } from '../utils'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<WheelPickerProps<T, VK>>(), {
  valueKey: 'value' as never,
  labelKey: 'label',
  orientation: 'vertical',
  loop: false,
  momentum: true,
  snap: true,
  animationDuration: 200
})
const emits = defineEmits<WheelPickerEmits<T, VK>>()
defineSlots<WheelPickerSlots>()

const props = useComponentProps<WheelPickerProps<T, VK>>('wheelPicker', _props)

const appConfig = useAppConfig() as WheelPicker['AppConfig']
const { dir } = useLocale()

// eslint-disable-next-line vue/no-dupe-keys
const modelValue = useVModel<WheelPickerProps<T, VK>, 'modelValue', 'update:modelValue'>(props, 'modelValue', emits, { defaultValue: props.defaultValue })

const { id: _id, name, size: formFieldSize, color, disabled: formFieldDisabled, ariaAttrs, emitFormChange, emitFormInput } = useFormField<WheelPickerProps<T, VK>>(_props, { bind: false })
const fallbackId = useId()
// eslint-disable-next-line vue/no-dupe-keys
const id = computed(() => _id.value ?? fallbackId)

// Optional parent `<UWheelPickerGroup>` — supplies shared geometry/appearance so
// every column aligns, and switches this column to a frameless ("bare") style.
const group = inject(wheelPickerGroupInjectionKey, undefined)
const bare = computed(() => !!group)

// eslint-disable-next-line vue/no-dupe-keys
const disabled = computed(() => !!(formFieldDisabled.value ?? props.disabled))
const isHorizontal = computed(() => props.orientation === 'horizontal')
const isRtl = computed(() => dir.value === 'rtl')

// Resolve geometry with the priority: explicit prop > group > default.
const itemSizePx = computed(() => props.itemHeight ?? group?.itemHeight() ?? 32)
const visibleCount = computed(() => props.visibleItems ?? group?.visibleItems() ?? 5)

// Gap kept between items in horizontal orientation so labels never touch.
const ITEM_GAP = 16

const viewportRef = useTemplateRef<HTMLElement>('viewportRef')
const activeItemWidth = ref<number>()
const maxItemWidth = ref<number>()

// Distance between item centers along the scroll axis. Vertical rows use the
// item height; horizontal labels have variable widths, so the pitch grows to
// fit the widest measured item — this is what prevents neighbours overlapping.
const pitch = computed(() => isHorizontal.value
  ? Math.max(itemSizePx.value, (maxItemWidth.value ?? itemSizePx.value) + ITEM_GAP)
  : itemSizePx.value)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.wheelPicker || {}) })({
  color: color.value ?? props.color ?? group?.color(),
  variant: props.variant ?? group?.variant(),
  size: formFieldSize.value ?? props.size ?? group?.size(),
  orientation: props.orientation,
  disabled: disabled.value,
  bare: bare.value
}))

function normalizeItem(item: WheelPickerItem, index: number): NormalizedItem {
  if (item === null || typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean' || typeof item === 'bigint') {
    return {
      id: `${id.value}-${index}`,
      value: item as WheelPickerValue,
      label: item === null ? '' : String(item),
      raw: item
    }
  }

  const value = get(item, props.valueKey as string)
  const label = get(item, props.labelKey as string)

  return {
    id: `${id.value}-${index}`,
    value,
    label: label != null ? String(label) : '',
    icon: item.icon,
    disabled: item.disabled,
    class: item.class,
    ui: item.ui,
    raw: item
  }
}

const normalizedItems = computed<NormalizedItem[]>(() => (props.items ?? []).map(normalizeItem))
const count = computed(() => normalizedItems.value.length)

function indexOfValue(value: WheelPickerValue | undefined): number {
  if (value === undefined) return -1
  return normalizedItems.value.findIndex(item => compare(item.value, value))
}

function nearestEnabled(index: number): number {
  const items = normalizedItems.value
  if (!items[index]?.disabled) return index
  for (let offset = 1; offset < items.length; offset++) {
    if (!items[index + offset]?.disabled && items[index + offset]) return index + offset
    if (!items[index - offset]?.disabled && items[index - offset]) return index - offset
  }
  return -1
}

const engine = useWheelPicker({
  count,
  itemSize: pitch,
  visibleItems: visibleCount,
  loop: () => props.loop ?? false,
  disabled,
  readonly: () => props.readonly ?? false,
  haptics: () => props.haptics ?? false,
  momentum: () => props.momentum ?? true,
  sensitivity: () => props.sensitivity ?? 1,
  snap: () => props.snap ?? true,
  animationDuration: () => props.animationDuration ?? 200,
  horizontal: isHorizontal,
  rtl: isRtl,
  onChange: onEngineChange,
  onScrollStart: () => emits('scroll-start'),
  onScrollEnd: () => emits('scroll-end')
})

const activeIndex = engine.activeIndex

function onEngineChange(index: number) {
  const item = normalizedItems.value[index]
  if (!item) return

  // Skip disabled items by nudging to the nearest enabled one.
  if (item.disabled) {
    const enabled = nearestEnabled(index)
    if (enabled !== -1 && enabled !== index) {
      engine.scrollToIndex(enabled, true)
    }
    return
  }

  if (!compare<WheelPickerValue>(modelValue.value as WheelPickerValue, item.value)) {
    modelValue.value = item.value as GetModelValue<T, VK, false>
    emits('change', { value: item.value, index })
    emitFormChange()
    emitFormInput()
  }
}

// Keep the wheel in sync when the value is changed from the outside.
watch(modelValue, (value) => {
  const index = indexOfValue(value as WheelPickerValue)
  if (index !== -1 && index !== activeIndex.value) {
    engine.scrollToIndex(index, true)
  }
})

// Re-center if the item list changes underneath the current value.
watch(count, () => {
  const index = indexOfValue(modelValue.value as WheelPickerValue)
  if (index !== -1 && index !== activeIndex.value) {
    engine.scrollToIndex(index, false)
  }
})

onMounted(() => {
  const index = indexOfValue(modelValue.value as WheelPickerValue)
  const target = index !== -1 ? index : 0
  const enabled = normalizedItems.value[target]?.disabled ? nearestEnabled(target) : target
  engine.scrollToIndex(enabled !== -1 ? enabled : target, false)
})

// Type-ahead: jump to the item whose label matches the typed characters. A run
// of the same character cycles through matches, like native `<select>`.
let typeAhead = ''
let typeAheadTimer: ReturnType<typeof setTimeout> | undefined

function handleTypeAhead(char: string) {
  if (disabled.value || props.readonly || count.value === 0) return

  typeAhead += char.toLowerCase()
  if (typeAheadTimer) clearTimeout(typeAheadTimer)
  typeAheadTimer = setTimeout(() => {
    typeAhead = ''
  }, 700)

  const items = normalizedItems.value
  const allSame = typeAhead.length > 1 && [...typeAhead].every(c => c === typeAhead[0])
  const query = allSame ? typeAhead[0]! : typeAhead
  const start = allSame ? 1 : 0

  for (let step = 0; step < items.length; step++) {
    const i = (activeIndex.value + start + step) % items.length
    const item = items[i]
    if (item && !item.disabled && item.label.toLowerCase().startsWith(query)) {
      engine.scrollToIndex(i, true)
      break
    }
  }
}

function onKeydown(event: KeyboardEvent) {
  const key = event.key
  const printable = key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && !!key.trim()
  if (printable) {
    event.preventDefault()
    handleTypeAhead(key)
    return
  }
  engine.onKeydown(event)
}

// The window of virtual cells to render around the current position. In loop
// mode virtual indices run past `[0, count)` and are mapped back to real items.
const cells = computed(() => {
  const n = count.value
  if (n === 0) return []

  const visible = Math.max(1, visibleCount.value)
  const buffer = Math.ceil(visible / 2) + 1
  const half = Math.floor(visible / 2) + buffer
  const center = Math.round(engine.position.value)

  const result: Array<{ key: number, virtualIndex: number, index: number }> = []
  for (let virtualIndex = center - half; virtualIndex <= center + half; virtualIndex++) {
    let index = virtualIndex
    if (props.loop) {
      index = ((virtualIndex % n) + n) % n
    } else if (virtualIndex < 0 || virtualIndex > n - 1) {
      continue
    }
    result.push({ key: virtualIndex, virtualIndex, index })
  }
  return result
})

const selectedItem = computed(() => normalizedItems.value[activeIndex.value])

// In horizontal orientation items are sized to their content, so measure the
// widest item (to drive the pitch) and the active item (to size the highlight).
function measure() {
  if (!import.meta.client || !isHorizontal.value) return
  const cells = viewportRef.value?.querySelectorAll<HTMLElement>('[role="option"]')
  if (!cells?.length) return

  let max = 0
  let active: number | undefined
  cells.forEach((el) => {
    max = Math.max(max, el.offsetWidth)
    if (el.getAttribute('aria-selected') === 'true') active = el.offsetWidth
  })
  maxItemWidth.value = max || undefined
  activeItemWidth.value = active || undefined
}

watch([activeIndex, isHorizontal, count, normalizedItems], () => nextTick(measure), { flush: 'post' })
onMounted(() => nextTick(measure))

const viewportStyle = computed(() => isHorizontal.value
  ? { width: `${visibleCount.value * pitch.value}px`, height: `${itemSizePx.value}px` }
  : { height: `${visibleCount.value * itemSizePx.value}px`, width: '100%' })

const indicatorStyle = computed(() => isHorizontal.value
  ? { width: activeItemWidth.value ? `${activeItemWidth.value + ITEM_GAP / 2}px` : `${itemSizePx.value}px` }
  : { height: `${itemSizePx.value}px` })

defineExpose({
  activeIndex,
  scrollToIndex: engine.scrollToIndex
})
</script>

<template>
  <Primitive
    :as="props.as"
    data-slot="root"
    v-bind="$attrs"
    :data-orientation="props.orientation"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <slot name="prefix" :ui="ui" />

    <div
      :id="id"
      ref="viewportRef"
      role="listbox"
      :aria-label="props.ariaLabel || name"
      :aria-orientation="props.orientation"
      :aria-activedescendant="selectedItem?.id"
      :aria-disabled="disabled || undefined"
      :aria-readonly="props.readonly || undefined"
      :tabindex="disabled ? -1 : 0"
      data-slot="viewport"
      :style="viewportStyle"
      :class="ui.viewport({ class: props.ui?.viewport })"
      v-bind="ariaAttrs"
      @wheel="engine.onWheel"
      @pointerdown="engine.onPointerDown"
      @pointermove="engine.onPointerMove"
      @pointerup="engine.onPointerUp"
      @pointercancel="engine.onPointerUp"
      @keydown="onKeydown"
    >
      <div
        v-if="!bare"
        aria-hidden="true"
        data-slot="indicator"
        :style="indicatorStyle"
        :class="ui.indicator({ class: props.ui?.indicator })"
      />

      <template v-if="count > 0">
        <div data-slot="list" :class="ui.list({ class: props.ui?.list })">
          <div
            v-for="cell in cells"
            :id="normalizedItems[cell.index]?.id"
            :key="cell.key"
            role="option"
            :aria-selected="cell.index === activeIndex"
            :aria-disabled="normalizedItems[cell.index]?.disabled || undefined"
            data-slot="item"
            :style="engine.itemStyle(cell.virtualIndex)"
            :class="ui.item({ class: [props.ui?.item, normalizedItems[cell.index]?.ui?.item, normalizedItems[cell.index]?.class] })"
          >
            <slot
              name="item"
              :item="(normalizedItems[cell.index] as NormalizedItem)"
              :index="cell.index"
              :active="cell.index === activeIndex"
              :ui="ui"
            >
              <slot
                :item="(normalizedItems[cell.index] as NormalizedItem)"
                :index="cell.index"
                :active="cell.index === activeIndex"
                :ui="ui"
              >
                <UIcon
                  v-if="normalizedItems[cell.index]?.icon"
                  :name="(normalizedItems[cell.index]?.icon as IconProps['name'])"
                  data-slot="itemLeading"
                  :class="ui.itemLeading({ class: [props.ui?.itemLeading, normalizedItems[cell.index]?.ui?.itemLeading] })"
                />
                <span data-slot="itemLabel" :class="ui.itemLabel({ class: [props.ui?.itemLabel, normalizedItems[cell.index]?.ui?.itemLabel] })">
                  {{ normalizedItems[cell.index]?.label }}
                </span>
              </slot>
            </slot>
          </div>
        </div>

        <slot v-if="selectedItem" name="selected" :item="selectedItem" :index="activeIndex" :ui="ui" />
      </template>

      <div v-else data-slot="empty" :class="ui.empty({ class: props.ui?.empty })">
        <slot name="empty" :ui="ui">
          {{ props.placeholder }}
        </slot>
      </div>
    </div>

    <slot name="suffix" :ui="ui" />
  </Primitive>
</template>
