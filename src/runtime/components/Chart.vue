<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ChartDefinition, ChartPoint } from '@tanstack/charts/vue'
import theme from '#build/ui/chart'
import type { TooltipProps } from './Tooltip.vue'
import type { ComponentConfig } from '../types/tv'

type Chart = ComponentConfig<typeof theme, AppConfig, 'chart'>

export type ChartDatum = Record<string, any>

export interface ChartTooltipRow {
  label: string
  value: string
  color?: string
  /** Whether this row is the point under the pointer. */
  active?: boolean
}

export interface ChartProps<T extends ChartDatum = ChartDatum> {
  /**
   * The type of chart to render.
   * @defaultValue 'line'
   */
  type?: Chart['variants']['type']
  /** The rows to plot, one object per x value, or per slice with `donut`. */
  data?: T[]
  /** The key of each row used for the x axis, or for the slice labels with `donut`. */
  index?: keyof T & string
  /** The keys of each row plotted as series on the y axis. With `donut`, the first key sets the slice values. */
  categories?: (keyof T & string)[]
  /**
   * The series colors, in `categories` order, or in `data` order with `donut`. Accepts theme colors or any CSS color.
   * When there are more series than colors, the colors repeat as lighter tints.
   * Defaults to the `--ui-chart-1` to `--ui-chart-6` CSS variables.
   */
  colors?: string[]
  /** Stack the series on top of each other. Only applies to `area` and `bar`. */
  stacked?: boolean
  /**
   * The shape of the line between values. Only applies to `line` and `area`.
   * @defaultValue 'linear'
   */
  curve?: 'linear' | 'monotone' | 'step'
  /**
   * Draw a dot at each value. Only applies to `line`.
   * @defaultValue false
   */
  points?: boolean
  /**
   * Display horizontal grid lines.
   * @defaultValue true
   */
  grid?: boolean
  /**
   * Display the x axis.
   * @defaultValue true
   */
  xAxis?: boolean
  /**
   * Display the y axis.
   * @defaultValue true
   */
  yAxis?: boolean
  /** Display a legend. Defaults to `true` when there is more than one category. */
  legend?: boolean
  /** Format the values on the y axis and in the tooltip. */
  format?: (value: number) => string
  /**
   * Display a tooltip on the focused values.
   * `{ content: { side: 'top', sideOffset: 12 } }`{lang="ts-type"}
   * @defaultValue true
   */
  tooltip?: boolean | TooltipProps
  /**
   * The width of the ring in pixels. Only applies to `donut`.
   * @defaultValue 24
   */
  thickness?: number
  /**
   * The height of the chart in pixels. Defaults to `300` unless `aspectRatio` is set.
   */
  height?: number
  /** The width over height ratio of the chart, used when `height` is not set. */
  aspectRatio?: number
  /** A fixed width in pixels. The chart follows its container by default. */
  width?: number
  /**
   * The width used on the server and before the container is measured.
   * @defaultValue 640
   */
  initialWidth?: number
  /** The accessible name of the chart. Defaults to the categories, set it when using `definition`. */
  ariaLabel?: string
  /** A longer description of the chart for assistive technologies. */
  ariaDescription?: string
  /**
   * A complete TanStack Charts definition. Takes precedence over `data`, `index` and `categories`.
   * When it has its own `tooltip`, that one is used in place of the `tooltip` prop.
   * @see https://tanstack.com/charts/latest/docs/concepts/chart-definitions
   */
  definition?: ChartDefinition<any, any, any>
  class?: any
  ui?: Chart['slots']
}

export interface ChartEmits {
  /** A point is selected with a click, Enter or Space. */
  select: [point: ChartPoint<any> | null]
  /** The focused point changes, with the pointer or the keyboard. */
  focusChange: [point: ChartPoint<any> | null]
  /** The points sharing the focused position change. */
  focusGroupChange: [points: readonly ChartPoint<any>[]]
}

export interface ChartSlots {
  tooltip?(props: { title?: string, rows: ChartTooltipRow[], points: ChartPoint<any>[], primaryPoint: ChartPoint<any> }): VNode[]
  center?(props?: {}): VNode[]
}
</script>

