<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ChartDefinition, ChartTooltipBodySlotContext } from '@tanstack/charts/vue'
import theme from '#build/ui/chart'
import type { ComponentConfig } from '../types/tv'

type Chart = ComponentConfig<typeof theme, AppConfig, 'chart'>

export type ChartDatum = Record<string, any>

export interface ChartProps<T extends ChartDatum = ChartDatum> {
  /**
   * The type of chart to render.
   * @defaultValue 'line'
   */
  type?: Chart['variants']['type']
  /** The rows to plot, one object per x value. */
  data?: T[]
  /** The key of each row used for the x axis. */
  index?: keyof T & string
  /** The keys of each row plotted as series on the y axis. */
  categories?: (keyof T & string)[]
  /**
   * The series colors, in `categories` order. Accepts theme colors or any CSS color.
   * @defaultValue ['primary', 'secondary', 'info', 'success', 'warning', 'error']
   */
  colors?: string[]
  /** Stack the series on top of each other. Only applies to `area` and `bar`. */
  stacked?: boolean
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
  /** Display a legend. Defaults to `true` when there is more than one category. */
  legend?: boolean
  /** Format the y axis ticks. */
  format?: (value: number) => string
  /**
   * The height of the chart in pixels.
   * @defaultValue 300
   */
  height?: number
  /**
   * The width used on the server and before the container is measured.
   * @defaultValue 640
   */
  initialWidth?: number
  /** The accessible name of the chart. Defaults to the categories. */
  ariaLabel?: string
  /**
   * A complete TanStack Charts definition. Takes precedence over `data`, `index` and `categories`.
   * @see https://tanstack.com/charts/latest/docs/concepts/chart-definitions
   */
  definition?: ChartDefinition<any, any, any>
  class?: any
  ui?: Chart['slots']
}

export interface ChartSlots {
  tooltip?(props: ChartTooltipBodySlotContext<any, any, any>): VNode[]
}
</script>

<script setup lang="ts" generic="T extends ChartDatum">
import { computed } from 'vue'
import { Chart as TanStackChart } from '@tanstack/charts/vue'
import { areaY, barY, colorLegend, defineChart, group, lineY, ruleY } from '@tanstack/charts'
import { scaleBand } from '@tanstack/charts/scales/band'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { scaleOrdinal } from '@tanstack/charts/scales/ordinal'
import { scalePoint } from '@tanstack/charts/scales/point'
import { tooltip } from '@tanstack/charts/tooltip'
import { crosshair } from '@tanstack/charts/crosshair'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { tv } from '../utils/tv'

const _props = withDefaults(defineProps<ChartProps<T>>(), {
  type: 'line',
  points: false,
  grid: true,
  height: 300,
  initialWidth: 640
})
const slots = defineSlots<ChartSlots>()

const props = useComponentProps<ChartProps<T>>('chart', _props)

const appConfig = useAppConfig() as Chart['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.chart || {}) })({
  type: props.type
}))

const themeColors = computed(() => ['neutral', ...Object.keys(appConfig.ui?.colors || {})])

const seriesColors = computed(() => props.colors ?? ['primary', 'secondary', 'info', 'success', 'warning', 'error'])

// Series paint resolves through `--ts-chart-*` so it follows the theme and color mode
// without rebuilding the definition.
const style = computed(() => Object.fromEntries(seriesColors.value.map((color, i) => [
  `--ts-chart-${i + 1}`,
  themeColors.value.includes(color) ? `var(--ui-${color})` : color
])))

const seriesKeys = computed(() => props.categories ?? [])

// One row per (x, category) pair so a single mark can group, stack and color by series.
const rows = computed(() => (props.data ?? []).flatMap(datum => seriesKeys.value.map(category => ({
  x: datum[props.index!],
  category,
  value: datum[category] as number
}))))

const generatedDefinition = computed(() => {
  const multiple = seriesKeys.value.length > 1
  const color = scaleOrdinal<string, string>()
    .domain(seriesKeys.value)
    .range(seriesKeys.value.map((_, i) => `var(--ts-chart-${(i % seriesColors.value.length) + 1})`))

  const channels = { x: 'x', y: 'value', z: 'category', color: 'category' } as const

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
          ? [areaY(rows.value, { ...channels, fillOpacity: 0.2 } as any)]
          : seriesKeys.value.map(category => areaY(rows.value.filter(row => row.category === category), { ...channels, fillOpacity: 0.2 } as any))),
        crosshair({ x: true, y: false })
      ]
      break
    default:
      marks = [
        lineY(rows.value, { ...channels, strokeWidth: 2, points: props.points } as any),
        crosshair({ x: true, y: false })
      ]
  }

  return defineChart({
    marks,
    scales: {
      x: {
        scale: props.type === 'bar'
          ? () => scaleBand<string>().padding(0.2)
          : () => scalePoint<string>().padding(0)
      },
      y: {
        scale: scaleLinear,
        nice: true,
        grid: props.grid,
        axis: props.format ? { ticks: { format: props.format } } : undefined
      }
    },
    color: {
      scale: color,
      legend: (props.legend ?? multiple) ? colorLegend() : undefined
    },
    focus: multiple ? 'group-x' : undefined,
    tooltip
  } as any)
})

const chartDefinition = computed(() => (props.definition ?? generatedDefinition.value) as ChartDefinition<any, any, any>)
</script>

<template>
  <div data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })" :style="style">
    <TanStackChart
      :definition="chartDefinition"
      :aria-label="props.ariaLabel ?? seriesKeys.join(', ')"
      :height="props.height"
      :initial-width="props.initialWidth"
      :style="{ height: `${props.height}px` }"
      :class="ui.base({ class: props.ui?.base })"
    >
      <template v-if="!!slots.tooltip" #tooltipBody="slotProps">
        <slot name="tooltip" v-bind="slotProps" />
      </template>
    </TanStackChart>
  </div>
</template>
