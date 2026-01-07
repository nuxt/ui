<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/stat-card'
import type { IconProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type StatCard = ComponentConfig<typeof theme, AppConfig, 'statCard'>

export interface StatCardProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The icon to display.
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /**
   * The title/label of the stat.
   */
  title?: string
  /**
   * The main value to display.
   */
  value?: string | number
  /**
   * The trend percentage value (e.g., 12.5 for +12.5%).
   */
  trend?: number
  /**
   * The direction of the trend. If not provided, it will be automatically
   * calculated based on the trend value (negative = 'down', positive/zero = 'up').
   */
  trendDirection?: 'up' | 'down'
  /**
   * The current progress value (for progress bar).
   */
  current?: number
  /**
   * The maximum progress value (for progress bar).
   * @defaultValue 100
   */
  max?: number
  /**
   * Show the "current / max" label when progress bar is displayed.
   * @defaultValue true
   */
  showLabel?: boolean
  /**
   * Color for the progress bar (inherits color by default).
   */
  progressColor?: StatCard['variants']['color']
  /**
   * Array of numbers for the sparkline chart.
   */
  data?: number[]
  /**
   * Stroke width of the sparkline.
   * @defaultValue 2
   */
  strokeWidth?: number
  /**
   * Show area under the sparkline.
   * @defaultValue false
   */
  showArea?: boolean
  /**
   * Height of the sparkline chart.
   */
  height?: number
  /**
   * @defaultValue 'primary'
   */
  color?: StatCard['variants']['color']
  /**
   * @defaultValue 'md'
   */
  size?: StatCard['variants']['size']
  /**
   * @defaultValue 'outline'
   */
  variant?: StatCard['variants']['variant']
  class?: any
  ui?: StatCard['slots']
}

export interface StatCardSlots {
  icon(props: { ui: StatCard['ui'] }): any
  title(props: { title?: string, ui: StatCard['ui'] }): any
  value(props: { value?: string | number, ui: StatCard['ui'] }): any
  label(props: { current: number, max: number, ui: StatCard['ui'] }): any
  progress(props: { current: number, max: number, percent: number, ui: StatCard['ui'] }): any
  sparkline(props: { path: string, areaPath: string, viewBox: string, zeroLine: string | null, ui: StatCard['ui'] }): any
  trend(props: { trend?: number, trendDirection?: 'up' | 'down', ui: StatCard['ui'] }): any
  default(props: { ui: StatCard['ui'] }): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UProgress from './Progress.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<StatCardProps>(), {
  max: 100,
  showLabel: true,
  strokeWidth: 2,
  showArea: false,
  size: 'md',
  color: 'primary',
  variant: 'outline'
})

const slots = defineSlots<StatCardSlots>()

const appConfig = useAppConfig() as StatCard['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.statCard || {}) })({
  size: props.size,
  color: props.color,
  variant: props.variant
}))

// Auto-calculate trendDirection from trend value if not explicitly provided
const effectiveTrendDirection = computed(() => {
  // If explicitly provided, use it
  if (props.trendDirection !== undefined) {
    return props.trendDirection
  }
  // Otherwise, infer from trend value
  if (props.trend !== undefined && props.trend !== null) {
    return props.trend >= 0 ? 'up' : 'down'
  }
  return 'up'
})

const trendColor = computed(() => {
  if (props.trend === undefined || props.trend === null) return ''
  return effectiveTrendDirection.value === 'up' ? '!text-success-500 dark:!text-success-400' : '!text-error-500 dark:!text-error-400'
})

const trendIcon = computed(() => {
  return effectiveTrendDirection.value === 'up' ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'
})

const formattedTrend = computed(() => {
  if (props.trend === undefined || props.trend === null) return ''
  const sign = props.trend >= 0 ? '+' : ''
  return `${sign}${props.trend}%`
})

const percent = computed(() => {
  if (props.current === undefined || props.current === null || props.max === 0) return 0
  return Math.min(Math.max((props.current / props.max) * 100, 0), 100)
})

const progressColor = computed(() => props.progressColor || props.color)

