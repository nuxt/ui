import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import RadioGroup from '../../src/runtime/components/RadioGroup.vue'
import theme from '#build/ui/radio-group'

describe('RadioGroup with icon', () => {
  const items = [
    { value: 'table', label: 'Table', icon: 'i-lucide-table' },
    { value: 'board', label: 'Board', icon: 'i-lucide-layout-grid' },
    { value: 'list', label: 'List' }
  ]

  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any
  const indicators = Object.keys(theme.variants.indicator) as any

  it('renders a leading icon only for items that define one', async () => {
    const wrapper = await mountSuspended(RadioGroup, { props: { items } })
    expect(wrapper.findAll('[data-slot="leadingIcon"]')).toHaveLength(2)
  })

  it('keeps the label text alongside the icon', async () => {
    const wrapper = await mountSuspended(RadioGroup, { props: { items: [items[0]] } })
    expect(wrapper.find('[data-slot="leadingIcon"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Table')
  })

  it('does not render a leading icon when the item has none', async () => {
    const wrapper = await mountSuspended(RadioGroup, { props: { items: [{ value: 'list', label: 'List' }] } })
    expect(wrapper.find('[data-slot="leadingIcon"]').exists()).toBe(false)
  })

  it('keeps the item description alongside the icon', async () => {
    const wrapper = await mountSuspended(RadioGroup, { props: { items: [{ ...items[0], description: 'Spreadsheet view' }] } })
    expect(wrapper.find('[data-slot="leadingIcon"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Spreadsheet view')
  })

  it('renders the icon across every size', async () => {
    for (const size of sizes) {
      const wrapper = await mountSuspended(RadioGroup, { props: { items: [items[0]], size } })
      expect(wrapper.find('[data-slot="leadingIcon"]').exists(), `size=${size}`).toBe(true)
    }
  })

  it('renders the icon across every variant', async () => {
    for (const variant of variants) {
      const wrapper = await mountSuspended(RadioGroup, { props: { items: [items[0]], variant } })
      expect(wrapper.find('[data-slot="leadingIcon"]').exists(), `variant=${variant}`).toBe(true)
    }
  })

  it('renders the icon in horizontal orientation and for every indicator position', async () => {
    const horizontal = await mountSuspended(RadioGroup, { props: { items: [items[0]], orientation: 'horizontal' } })
    expect(horizontal.find('[data-slot="leadingIcon"]').exists()).toBe(true)

    for (const indicator of indicators) {
      const wrapper = await mountSuspended(RadioGroup, { props: { items: [items[0]], indicator } })
      expect(wrapper.find('[data-slot="leadingIcon"]').exists(), `indicator=${indicator}`).toBe(true)
    }
  })
})
