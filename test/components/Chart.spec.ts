import { ref } from 'vue'
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Chart from '../../src/runtime/components/Chart.vue'
import { renderEach } from '../component-render'
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
    ariaLabel: 'Visitors'
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
    ['with type donut and center slot', { props: { data: props.data, type: 'donut', index: 'month', categories: ['desktop'], thickness: 12, ariaLabel: 'Desktop' }, slots: { center: () => 'Center slot' } }],
    ['with type donut and legend', { props: { data: props.data, type: 'donut', index: 'month', categories: ['desktop'], legend: true, ariaLabel: 'Desktop' } }],
    ['with stacked bar', { props: { ...props, type: 'bar', stacked: true } }],
    ['with stacked area', { props: { ...props, type: 'area', stacked: true } }],
    ['with curve monotone', { props: { ...props, curve: 'monotone' } }],
    ['with curve step', { props: { ...props, curve: 'step' } }],
    ['with curve monotone area', { props: { ...props, type: 'area', curve: 'monotone' } }],
    ['with points', { props: { ...props, points: true } }],
    ['without grid', { props: { ...props, grid: false } }],
    ['without axes', { props: { ...props, xAxis: false, yAxis: false } }],
    ['without legend', { props: { ...props, legend: false } }],
    ['with colors', { props: { ...props, colors: ['success', '#8b5cf6'] } }],
    ['with format', { props: { ...props, format: (value: number) => `$${value}` } }],
    ['with height', { props: { ...props, height: 200 } }],
    ['with class', { props: { ...props, class: 'max-w-lg' } }],
    ['with ui', { props: { ...props, ui: { base: 'rounded-md' } } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Chart, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