// Sparkline calculations
const sparklineData = computed(() => {
  if (!props.data || props.data.length === 0) return { path: '', areaPath: '', viewBox: '0 0 100 40', zeroLine: null }

  const values = props.data
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const width = 100
  const height = props.height || 40
  const padding = 2

  // Check if we need to show zero line (when there are negative values)
  const hasNegativeValues = min < 0
  let zeroLineY: number | null = null

  if (hasNegativeValues && max > 0 && range > 0) {
    // Calculate where zero should be positioned
    // Normalize zero value: (0 - min) / range gives us where zero is in the range [0, 1]
    const normalizedZero = (0 - min) / range
    // Convert to Y coordinate: invert because SVG Y increases downward
    // We want zero at the bottom when it's the minimum, at the top when it's the maximum
    const availableHeight = height - padding * 2
    zeroLineY = height - padding - (normalizedZero * availableHeight)

    // Ensure zeroLineY is within bounds
    if (zeroLineY < padding) zeroLineY = padding
    if (zeroLineY > height - padding) zeroLineY = height - padding
  }

  const points: string[] = []

  values.forEach((value, index) => {
    const x = values.length === 1
      ? width / 2
      : (index / (values.length - 1)) * (width - padding * 2) + padding
    const normalizedValue = range === 0 ? 0.5 : (value - min) / range
    const y = height - (normalizedValue * (height - padding * 2)) - padding

    points.push(`${x},${y}`)
  })

  if (points.length === 0) return { path: '', areaPath: '', viewBox: `0 0 ${width} ${height}`, zeroLine: null }

  const path = `M ${points.join(' L ')}`
  const firstPoint = points[0]
  const lastPoint = points[points.length - 1]

  if (!firstPoint || !lastPoint) return { path: '', areaPath: '', viewBox: `0 0 ${width} ${height}`, zeroLine: null }

  const firstXStr = firstPoint.split(',')[0]
  const lastXStr = lastPoint.split(',')[0]

  if (!firstXStr || !lastXStr) return { path: '', areaPath: '', viewBox: `0 0 ${width} ${height}`, zeroLine: null }

  const firstX = Number.parseFloat(firstXStr)
  const areaPath = `M ${firstPoint} L ${points.join(' L ')} L ${lastXStr},${height} L ${firstX},${height} Z`
  const viewBox = `0 0 ${width} ${height}`

  return { path, areaPath, viewBox, zeroLine: zeroLineY !== null ? `M ${padding},${zeroLineY} L ${width - padding},${zeroLineY}` : null }
})
</script>

<template>
  <Primitive
    :as="as"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    v-bind="$attrs"
  >
    <div v-if="icon || !!slots.icon || title || !!slots.title || (value !== undefined && value !== null) || !!slots.value || (trend !== undefined && trend !== null) || !!slots.trend || (current !== undefined && current !== null)" data-slot="header" :class="ui.header({ class: props.ui?.header })">
      <div v-if="icon || !!slots.icon" data-slot="icon" :class="ui.icon({ class: props.ui?.icon })">
        <slot name="icon" :ui="ui">
          <UIcon v-if="icon" :name="icon" data-slot="iconIcon" :class="(ui as any).iconIcon({ class: (props.ui as any)?.iconIcon })" />
        </slot>
      </div>

      <div data-slot="content" :class="ui.content({ class: props.ui?.content })">
        <div v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
          <slot name="title" :title="title" :ui="ui">
            {{ title }}
          </slot>
        </div>

        <div v-if="(value !== undefined && value !== null) || (current !== undefined && current !== null && value === undefined) || !!slots.value" data-slot="value" :class="ui.value({ class: props.ui?.value })">
          <slot name="value" :value="value !== undefined && value !== null ? value : current" :ui="ui">
            {{ value !== undefined && value !== null ? value : current }}
          </slot>
        </div>

        <div v-if="showLabel && ((current !== undefined && current !== null) || !!slots.label)" data-slot="label" :class="ui.label({ class: props.ui?.label })">
          <slot name="label" :current="current!" :max="max" :ui="ui">
            {{ current }} / {{ max }}
          </slot>
        </div>

        <div v-if="(trend !== undefined && trend !== null) || !!slots.trend" data-slot="trend" :class="[ui.trend({ class: props.ui?.trend }), trendColor]">
          <slot name="trend" :trend="trend" :trend-direction="effectiveTrendDirection" :ui="ui">
            <UIcon :name="trendIcon" data-slot="trendIcon" :class="[ui.trendIcon({ class: props.ui?.trendIcon }), trendColor]" />
            <span data-slot="trendValue" :class="ui.trendValue({ class: props.ui?.trendValue })">
              {{ formattedTrend }}
            </span>
          </slot>
        </div>
      </div>
    </div>

    <div v-if="!!slots.progress || (current !== undefined && current !== null)" data-slot="progress" :class="ui.progress({ class: props.ui?.progress })">
      <slot name="progress" :current="current!" :max="max" :percent="percent" :ui="ui">
        <UProgress :model-value="percent" :color="progressColor" :size="size" />
      </slot>
    </div>

    <div v-if="!!slots.sparkline || (data && data.length > 0)" data-slot="sparkline" :class="(ui as any).sparkline({ class: (props.ui as any)?.sparkline })">
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
          :class="(ui as any).sparklineSvg({ class: (props.ui as any)?.sparklineSvg })"
          :viewBox="sparklineData.viewBox"
          preserveAspectRatio="none"
          :style="{ height: `${props.height || 40}px` }"
        >
          <path
            v-if="sparklineData.zeroLine"
            data-slot="sparklineZeroLine"
            :d="sparklineData.zeroLine"
            :class="(ui as any).sparklineZeroLine?.({ class: (props.ui as any)?.sparklineZeroLine }) || 'stroke-default dark:stroke-default'"
            fill="none"
            stroke-width="1"
            stroke-dasharray="3 3"
          />
          <path
            v-if="showArea"
            data-slot="sparklineArea"
            :d="sparklineData.areaPath"
            :class="(ui as any).sparklineArea({ class: (props.ui as any)?.sparklineArea })"
          />
          <path
            data-slot="sparklinePath"
            :d="sparklineData.path"
            :class="(ui as any).sparklinePath({ class: (props.ui as any)?.sparklinePath })"
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
