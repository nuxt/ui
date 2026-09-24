import { computed, defineComponent, h } from 'vue'
import type { PropType } from 'vue'
import { Chart as TanStackChart } from '@tanstack/charts/vue'
import { colorLegend, defineChart } from '@tanstack/charts'
import { scaleOrdinal } from '@tanstack/charts/scales/ordinal'
import { tooltip } from '@tanstack/charts/tooltip'
import { pie, polar, radialArc } from '@tanstack/charts/polar'

export interface ChartDonutOptions {
  data: Record<string, any>[]
  index: string
  value: string
  thickness: number
  colors: number
  legend?: boolean
}

// Slices are colored by label rather than by series.
function createDonutDefinition({ data, index, value, thickness, colors, legend }: ChartDonutOptions) {
  const labels = data.map(datum => String(datum[index]))

  return defineChart({
    marks: [
      polar({
        marks: [
          radialArc(pie(data, { value } as any), {
            innerRadius: ({ radius }: { radius: number }) => Math.max(radius - thickness, 0),
            color: index,
            key: index
          } as any)
        ],
        scales: { angle: null, radius: null }
      })
    ],
    scales: { x: null, y: null },
    color: {
      scale: scaleOrdinal<string, string>()
        .domain(labels)
        .range(labels.map((_, i) => `var(--ts-chart-${(i % colors) + 1})`)),
      legend: legend ? colorLegend() : undefined
    },
    tooltip
  } as any)
}

/**
 * The polar geometry only ships with this module, which `Chart.vue` loads on demand
 * so line, area and bar charts don't carry it.
 */
export const ChartDonut = defineComponent({
  name: 'ChartDonut',
  inheritAttrs: false,
  props: {
    options: { type: Object as PropType<ChartDonutOptions>, required: true }
  },
  setup(props, { attrs, slots }) {
    const definition = computed(() => createDonutDefinition(props.options))

    return () => h(TanStackChart as any, { ...attrs, definition: definition.value }, slots)
  }
})
