import { describe, it, expect } from 'vitest'
import Tree, { type TreeProps, type TreeSlots, type TreeItem } from '../../src/runtime/components/Tree.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/tree'

describe('Tree', () => {
  const sizes = Object.keys(theme.variants.size) as any

  const items: TreeItem[] = [
    {
      value: 'root',
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
    { value: 'app-vue', label: 'app.vue', icon: 'i-vscode-icons-file-type-vue' },
    { value: 'nuxt-config-ts', label: 'nuxt.config.ts', icon: 'i-vscode-icons-file-type-nuxt' }
  ]

  const props = { items }

  it.each([
    // Props
    ['with items', { props }],
    ['with modelValue', { props: { ...props, modelValue: items[0] } }],
    ['with defaultValue', { props: { ...props, defaultValue: items[0] } }],
    // Expanded
    ['with expanded', { props: { ...props, expanded: [items[0]] } }],
    ['with defaultExpanded', { props: { ...props, defaultExpanded: [items[0]] } }],
    // Key mapping
    ['with valueKey', { props: { ...props, valueKey: 'label' } }],
    ['with labelKey', { props: { ...props, labelKey: 'value' } }],
    // Multiple
    ['with multiple', { props: { ...props, multiple: true } }],
    ['with multiple and modelValue', { props: { ...props, multiple: true, modelValue: [items[0], items[1]] } }],
    ['with multiple and defaultValue', { props: { ...props, multiple: true, defaultValue: [items[0], items[1]] } }],
    // Disabled
    ['with disabled', { props: { ...props, disabled: true } }],
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
    ['with class', { props: { ...props, class: 'absolute' } }],
    ['with ui', { props: { ...props, ui: { link: 'font-bold' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'default slot' } }],
    ['with item slot', { props, slots: { item: () => 'item slot' } }],
    ['with item-leading slot', { props, slots: { 'item-leading': () => 'leading slot' } }],
    ['with item-trailing slot', { props, slots: { 'item-trailing': () => 'trailing slot' } }],
    ['with dynamic slot', { props, slots: { app: () => 'dynamic slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: Partial<TreeProps<any>>, slots?: Partial<TreeSlots<any>> }) => {
    const html = await ComponentRender(nameOrHtml, options, Tree)
    expect(html).toMatchSnapshot()
  })
})
