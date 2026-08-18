<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/progress-group'
import type { IconProps } from './Icon.vue'
import type { DynamicSlots } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type ProgressGroup = ComponentConfig<typeof theme, AppConfig, 'progressGroup'>

export interface ProgressGroupItem {
  label?: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /** The part of `max` this segment takes up. */
  value?: number
  /**
   * @defaultValue 'primary'
   */
  color?: ProgressGroup['variants']['color']
  slot?: string
  class?: any
  ui?: Pick<ProgressGroup['slots'], 'segment' | 'indicator' | 'item' | 'itemLeadingIcon' | 'itemLeadingDot' | 'itemLabel' | 'itemTrailing'>
  [key: string]: any
}

export interface ProgressGroupProps<T extends ProgressGroupItem = ProgressGroupItem> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  items?: T[]
  /**
   * The value all items add up to, used to compute each segment's share of the track.
   * @defaultValue 100
   */
  max?: number
  /** Display the summed progress value. */
  status?: boolean
  /**
   * @defaultValue 'md'
   */
  size?: ProgressGroup['variants']['size']
  /**
   * @defaultValue 'primary'
   */
  color?: ProgressGroup['variants']['color']
  /**
   * The orientation of the progress bar.
   * @defaultValue 'horizontal'
   */
  orientation?: ProgressGroup['variants']['orientation']
  class?: any
  ui?: ProgressGroup['slots']
}

type SlotProps<T extends ProgressGroupItem> = (props: { item: T, index: number, percent: number }) => VNode[]

export type ProgressGroupSlots<T extends ProgressGroupItem = ProgressGroupItem> = {
  'status'?: (props: { percent: number }) => VNode[]
  'item'?: SlotProps<T>
  'item-leading'?: SlotProps<T>
  'item-label'?: SlotProps<T>
  'item-trailing'?: SlotProps<T>
} & DynamicSlots<T, 'leading' | 'label' | 'trailing', { index: number, percent: number }>

</script>

<script setup lang="ts" generic="T extends ProgressGroupItem">
import { computed } from 'vue'
import { Primitive, ProgressRoot, ProgressIndicator } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'

const _props = withDefaults(defineProps<ProgressGroupProps<T>>(), {
  orientation: 'horizontal'
})
const slots = defineSlots<ProgressGroupSlots<T>>()

const props = useComponentProps<ProgressGroupProps<T>>('progressGroup', _props)

const appConfig = useAppConfig() as ProgressGroup['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.progressGroup || {}) })({
  size: props.size,
  color: props.color,
  orientation: props.orientation
}))

// `ProgressRoot` logs an error and falls back to 100 for a `max` that isn't a positive
// number, so resolve it here to keep the segment widths and the console quiet.
// eslint-disable-next-line vue/no-dupe-keys
const max = computed(() => {
  const value = Number(props.max ?? 100)

  return Number.isFinite(value) && value > 0 ? value : 100
})

// `ProgressRoot` turns a value below `0` or above `max` into `null`, which reads as
// indeterminate, so clamp before handing it over.
const values = computed(() => (props.items ?? []).map(item => Math.min(Math.max(Number(item.value) || 0, 0), max.value)))

const percents = computed(() => values.value.map(value => (value / max.value) * 100))

const percent = computed(() => Math.min(100, Math.round(percents.value.reduce((total, value) => total + value, 0))))

const statusStyle = computed(() => {
  const value = `${percent.value}%`

  return props.orientation === 'vertical' ? { height: value } : { width: value }
})

const hasList = computed(() => (props.items ?? []).some(item => item.label || item.icon || item.slot)
  || !!slots.item || !!slots['item-leading'] || !!slots['item-label'] || !!slots['item-trailing'])

function segmentStyle(index: number) {
  const value = `${percents.value[index] ?? 0}%`

  return props.orientation === 'vertical' ? { height: value } : { width: value }
}

// `ProgressRoot` derives `aria-label` from `getValueLabel`, so name each segment after
// its item and keep reka's percentage as the fallback.
function valueLabel(item: T) {
  return (value: number | null | undefined, valueMax: number) => item.label
    ?? (typeof value === 'number' ? `${Math.round((value / valueMax) * 100)}%` : undefined)
}
</script>

<template>
  <Primitive :as="props.as" :data-orientation="props.orientation" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="props.status || !!slots.status" data-slot="status" :class="ui.status({ class: props.ui?.status })" :style="statusStyle">
      <slot name="status" :percent="percent">
        {{ percent }}%
      </slot>
    </div>

    <div data-slot="base" :class="ui.base({ class: props.ui?.base })">
      <ProgressRoot
        v-for="(item, index) in props.items"
        :key="index"
        :model-value="values[index]"
        :max="max"
        :get-value-label="valueLabel(item)"
        data-slot="segment"
        :class="ui.segment({ class: [props.ui?.segment, item.ui?.segment, item.class] })"
        :style="segmentStyle(index)"
      >
        <ProgressIndicator data-slot="indicator" :class="ui.indicator({ color: item.color || props.color, class: [props.ui?.indicator, item.ui?.indicator] })" />
      </ProgressRoot>
    </div>

    <ul v-if="hasList" data-slot="list" :class="ui.list({ class: props.ui?.list })">
      <li v-for="(item, index) in props.items" :key="index" data-slot="item" :class="ui.item({ class: [props.ui?.item, item.ui?.item] })">
        <slot :name="((item.slot || 'item') as keyof ProgressGroupSlots<T>)" :item="(item as Extract<T, { slot: string; }>)" :index="index" :percent="percents[index] ?? 0">
          <slot :name="((item.slot ? `${item.slot}-leading` : 'item-leading') as keyof ProgressGroupSlots<T>)" :item="(item as Extract<T, { slot: string; }>)" :index="index" :percent="percents[index] ?? 0">
            <UIcon v-if="item.icon" :name="item.icon" data-slot="itemLeadingIcon" :class="ui.itemLeadingIcon({ color: item.color || props.color, class: [props.ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })" />
            <span v-else data-slot="itemLeadingDot" :class="ui.itemLeadingDot({ color: item.color || props.color, class: [props.ui?.itemLeadingDot, item.ui?.itemLeadingDot] })" />
          </slot>

          <span v-if="item.label || !!slots[(item.slot ? `${item.slot}-label` : 'item-label') as keyof ProgressGroupSlots<T>]" data-slot="itemLabel" :class="ui.itemLabel({ class: [props.ui?.itemLabel, item.ui?.itemLabel] })">
            <slot :name="((item.slot ? `${item.slot}-label` : 'item-label') as keyof ProgressGroupSlots<T>)" :item="(item as Extract<T, { slot: string; }>)" :index="index" :percent="percents[index] ?? 0">
              {{ item.label }}
            </slot>
          </span>

          <span data-slot="itemTrailing" :class="ui.itemTrailing({ class: [props.ui?.itemTrailing, item.ui?.itemTrailing] })">
            <slot :name="((item.slot ? `${item.slot}-trailing` : 'item-trailing') as keyof ProgressGroupSlots<T>)" :item="(item as Extract<T, { slot: string; }>)" :index="index" :percent="percents[index] ?? 0">
              {{ Math.round(percents[index] ?? 0) }}%
            </slot>
          </span>
        </slot>
      </li>
    </ul>
  </Primitive>
</template>
