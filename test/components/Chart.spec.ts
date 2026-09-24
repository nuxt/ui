import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Chart from '../../src/runtime/components/Chart.vue'
import { renderEach } from '../component-render'
import theme from '#build/ui/chart'

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

  renderEach(Chart, [
    // Props
    ...types.map((type: string) => [`with type ${type}`, { props: { ...props, type } }]),
    ['with stacked bar', { props: { ...props, type: 'bar', stacked: true } }],
    ['with stacked area', { props: { ...props, type: 'area', stacked: true } }],
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
