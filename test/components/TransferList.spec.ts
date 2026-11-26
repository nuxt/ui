import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { renderEach } from '../component-render'
import theme from '#build/ui/transfer-list'
import TransferList from '../../src/runtime/components/TransferList.vue'

describe('TransferList', () => {
  const sizes = Object.keys(theme.variants.size) as any

  const items = [
    { label: 'France', icon: 'i-lucide-map-pin', value: 'FR' },
    { label: 'Germany', icon: 'i-lucide-map-pin', value: 'DE' },
    { label: 'Italy', icon: 'i-lucide-map-pin', value: 'IT', disabled: true },
    { label: 'Spain', icon: 'i-lucide-map-pin', value: 'ES' }
  ]

  const props = { items, valueKey: 'value' as const }

  renderEach(TransferList, [
    // Props
    ['with items', { props }],
    ['with items with description', { props: { ...props, items: items.map(item => ({ ...item, description: 'Description' })) } }],
    ['with modelValue', { props: { ...props, modelValue: ['DE', 'FR'] } }],
    ['with defaultValue', { props: { ...props, defaultValue: ['ES'] } }],
    ['without valueKey', { props: { items, defaultValue: [items[0]] } }],
    ['with labelKey', { props: { ...props, labelKey: 'value' } }],
    ['with sourceLabel and targetLabel', { props: { ...props, sourceLabel: 'Countries', targetLabel: 'Visited' } }],
    ['with filter', { props: { ...props, filter: true } }],
    ['with filter and placeholder', { props: { ...props, filter: { placeholder: 'Filter...' } } }],
    ['without header', { props: { ...props, header: false } }],
    ['without moveAll', { props: { ...props, moveAll: false } }],
    ['with controls', { props: { ...props, controls: { color: 'primary', variant: 'soft' } } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ['with selectedIcon', { props: { ...props, selectedIcon: 'i-lucide-circle-check' } }],
    ['with id', { props: { ...props, id: 'id' } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ['with color neutral', { props: { ...props, color: 'neutral' } }],
    ['with highlight', { props: { ...props, highlight: true } }],
    ['with class', { props: { ...props, class: 'gap-6' } }],
    ['with ui', { props: { ...props, ui: { list: 'rounded-none' } } }],
    // Slots
    ['with header slot', { props, slots: { header: () => 'Header slot' } }],
    ['with empty slot', { props: { ...props, items: [] }, slots: { empty: () => 'Empty slot' } }],
    ['with controls slot', { props, slots: { controls: () => 'Controls slot' } }],
    ['with item slot', { props, slots: { item: () => 'Item slot' } }],
    ['with item-leading slot', { props, slots: { 'item-leading': () => 'Item leading slot' } }],
    ['with item-label slot', { props, slots: { 'item-label': () => 'Item label slot' } }],
    ['with item-description slot', { props, slots: { 'item-description': () => 'Item description slot' } }],
    ['with item-trailing slot', { props, slots: { 'item-trailing': () => 'Item trailing slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(TransferList, { props: { ...props, modelValue: ['ES'], filter: true } })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  function listLabels(wrapper: any, side: 'source' | 'target') {
    return wrapper.findAll(`[data-side="${side}"] [data-slot="item"]`).map((item: any) => item.text())
  }

  function control(wrapper: any, label: string) {
    return wrapper.find(`button[aria-label="${label}"]`)
  }

  it('splits items between the source and target lists', async () => {
    const wrapper = await mountSuspended(TransferList, { props: { ...props, modelValue: ['ES', 'FR'] } })

    expect(listLabels(wrapper, 'source')).toEqual(['Germany', 'Italy'])
    // Target keeps the order of `modelValue`.
    expect(listLabels(wrapper, 'target')).toEqual(['Spain', 'France'])
  })

  it('moves selected items to the target', async () => {
    const wrapper = await mountSuspended(TransferList, { props })

    expect(control(wrapper, 'Move selected to chosen').attributes('disabled')).toBeDefined()

    await wrapper.findAll('[data-side="source"] [data-slot="item"]')[1]!.trigger('click')
    await flushPromises()

    expect(control(wrapper, 'Move selected to chosen').attributes('disabled')).toBeUndefined()

    await control(wrapper, 'Move selected to chosen').trigger('click')
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')).toEqual([[['DE']]])
    expect(wrapper.emitted('move')![0]).toEqual([{ items: [items[1]], to: 'target' }])
    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(listLabels(wrapper, 'target')).toEqual(['Germany'])
  })

  it('moves all enabled items and skips disabled ones', async () => {
    const wrapper = await mountSuspended(TransferList, { props })

    await control(wrapper, 'Move all to chosen').trigger('click')
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')).toEqual([[['FR', 'DE', 'ES']]])
    expect(listLabels(wrapper, 'source')).toEqual(['Italy'])

    await control(wrapper, 'Move all to available').trigger('click')
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')![1]).toEqual([[]])
  })

  it('moves an item on double click', async () => {
    const wrapper = await mountSuspended(TransferList, { props: { ...props, defaultValue: ['FR'] } })

    await wrapper.find('[data-side="target"] [data-slot="item"]').trigger('dblclick')
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')).toEqual([[[]]])
  })

  it('selects every enabled item with the header checkbox', async () => {
    const wrapper = await mountSuspended(TransferList, { props })

    await wrapper.find('[data-side="source"] [data-slot="header"] button[role="checkbox"]').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-side="source"] [data-slot="headerCount"]').text()).toBe('3/4')
  })

  it('does not move items when disabled', async () => {
    const wrapper = await mountSuspended(TransferList, { props: { ...props, disabled: true } })

    await wrapper.find('[data-side="source"] [data-slot="item"]').trigger('dblclick')
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
