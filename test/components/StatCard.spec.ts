import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import StatCard from '../../src/runtime/components/StatCard.vue'
import type { StatCardProps, StatCardSlots } from '../../src/runtime/components/StatCard.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/stat-card'

describe('StatCard', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const colors = Object.keys(theme.variants.color) as any
  const variants = Object.keys(theme.variants.variant) as any

  it.each([
    // Props
    ['with icon', { props: { icon: 'i-lucide-users' } }],
    ['with title', { props: { title: 'Total Users' } }],
    ['with value', { props: { value: '12,345' } }],
    ['with value number', { props: { value: 12345 } }],
    ['with trend up', { props: { trend: 12.5, trendDirection: 'up' } }],
    ['with trend down', { props: { trend: 8.2, trendDirection: 'down' as const } }],
    ['with all props', { props: { icon: 'i-lucide-users', title: 'Users', value: '1,234', trend: 5.2, trendDirection: 'up' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size, icon: 'i-lucide-users', title: 'Test', value: '123' } }]),
    ...colors.map((color: string) => [`with color ${color}`, { props: { color, icon: 'i-lucide-users', title: 'Test', value: '123' } }]),
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { variant, icon: 'i-lucide-users', title: 'Test', value: '123' } }]),
    ['with as', { props: { as: 'section', icon: 'i-lucide-users', title: 'Test', value: '123' } }],
    ['with class', { props: { class: 'w-full', icon: 'i-lucide-users', title: 'Test', value: '123' } }],
    ['with ui', { props: { ui: { root: 'p-4' }, icon: 'i-lucide-users', title: 'Test', value: '123' } }],
    // Slots
    ['with icon slot', { slots: { icon: () => '⭐' }, props: { title: 'Test', value: '123' } }],
    ['with title slot', { slots: { title: () => 'Custom Title' }, props: { icon: 'i-lucide-users', value: '123' } }],
    ['with value slot', { slots: { value: () => 'Custom Value' }, props: { icon: 'i-lucide-users', title: 'Test' } }],
    ['with trend slot', { slots: { trend: () => 'Custom Trend' }, props: { icon: 'i-lucide-users', title: 'Test', value: '123' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: StatCardProps, slots?: Partial<StatCardSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, StatCard)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(StatCard, {
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
