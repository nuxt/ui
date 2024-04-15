import { describe, it, expect } from 'vitest'
import Switch, { type SwitchProps } from '../../src/runtime/components/Switch.vue'
import ComponentRender from '../component-render'

describe('Switch', () => {
  it.each([
    ['basic case', {}],
    ['with class', { props: { class: 'inline-flex' } }],
    ['with ui', { props: { ui: { wrapper: 'ms-4' } } }],
    ['with as', { props: { as: 'section' } }],
    ['with defaultValue', { props: { defaultValue: true } }],
    ['with id', { props: { id: 'custom-id' } }],
    ['with name', { props: { name: 'custom-name' } }],
    ['with value', { props: { value: 'custom-value' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with checkedIcon', { props: { checkedIcon: 'i-heroicons-check-20-solid', defaultValue: true } }],
    ['with uncheckedIcon', { props: { uncheckedIcon: 'i-heroicons-x-mark-20-solid' } }],
    ['with loading', { props: { loading: true } }],
    ['with loadingIcon', { props: { loading: true, loadingIcon: 'i-heroicons-sparkles' } }],
    ['with label', { props: { label: 'Label' } }],
    ['with required', { props: { label: 'Label', required: true } }],
    ['with description', { props: { label: 'Label', description: 'Description' } }],
    ['with size 2xs', { props: { size: '2xs' as const } }],
    ['with size xs', { props: { size: 'xs' as const } }],
    ['with size sm', { props: { size: 'sm' as const } }],
    ['with size md', { props: { size: 'md' as const } }],
    ['with size lg', { props: { size: 'lg' as const } }],
    ['with size xl', { props: { size: 'xl' as const } }],
    ['with label slot', { slots: { label: () => 'Label slot' } }],
    ['with description slot', { slots: { label: () => 'Description slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: SwitchProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Switch)
    expect(html).toMatchSnapshot()
  })
})
