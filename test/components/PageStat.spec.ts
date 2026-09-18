import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import PageStat from '../../src/runtime/components/PageStat.vue'
import theme from '#build/ui/page-stat'

describe('PageStat', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const colors = Object.keys(theme.variants.color) as any
  const variants = Object.keys(theme.variants.variant) as any

  const props = {
    icon: 'i-lucide-users',
    title: 'Total Users',
    value: '12,345'
  }

  renderEach(PageStat, [
    // Props
    ['with as', { props: { ...props, as: 'section' } }],
    ['with icon', { props: { icon: 'i-lucide-users' } }],
    ['with title', { props: { title: 'Total Users' } }],
    ['with value', { props: { value: '12,345' } }],
    ['with value number', { props: { value: 12345 } }],
    ['with trend up', { props: { ...props, trend: 12.5 } }],
    ['with trend down', { props: { ...props, trend: -8.2 } }],
    ['with trend and trendDirection override', { props: { ...props, trend: 15.3, trendDirection: 'down' as const } }],
    ['with current and max', { props: { ...props, value: undefined, current: 50, max: 100 } }],
    ['without showLabel', { props: { ...props, value: undefined, current: 50, max: 100, showLabel: false } }],
    ['with progressColor', { props: { ...props, value: undefined, current: 50, max: 100, progressColor: 'success' } }],
    ['with data', { props: { ...props, data: [10, 20, 15, 30, 25, 40] } }],
    ['with data and showArea', { props: { ...props, data: [10, 20, 15, 30, 25, 40], showArea: true } }],
    ['with data containing negative values', { props: { ...props, data: [-10, 5, -5, 15, 20, -2] } }],
    ['with strokeWidth', { props: { ...props, data: [10, 20, 15, 30], strokeWidth: 4 } }],
    ['with height', { props: { ...props, data: [10, 20, 15, 30], height: 60 } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ...colors.map((color: string) => [`with color ${color}`, { props: { ...props, trend: 5, color } }]),
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { ...props, variant } }]),
    ['with class', { props: { ...props, class: 'rounded-xl' } }],
    ['with ui', { props: { ...props, ui: { title: 'font-bold' } } }],
    // Slots
    ['with icon slot', { props, slots: { icon: () => 'Icon slot' } }],
    ['with title slot', { props, slots: { title: () => 'Title slot' } }],
    ['with value slot', { props, slots: { value: () => 'Value slot' } }],
    ['with trend slot', { props: { ...props, trend: 12.5 }, slots: { trend: () => 'Trend slot' } }],
    ['with label slot', { props: { ...props, value: undefined, current: 50, max: 100 }, slots: { label: () => 'Label slot' } }],
    ['with progress slot', { props: { ...props, value: undefined, current: 50, max: 100 }, slots: { progress: () => 'Progress slot' } }],
    ['with sparkline slot', { props, slots: { sparkline: () => 'Sparkline slot' } }],
    ['with default slot', { props, slots: { default: () => 'Default slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(PageStat, {
      props: {
        icon: 'i-lucide-users',
        title: 'Total Users',
        value: '12,345',
        trend: 12.5
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