<script setup lang="ts" generic="T extends ChartDatum">
import { computed, shallowRef, useTemplateRef } from 'vue'
import { Chart as TanStackChart } from '@tanstack/charts/vue'
import { areaY, barY, colorLegend, colorLegendItems, defineChart, group, lineY, ruleY } from '@tanstack/charts'
import { scaleBand } from '@tanstack/charts/scales/band'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { scaleOrdinal } from '@tanstack/charts/scales/ordinal'
import { scalePoint } from '@tanstack/charts/scales/point'
import { crosshair } from '@tanstack/charts/crosshair'
import { pie, polar, radialArc } from '@tanstack/charts/polar'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useLocale } from '../composables/useLocale'
import { chartCurves } from '../utils/chart'
import { tv } from '../utils/tv'
import UTooltip from './Tooltip.vue'

const _props = withDefaults(defineProps<ChartProps<T>>(), {
  type: 'line',
  curve: 'linear',
  points: false,
  grid: true,
  xAxis: true,
  yAxis: true,
  tooltip: true,
  thickness: 24,
  initialWidth: 640
})
const emits = defineEmits<ChartEmits>()
const slots = defineSlots<ChartSlots>()

const props = useComponentProps<ChartProps<T>>('chart', _props)

const { dir, code } = useLocale()
const appConfig = useAppConfig() as Chart['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.chart || {}) })({
  type: props.type
}))

const themeColors = computed(() => Object.keys(appConfig.ui?.colors || {}))

// The default palette lives in CSS so it can be themed and follows the color mode.
const seriesColors = computed(() => props.colors?.length ? props.colors : Array.from({ length: 6 }, (_, i) => `var(--ui-chart-${i + 1})`))

function resolveColor(color: string) {
  // `neutral` has no `--ui-neutral` variable, the theme paints it with the inverted background.
  if (color === 'neutral') {
    return 'var(--ui-bg-inverted)'
  }

  return themeColors.value.includes(color) ? `var(--ui-${color})` : color
}

const seriesKeys = computed(() => props.categories ?? [])

// A donut has one color per row, the other types one per category.
const seriesCount = computed(() => props.type === 'donut' ? (props.data?.length ?? 0) : seriesKeys.value.length)

// Series paint resolves through `--ts-chart-*` so it follows the theme and color mode
// without rebuilding the definition. Past the last color, each round is a lighter tint
// of the same colors so two series never share one.
const style = computed(() => Object.fromEntries(Array.from({ length: Math.max(seriesCount.value, seriesColors.value.length) }, (_, i) => {
  const color = resolveColor(seriesColors.value[i % seriesColors.value.length]!)
  const round = Math.floor(i / seriesColors.value.length)

  return [`--ts-chart-${i + 1}`, round ? `color-mix(in oklab, ${color} ${Math.max(100 - round * 35, 25)}%, var(--ui-bg))` : color]
})))

// One row per (x, category) pair so a single mark can group, stack and color by series.
const rows = computed(() => (props.data ?? []).flatMap(datum => seriesKeys.value.map(category => ({
  x: datum[props.index!],
  category,
  value: datum[category] as number
}))))

function formatValue(value: number) {
  return props.format ? props.format(value) : new Intl.NumberFormat(code.value).format(value)
}

// The default legend stretches its items over the full width.
const legendGuide = colorLegend({ items: colorLegendItems({ justify: 'center', gap: 16 }) })

// Slices are colored by label rather than by series.
const donutDefinition = computed(() => {
  const labels = (props.data ?? []).map(datum => String(datum[props.index!]))
  const slices = pie(props.data ?? [], { value: seriesKeys.value[0]! } as any)

  return defineChart({
    marks: [
      polar({
        marks: [
          radialArc(slices, {
            innerRadius: ({ radius }: { radius: number }) => Math.max(radius - props.thickness!, 0),
            color: props.index,
            key: props.index
          } as any)
        ],
        scales: { angle: null, radius: null }
      })
    ],
    scales: { x: null, y: null },
    color: {
      scale: scaleOrdinal<string, string>()
        .domain(labels)
        .range(labels.map((_, i) => `var(--ts-chart-${i + 1})`)),
      legend: props.legend ? legendGuide : undefined
    }
  } as any)
})

