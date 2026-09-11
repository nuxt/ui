<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/page-stat'
import type { IconProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type PageStat = ComponentConfig<typeof theme, AppConfig, 'pageStat'>

export interface PageStatProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The icon displayed next to the title.
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /**
   * The title of the stat.
   */
  title?: string
  /**
   * The main value to display.
   */
  value?: string | number
  /**
   * The trend percentage value (e.g. `12.5` renders as `+12.5%`).
   */
  trend?: number
  /**
   * The direction of the trend. Defaults to `'up'` when `trend >= 0` and `'down'` otherwise.
   */
  trendDirection?: 'up' | 'down'
  /**
   * The current progress value. When defined, a progress bar is displayed.
   */
  current?: number
  /**
   * The maximum progress value.
   * @defaultValue 100
   */
  max?: number
  /**
   * Show the `current / max` label when a progress bar is displayed.
   * @defaultValue true
   */
  showLabel?: boolean
  /**
   * The color of the progress bar. Defaults to the component `color`.
   */
  progressColor?: PageStat['variants']['color']
  /**
   * The data points used to render a sparkline chart.
   */
  data?: number[]
  /**
   * The stroke width of the sparkline path.
   * @defaultValue 2
   */
  strokeWidth?: number
  /**
   * Fill the area under the sparkline.
   * @defaultValue false
   */
  showArea?: boolean
  /**
   * The height of the sparkline chart in pixels.
   * @defaultValue 40
   */
  height?: number
  /**
   * @defaultValue 'primary'
   */
  color?: PageStat['variants']['color']
  /**
   * @defaultValue 'md'
   */
  size?: PageStat['variants']['size']
  /**
   * @defaultValue 'outline'
   */
  variant?: PageStat['variants']['variant']
  class?: any
  ui?: PageStat['slots']
}

export interface PageStatSlots {
  icon?(props: { ui: PageStat['ui'] }): VNode[]
  title?(props: { title?: string, ui: PageStat['ui'] }): VNode[]
  value?(props: { value?: string | number, ui: PageStat['ui'] }): VNode[]
  label?(props: { current: number, max: number, ui: PageStat['ui'] }): VNode[]
  trend?(props: { trend?: number, trendDirection: 'up' | 'down', ui: PageStat['ui'] }): VNode[]
  progress?(props: { current: number, max: number, percent: number, ui: PageStat['ui'] }): VNode[]
  sparkline?(props: { path: string, areaPath: string, viewBox: string, zeroLine: string | null, ui: PageStat['ui'] }): VNode[]
  default?(props: { ui: PageStat['ui'] }): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UProgress from './Progress.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PageStatProps>(), {
  max: 100,
  showLabel: true,
  strokeWidth: 2,
  showArea: false,
  height: 40,
  size: 'md',
  color: 'primary',
  variant: 'outline'
})

const slots = defineSlots<PageStatSlots>()

const appConfig = useAppConfig() as PageStat['AppConfig']
const uiProp = useComponentUI('pageStat', props)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.pageStat || {}) })({
  size: props.size,
  color: props.color,
  variant: props.variant
}))

const hasValue = computed(() => props.value !== undefined && props.value !== null)
const hasCurrent = computed(() => props.current !== undefined && props.current !== null)
const hasTrend = computed(() => props.trend !== undefined && props.trend !== null)
const hasData = computed(() => !!props.data?.length)

const displayValue = computed(() => hasValue.value ? props.value : props.current)

const effectiveTrendDirection = computed<'up' | 'down'>(() => {
  if (props.trendDirection) {
    return props.trendDirection
  }
  if (hasTrend.value) {
    return props.trend! >= 0 ? 'up' : 'down'
  }
  return 'up'
})

const trendColor = computed(() => {
  if (!hasTrend.value) return ''
  return effectiveTrendDirection.value === 'up'
    ? 'text-success-500! dark:text-success-400!'
    : 'text-error-500! dark:text-error-400!'
})

