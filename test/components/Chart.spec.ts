import { defineComponent, ref } from 'vue'
import { TooltipProvider } from 'reka-ui'
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Chart from '../../src/runtime/components/Chart.vue'
import { renderEach } from '../component-render'
import { defineChart } from '@tanstack/charts'
import theme from '#build/ui/chart'
import ar from '../../src/runtime/locale/ar'

describe('Chart', () => {
  const types = Object.keys(theme.variants.type) as any

  const props = {
    data: [
      { month: 'Jan', desktop: 186, mobile: 80 },
      { month: 'Feb', desktop: 305, mobile: 200 },
      { month: 'Mar', desktop: 237, mobile: 120 }
    ],
    index: 'month',
    categories: ['desktop', 'mobile'],
    ariaLabel: 'Visitors',
    // `UTooltip` needs the `TooltipProvider` from `UApp`, covered on its own below.
    tooltip: false
  }

  // First in the file and unmounted after: `useLocale` is shared on the client, so a
  // mounted component from an earlier test would keep serving its `ltr` context.
  it('flips the x axis and moves the y axis to the right in rtl', async () => {
    const wrapper = await mountSuspended(Chart, {
      props,
      global: { provide: { [Symbol.for('nuxt-ui.locale-context')]: ref(ar) } }
    })

    const x = (key: string) => Number(wrapper.find(`[data-ts-key="${key}"]`).attributes('x'))
    expect(x('x-tick-label:string:3:Jan')).toBeGreaterThan(x('x-tick-label:string:3:Feb'))
    expect(Number(wrapper.find('[data-ts-key="y-axis"]').attributes('x1'))).toBeGreaterThan(x('x-tick-label:string:3:Feb'))

    wrapper.unmount()
  })

  renderEach(Chart, [
    // Props
    ...types.map((type: string) => [`with type ${type}`, { props: { ...props, type } }]),
    ['with type donut and center slot', { props: { tooltip: false, data: props.data, type: 'donut', index: 'month', categories: ['desktop'], thickness: 12, ariaLabel: 'Desktop' }, slots: { center: () => 'Center slot' } }],
    ['with type donut without legend', { props: { tooltip: false, data: props.data, type: 'donut', index: 'month', categories: ['desktop'], legend: false, ariaLabel: 'Desktop' } }],
    ['with type donut and repeated colors', { props: { tooltip: false, data: [...props.data, ...props.data.map(row => ({ ...row, month: `${row.month} 2` }))], type: 'donut', index: 'month', categories: ['desktop'], colors: ['primary'], ariaLabel: 'Desktop' } }],
    ['with stacked bar', { props: { ...props, type: 'bar', stacked: true } }],
    ['with stacked area', { props: { ...props, type: 'area', stacked: true } }],
    ['with curve monotone', { props: { ...props, curve: 'monotone' } }],
    ['with curve step', { props: { ...props, curve: 'step' } }],
    ['with curve monotone area', { props: { ...props, type: 'area', curve: 'monotone' } }],
    ['with points', { props: { ...props, points: true } }],
    ['without grid', { props: { ...props, grid: false } }],
    ['without axes', { props: { ...props, xAxis: false, yAxis: false } }],
    ['with axis labels', { props: { ...props, xLabel: 'Month', yLabel: 'Visitors' } }],
    ['without legend', { props: { ...props, legend: false } }],
    ['with colors', { props: { ...props, colors: ['success', '#8b5cf6'] } }],
    ['with categories objects', { props: { ...props, categories: ['desktop', { key: 'mobile', label: 'Mobile', color: 'error' }] } }],
    ['with neutral color', { props: { ...props, colors: ['neutral', 'primary'] } }],
    ['with empty colors', { props: { ...props, colors: [] } }],
    ['with definition only', { props: { tooltip: false, definition: defineChart({ marks: [], scales: { x: null, y: null } }) } }],
    ['with format', { props: { ...props, format: (value: number) => `$${value}` } }],
    ['with height', { props: { ...props, height: 200 } }],
    ['with aspectRatio', { props: { ...props, aspectRatio: 2 } }],
    ['with width', { props: { ...props, width: 400 } }],
    ['with class', { props: { ...props, class: 'max-w-lg' } }],
    ['with ui', { props: { ...props, ui: { base: 'rounded-md' } } }]
  ])

  it('renders with a tooltip inside a tooltip provider', async () => {
    const wrapper = await mountSuspended(defineComponent({
      components: { TooltipProvider, Chart },
      setup: () => ({ props: { ...props, tooltip: true } }),
      template: '<TooltipProvider><Chart v-bind="props" /></TooltipProvider>'
    }))

    expect(wrapper.find('svg.ts-chart').exists()).toBe(true)
    expect(wrapper.find('.ts-chart-tooltip').exists()).toBe(false)
  })

  it('stacks negative values below the baseline and skips missing ones', async () => {
    const data = [
      { month: 'Jan', desktop: 100, mobile: -40 },
      { month: 'Feb', desktop: undefined, mobile: 60 },
      { month: 'Mar', desktop: 80, mobile: -20 }
    ]
    const wrapper = await mountSuspended(Chart, { props: { ...props, data, type: 'area', stacked: true } })
    const html = wrapper.html()

    expect(html).not.toContain('NaN')
    // The y axis reaches below zero for the negative series.
    expect(wrapper.find('[data-ts-key^="y-tick-label:number:-"]').exists()).toBe(true)
    // `mobile` starts from the baseline, not from the top of `desktop`: its lowest point is under zero.
    const zero = Number(wrapper.find('[data-ts-key="y-tick-label:number:0"]').attributes('y'))
    const mobile = wrapper.find('.ts-chart__line path[data-ts-key*=":mobile:segment"]').attributes('d')!
    const ys = [...mobile.matchAll(/[ML][\d.]+,([\d.]+)/g)].map(match => Number(match[1]))
    expect(Math.max(...ys)).toBeGreaterThan(zero)
  })

  it('names and colors the series from category objects', async () => {
    const wrapper = await mountSuspended(Chart, { props: { ...props, categories: [{ key: 'desktop', label: 'Desktop' }, { key: 'mobile', label: 'Mobile', color: 'error' }] } })

    expect(wrapper.findAll('[data-ts-key^="legend-label"]').map(label => label.text())).toEqual(['Desktop', 'Mobile'])
    expect(wrapper.find('[data-slot="root"]').attributes('style')).toContain('--ts-chart-2: var(--ui-error)')
    expect(wrapper.find('svg.ts-chart').attributes('aria-label')).toBe('Visitors')
  })

  it('keeps series apart when they share a label', async () => {
    const wrapper = await mountSuspended(Chart, { props: { ...props, categories: [{ key: 'desktop', label: 'Users' }, { key: 'mobile', label: 'Users' }] } })
    const strokes = wrapper.findAll('.ts-chart__line path').map(path => path.attributes('stroke'))

    expect(new Set(strokes)).toEqual(new Set(['var(--ts-chart-1)', 'var(--ts-chart-2)']))
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Chart, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
