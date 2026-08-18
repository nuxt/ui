import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import type { ProgressGroupItem } from '../../src/runtime/components/ProgressGroup.vue'
import ProgressGroup from '../../src/runtime/components/ProgressGroup.vue'
import theme from '#build/ui/progress-group'

describe('ProgressGroup', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const orientations = Object.keys(theme.variants.orientation) as any

  const items: ProgressGroupItem[] = [
    { label: 'System', value: 24, color: 'neutral', icon: 'i-lucide-cog' },
    { label: 'Apps', value: 8, color: 'error', icon: 'i-lucide-app-window' },
    { label: 'Documents', value: 12, color: 'warning' },
    { label: 'Multimedia', value: 42, color: 'success' }
  ]

  const props = { items, max: 128 }

  renderEach(ProgressGroup, [
    // Props
    ['with items', { props }],
    ['without items', { props: {} }],
    ['with max', { props: { items } }],
    ['with status', { props: { ...props, status: true } }],
    ['with values above max', { props: { items: [{ label: 'System', value: 96 }, { label: 'Apps', value: 64 }], max: 128, status: true } }],
    ['with value out of bounds', { props: { items: [{ label: 'System', value: -8 }, { label: 'Apps', value: 512 }], max: 128 } }],
    ['without labels', { props: { items: [{ value: 24 }, { value: 8 }], max: 128 } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size, status: true } }]),
    ...orientations.map((orientation: string) => [`with orientation ${orientation}`, { props: { ...props, orientation, status: true } }]),
    ['with color', { props: { items: [{ label: 'System', value: 24 }, { label: 'Apps', value: 8 }], max: 128, color: 'neutral' } }],
    ['with custom color', { props: { items: [{ label: 'System', value: 24, color: '#8b5cf6' }, { label: 'Apps', value: 8 }], max: 128, color: 'var(--color-green-400)' } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'w-48' } }],
    ['with ui', { props: { ...props, ui: { base: 'bg-default' } } }],
    ['with item ui', { props: { items: [{ label: 'System', value: 24, ui: { itemLabel: 'font-bold' } }], max: 128 } }],
    // Slots
    ['with status slot', { props: { ...props, status: true }, slots: { status: () => 'Status slot' } }],
    ['with item slot', { props, slots: { item: () => 'Item slot' } }],
    ['with item-leading slot', { props, slots: { 'item-leading': () => 'Leading slot' } }],
    ['with item-label slot', { props, slots: { 'item-label': () => 'Label slot' } }],
    ['with item-trailing slot', { props, slots: { 'item-trailing': () => 'Trailing slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ProgressGroup, {
      props: {
        items,
        max: 128,
        status: true
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