const generatedDefinition = computed(() => {
  if (props.type === 'donut') {
    return donutDefinition.value
  }

  const multiple = seriesKeys.value.length > 1
  const color = scaleOrdinal<string, string>()
    .domain(seriesKeys.value)
    .range(seriesKeys.value.map((_, i) => `var(--ts-chart-${i + 1})`))

  const channels = { x: 'x', y: 'value', z: 'category', color: 'category' } as const
  const curve = props.curve === 'linear' ? undefined : chartCurves[props.curve!]

  let marks: any[]
  switch (props.type) {
    case 'bar':
      marks = [
        barY(rows.value, { ...channels, inset: 1, ...(props.stacked ? { radius: { end: 4, stack: 'outer' } } : { radius: { end: 4 }, layout: group({ padding: 0.1 }) }) } as any),
        ruleY([0])
      ]
      break
    case 'area':
      // Repeated x positions stack inside one area mark, so overlapping areas need a mark per series.
      marks = [
        ...(props.stacked
          ? [areaY(rows.value, { ...channels, curve, fillOpacity: 0.2 } as any)]
          : seriesKeys.value.map(category => areaY(rows.value.filter(row => row.category === category), { ...channels, curve, fillOpacity: 0.2 } as any))),
        crosshair({ x: true, y: false })
      ]
      break
    default:
      marks = [
        lineY(rows.value, { ...channels, curve, strokeWidth: 2, points: props.points } as any),
        crosshair({ x: true, y: false })
      ]
  }

  return defineChart({
    marks,
    scales: {
      x: {
        scale: props.type === 'bar'
          ? () => scaleBand<string>().padding(0.2)
          : () => scalePoint<string>().padding(0),
        // Axis sides stay physical in a right-to-left container, so the range and the y axis flip here.
        reverse: dir.value === 'rtl',
        axis: props.xAxis ? undefined : false
      },
      y: {
        scale: scaleLinear,
        nice: true,
        grid: props.grid,
        side: dir.value === 'rtl' ? 'right' : 'left',
        axis: !props.yAxis ? false : props.format ? { ticks: { format: props.format } } : undefined
      }
    },
    color: {
      scale: color,
      legend: (props.legend ?? multiple) ? legendGuide : undefined
    },
    focus: 'group-x'
  } as any)
})

// TanStack Charts reports the focused points and the tooltip is ours: a `UTooltip` anchored on the primary point.
const rootRef = useTemplateRef('rootRef')
const primaryPoint = shallowRef<ChartPoint<any> | null>(null)
const groupPoints = shallowRef<readonly ChartPoint<any>[]>([])

const tooltipPoints = computed(() => {
  if (!primaryPoint.value) {
    return []
  }

  return groupPoints.value.includes(primaryPoint.value) ? [...groupPoints.value] : [primaryPoint.value]
})

const tooltipContent = computed<{ title?: string, rows: ChartTooltipRow[] }>(() => {
  const points = tooltipPoints.value
  const generated = !props.definition

  if (generated && props.type === 'donut') {
    return {
      rows: points.map(point => ({ label: String(point.datum[props.index!]), value: formatValue(point.datum.value), color: point.color }))
    }
  }

  return {
    title: String((generated ? points[0]?.datum.x : points[0]?.xValue) ?? ''),
    rows: points.map(point => ({
      label: generated ? String(point.datum.category) : point.groupLabel,
      value: generated ? formatValue(point.datum.value) : String(point.yValue),
      color: point.color,
      active: points.length > 1 && point === primaryPoint.value
    }))
  }
})

// Point coordinates are in scene pixels, which match the host box. The reference keeps its identity
// and reads the last focused point: Reka remounts the content when the reference changes.
let anchor = { x: 0, y: 0 }
const tooltipReference = {
  getBoundingClientRect: () => {
    if (primaryPoint.value) {
      anchor = { x: primaryPoint.value.x, y: primaryPoint.value.y }
    }

    const rect = rootRef.value?.getBoundingClientRect()

    return DOMRect.fromRect({ x: (rect?.left ?? 0) + anchor.x, y: (rect?.top ?? 0) + anchor.y, width: 0, height: 0 })
  }
}