const trendIcon = computed(() => effectiveTrendDirection.value === 'up' ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down')

const formattedTrend = computed(() => {
  if (!hasTrend.value) return ''
  const sign = props.trend! >= 0 ? '+' : ''
  return `${sign}${props.trend}%`
})

const percent = computed(() => {
  if (!hasCurrent.value || props.max === 0) return 0
  return Math.min(Math.max((props.current! / props.max) * 100, 0), 100)
})

const progressColor = computed(() => props.progressColor || props.color)

const sparklineData = computed(() => {
  const width = 100
  const height = props.height
  const padding = 2
  const viewBox = `0 0 ${width} ${height}`
  const empty = { path: '', areaPath: '', viewBox, zeroLine: null as string | null }

  if (!props.data?.length) return empty

  const values = props.data
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const availableHeight = height - padding * 2

  let zeroLineY: number | null = null
  if (min < 0 && max > 0) {
    const normalizedZero = (0 - min) / range
    zeroLineY = height - padding - (normalizedZero * availableHeight)
    zeroLineY = Math.min(Math.max(zeroLineY, padding), height - padding)
  }

  const points = values.map((value, index) => {
    const x = values.length === 1
      ? width / 2
      : (index / (values.length - 1)) * (width - padding * 2) + padding
    const normalizedValue = range === 0 ? 0.5 : (value - min) / range
    const y = height - (normalizedValue * availableHeight) - padding
    return `${x},${y}`
  })

  const firstPoint = points[0]!
  const lastPoint = points[points.length - 1]!
  const firstX = Number.parseFloat(firstPoint.split(',')[0]!)
  const lastX = lastPoint.split(',')[0]!

  const path = `M ${points.join(' L ')}`
  const areaPath = `M ${firstPoint} L ${points.join(' L ')} L ${lastX},${height} L ${firstX},${height} Z`
  const zeroLine = zeroLineY !== null ? `M ${padding},${zeroLineY} L ${width - padding},${zeroLineY}` : null

  return { path, areaPath, viewBox, zeroLine }
})
</script>

<template>
  <Primitive
    :as="as"
    data-slot="root"
    :class="ui.root({ class: [uiProp?.root, props.class] })"
    v-bind="$attrs"
  >
    <div
      v-if="icon || title || hasValue || hasCurrent || hasTrend || !!slots.icon || !!slots.title || !!slots.value || !!slots.trend"
      data-slot="header"
      :class="ui.header({ class: uiProp?.header })"
    >
      <div v-if="icon || !!slots.icon" data-slot="icon" :class="ui.icon({ class: uiProp?.icon })">
        <slot name="icon" :ui="ui">
          <UIcon v-if="icon" :name="icon" data-slot="iconIcon" :class="ui.iconIcon({ class: uiProp?.iconIcon })" />
        </slot>
      </div>

      <div data-slot="content" :class="ui.content({ class: uiProp?.content })">
        <div v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: uiProp?.title })">
          <slot name="title" :title="title" :ui="ui">
            {{ title }}
          </slot>
        </div>

        <div v-if="hasValue || hasCurrent || !!slots.value" data-slot="value" :class="ui.value({ class: uiProp?.value })">
          <slot name="value" :value="displayValue" :ui="ui">
            {{ displayValue }}
          </slot>
        </div>

        <div v-if="showLabel && (hasCurrent || !!slots.label)" data-slot="label" :class="ui.label({ class: uiProp?.label })">
          <slot name="label" :current="current!" :max="max" :ui="ui">
            {{ current }} / {{ max }}
          </slot>
        </div>

        <div
          v-if="hasTrend || !!slots.trend"
          data-slot="trend"
          :class="[ui.trend({ class: uiProp?.trend }), trendColor]"
        >
          <slot name="trend" :trend="trend" :trend-direction="effectiveTrendDirection" :ui="ui">
            <UIcon :name="trendIcon" data-slot="trendIcon" :class="[ui.trendIcon({ class: uiProp?.trendIcon }), trendColor]" />
            <span data-slot="trendValue" :class="ui.trendValue({ class: uiProp?.trendValue })">
              {{ formattedTrend }}
            </span>
          </slot>
        </div>
      </div>
    </div>

    <div v-if="hasCurrent || !!slots.progress" data-slot="progress" :class="ui.progress({ class: uiProp?.progress })">
      <slot name="progress" :current="current!" :max="max" :percent="percent" :ui="ui">
        <UProgress :model-value="percent" :color="progressColor" :size="size" />
      </slot>
    </div>

    <div v-if="hasData || !!slots.sparkline" data-slot="sparkline" :class="ui.sparkline({ class: uiProp?.sparkline })">
      <slot
        name="sparkline"
        :path="sparklineData.path"
        :area-path="sparklineData.areaPath"
        :view-box="sparklineData.viewBox"
        :zero-line="sparklineData.zeroLine"
        :ui="ui"
      >
        <svg
          data-slot="sparklineSvg"
          :class="ui.sparklineSvg({ class: uiProp?.sparklineSvg })"
          :viewBox="sparklineData.viewBox"
          preserveAspectRatio="none"
          :style="{ height: `${height}px` }"
        >
          <path
            v-if="sparklineData.zeroLine"
            data-slot="sparklineZeroLine"
            :d="sparklineData.zeroLine"
            :class="ui.sparklineZeroLine({ class: uiProp?.sparklineZeroLine })"
            fill="none"
            stroke-width="1"
            stroke-dasharray="3 3"
          />
          <path
            v-if="showArea"
            data-slot="sparklineArea"
            :d="sparklineData.areaPath"
            :class="ui.sparklineArea({ class: uiProp?.sparklineArea })"
          />
          <path
            data-slot="sparklinePath"
            :d="sparklineData.path"
            :class="ui.sparklinePath({ class: uiProp?.sparklinePath })"
            fill="none"
            :stroke-width="strokeWidth"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </slot>
    </div>

    <slot :ui="ui" />
  </Primitive>
</template>
