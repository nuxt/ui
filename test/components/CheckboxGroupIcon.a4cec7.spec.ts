import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CheckboxGroup from '../../src/runtime/components/CheckboxGroup.vue'
import theme from '#build/ui/checkbox-group'
import themeCheckbox from '#build/ui/checkbox'

describe('CheckboxGroup with icon', () => {
  const items = [
    { value: 'table', label: 'Table', icon: 'i-lucide-table' },
    { value: 'board', label: 'Board', icon: 'i-lucide-layout-grid' },
    { value: 'list', label: 'List' }
  ]

  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any
  const indicators = Object.keys(themeCheckbox.variants.indicator) as any

  it('renders a leading icon only for items that define one', async () => {
    const wrapper = await mountSuspended(CheckboxGroup, { props: { items } })
    expect(wrapper.findAll('[data-slot="leadingIcon"]')).toHaveLength(2)
  })

  it('keeps the label text alongside the icon', async () => {
    const wrapper = await mountSuspended(CheckboxGroup, { props: { items: [items[0]] } })
    expect(wrapper.find('[data-slot="leadingIcon"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Table')
  })

  it('does not render a leading icon when the item has none', async () => {
    const wrapper = await mountSuspended(CheckboxGroup, { props: { items: [{ value: 'list', label: 'List' }] } })
    expect(wrapper.find('[data-slot="leadingIcon"]').exists()).toBe(false)
  })

  it('keeps the item description alongside the icon', async () => {
    const wrapper = await mountSuspended(CheckboxGroup, { props: { items: [{ ...items[0], description: 'Spreadsheet view' }] } })
    expect(wrapper.find('[data-slot="leadingIcon"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Spreadsheet view')
  })

  it('adds a label icon without replacing the existing checkbox indicator icon', async () => {
    const wrapper = await mountSuspended(CheckboxGroup, { props: { items: [items[0]], modelValue: ['table'] } })
    // The item icon renders as a leading label icon...
    expect(wrapper.find('[data-slot="leadingIcon"]').exists()).toBe(true)
    // ...and the checkbox check indicator icon remains its own, separate element.
    expect(wrapper.find('[data-slot="icon"]').exists()).toBe(true)
  })

  it('renders the icon across every size', async () => {
    for (const size of sizes) {
      const wrapper = await mountSuspended(CheckboxGroup, { props: { items: [items[0]], size } })
      expect(wrapper.find('[data-slot="leadingIcon"]').exists(), `size=${size}`).toBe(true)
    }
  })

  it('renders the icon across every variant', async () => {
    for (const variant of variants) {
      const wrapper = await mountSuspended(CheckboxGroup, { props: { items: [items[0]], variant } })
      expect(wrapper.find('[data-slot="leadingIcon"]').exists(), `variant=${variant}`).toBe(true)
    }
  })

  it('renders the icon in horizontal orientation and for every indicator position', async () => {
    const horizontal = await mountSuspended(CheckboxGroup, { props: { items: [items[0]], orientation: 'horizontal' } })
    expect(horizontal.find('[data-slot="leadingIcon"]').exists()).toBe(true)

    for (const indicator of indicators) {
      const wrapper = await mountSuspended(CheckboxGroup, { props: { items: [items[0]], indicator } })
      expect(wrapper.find('[data-slot="leadingIcon"]').exists(), `indicator=${indicator}`).toBe(true)
    }
  })
})
