import { describe, it, expect, test, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import Tree from '../../src/runtime/components/Tree.vue'
import type { TreeItem } from '../../src/runtime/components/Tree.vue'
import theme from '#build/ui/tree'
import { expectEmitPayloadType } from '../utils/types'

describe('Tree', () => {
  const sizes = Object.keys(theme.variants.size) as any

  const items: TreeItem[] = [
    {
      id: 'root',
      label: 'app',
      slot: 'app',
      children: [{
        label: 'composables',
        icon: 'i-lucide-house',
        children: [
          { label: 'useAuth.ts', icon: 'vscode-icons:file-type-typescript' },
          { label: 'useUser.ts', icon: 'vscode-icons:file-type-typescript' }
        ]
      }]
    },
    { id: 'app-vue', label: 'app.vue', icon: 'i-vscode-icons-file-type-vue' },
    { id: 'nuxt-config-ts', label: 'nuxt.config.ts', icon: 'i-vscode-icons-file-type-nuxt' }
  ]

  const props = { items }

  renderEach(Tree, [
    // Props
    ['with items', { props }],
    ['with modelValue', { props: { ...props, modelValue: items[0] } }],
    ['with defaultValue', { props: { ...props, defaultValue: items[0] } }],
    // Expanded
    ['with expanded', { props: { ...props, expanded: [items[0]] } }],
    ['with defaultExpanded', { props: { ...props, defaultExpanded: [items[0]] } }],
    // Key mapping
    ['with labelKey', { props: { ...props, labelKey: 'id' } }],
    ['with getKey', { props: { ...props, getKey: (item: TreeItem) => item.id } }],
    // Multiple
    ['with multiple', { props: { ...props, multiple: true } }],
    ['with multiple and modelValue', { props: { ...props, multiple: true, modelValue: [items[0], items[1]] } }],
    ['with multiple and defaultValue', { props: { ...props, multiple: true, defaultValue: [items[0], items[1]] } }],
    // Disabled
    ['with disabled', { props: { ...props, disabled: true } }],
    // Nested
    ['without nested', { props: { ...props, nested: false } }],
    // Virtualize
    ['with virtualize', { props: { ...props, virtualize: true } }],
    // Item properties
    ['with defautExpanded item', { props: { items: [{ label: 'Default Expanded', defaultExpanded: true, children: items }] } }],
    ['with disabled item', { props: { items: [{ label: 'Disabled item', disabled: true, children: items }] } }],
    // Icons
    ['with trailingIcon', { props: { ...props, trailingIcon: 'i-lucide-arrow-down' } }],
    ['with expandedIcon', { props: { items: [{ label: 'Default Expanded', defaultExpanded: true, children: items }], expandedIcon: 'i-lucide-chevron-up' } }],
    ['with collapsedIcon', { props: { items: [{ label: 'Default Collapsed', defaultExpanded: false, children: items }], collapsedIcon: 'i-lucide-chevron-down' } }],
    // Style variants
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ['with neutral color', { props: { ...props, color: 'neutral' } }],
    ['with as', { props: { ...props, as: 'div' } }],
    ['with as object', { props: { ...props, as: { root: 'div', link: 'a' } } }],
    ['with class', { props: { ...props, class: 'absolute' } }],
    ['with ui', { props: { ...props, ui: { link: 'font-bold' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'default slot' } }],
    ['with item-wrapper slot', { props, slots: { 'item-wrapper': () => 'wrapper slot' } }],
    ['with item slot', { props, slots: { item: () => 'item slot' } }],
    ['with item-leading slot', { props, slots: { 'item-leading': () => 'leading slot' } }],
    ['with item-trailing slot', { props, slots: { 'item-trailing': () => 'trailing slot' } }],
    ['with dynamic slot', { props, slots: { app: () => 'dynamic slot' } }]
  ])

  it('does not throw when flattened with a custom theme size', async () => {
    const wrapper = await mountSuspended(Tree, {
      props: {
        items: [{ label: 'app', defaultExpanded: true, children: items }],
        nested: false,
        size: 'xxs' as any
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it.each([
    ['label', 'c', 2],
    ['name', 'c', 2],
    ['label', 'v', 0],
    ['name', 'v', 0]
  ] as const)('handles virtualized typeahead with labelKey %s and key %s', async (labelKey, key, focusedIndex) => {
    const height = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(300)
    const width = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(300)
    const wrapper = await mountSuspended(Tree, {
      attachTo: document.body,
      props: {
        items: ['Alpha', 'Bravo', 'Charlie'].map(label => ({ [labelKey]: label })),
        labelKey,
        virtualize: true
      }
    })
    try {
      await vi.waitFor(() => expect(wrapper.findAll('[role="treeitem"]')).toHaveLength(3))
      const rows = wrapper.findAll<HTMLButtonElement>('[role="treeitem"]')
      rows[0]!.element.focus()
      await rows[0]!.trigger('click')
      await rows[0]!.trigger('keydown', { key })
      await new Promise(resolve => requestAnimationFrame(resolve))
      await vi.waitFor(() => expect(document.activeElement).toBe(rows[focusedIndex]!.element))
      expect(rows[0]!.attributes('aria-selected')).toBe('true')
      expect(rows[2]!.attributes('aria-selected')).toBe('false')
    } finally {
      wrapper.unmount()
      height.mockRestore()
      width.mockRestore()
    }
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Tree, {
      props: {
        ...props,
        modelValue: items[0],
        expanded: [items[0] as any]
      }
    })
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  test('should have the correct types', () => {
    expectEmitPayloadType('update:modelValue', () => Tree({
      items: [{ label: 'foo' }, { label: 'baz' }]
    })).toEqualTypeOf<[{ label: string }]>()

    expectEmitPayloadType('update:modelValue', () => Tree({
      items: [{ label: 'foo', id: 'one' }, { label: 'baz', id: 'two' }],
      getKey: i => i.id
    })).toEqualTypeOf<[{ label: string, id: string }]>()
  })
})