const tooltipProps = computed(() => typeof props.tooltip === 'object' ? props.tooltip : {})

// A definition can bring the TanStack Charts tooltip with its own content, two tooltips would show.
const hasTooltip = computed(() => !!props.tooltip && !(props.definition as { tooltip?: unknown } | undefined)?.tooltip)

const chartHeight = computed(() => props.height ?? (props.aspectRatio ? undefined : 300))

// The Vue adapter sets both sizes without a unit on its host, which the browser drops.
const chartStyle = computed(() => ({
  height: chartHeight.value ? `${chartHeight.value}px` : undefined,
  width: props.width ? `${props.width}px` : undefined
}))

function onFocusChange(point: ChartPoint<any> | null) {
  primaryPoint.value = point
  emits('focusChange', point)
}

function onFocusGroupChange(points: readonly ChartPoint<any>[]) {
  groupPoints.value = points
  emits('focusGroupChange', points)
}

// Reka keeps a visually hidden copy of the content for assistive technologies and does not update it from the slot.
const tooltipLabel = computed(() => [tooltipContent.value.title, ...tooltipContent.value.rows.map(row => `${row.label} ${row.value}`)].filter(Boolean).join(', '))

const chartDefinition = computed(() => (props.definition ?? generatedDefinition.value) as ChartDefinition<any, any, any>)
</script>

<template>
  <div ref="rootRef" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })" :style="style">
    <TanStackChart
      :definition="chartDefinition"
      :aria-label="props.ariaLabel || seriesKeys.join(', ') || 'Chart'"
      :aria-description="props.ariaDescription"
      :height="chartHeight"
      :aspect-ratio="props.aspectRatio"
      :width="props.width"
      :initial-width="props.initialWidth"
      :style="chartStyle"
      :class="ui.base({ class: props.ui?.base })"
      :on-focus-change="onFocusChange"
      :on-focus-group-change="onFocusGroupChange"
      :on-select="(point: ChartPoint<any> | null) => emits('select', point)"
    />

    <UTooltip
      v-if="hasTooltip"
      :open="!!primaryPoint"
      :reference="tooltipReference"
      :portal="false"
      v-bind="tooltipProps"
      :content="{ side: 'top', sideOffset: 12, updatePositionStrategy: 'always', ariaLabel: tooltipLabel, ...tooltipProps.content }"
      :ui="{ ...tooltipProps.ui, content: ui.tooltip({ class: [tooltipProps.ui?.content, props.ui?.tooltip] }) }"
    >
      <template #content>
        <slot v-if="primaryPoint" name="tooltip" v-bind="tooltipContent" :points="tooltipPoints" :primary-point="primaryPoint">
          <p v-if="tooltipContent.title" data-slot="tooltipTitle" :class="ui.tooltipTitle({ class: props.ui?.tooltipTitle })">
            {{ tooltipContent.title }}
          </p>

          <div
            v-for="(row, rowIndex) in tooltipContent.rows"
            :key="rowIndex"
            data-slot="tooltipRow"
            :data-active="row.active === true"
            :class="ui.tooltipRow({ class: props.ui?.tooltipRow })"
          >
            <span data-slot="tooltipIndicator" :class="ui.tooltipIndicator({ class: props.ui?.tooltipIndicator })" :style="{ backgroundColor: row.color }" />
            <span data-slot="tooltipLabel" :class="ui.tooltipLabel({ class: props.ui?.tooltipLabel })">{{ row.label }}</span>
            <span data-slot="tooltipValue" :class="ui.tooltipValue({ class: props.ui?.tooltipValue })">{{ row.value }}</span>
          </div>
        </slot>
      </template>
    </UTooltip>

    <div v-if="!!slots.center" data-slot="center" :class="ui.center({ class: props.ui?.center })">
      <slot name="center" />
    </div>
  </div>
</template>
