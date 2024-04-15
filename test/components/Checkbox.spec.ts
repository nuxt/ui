import { describe, it, expect } from 'vitest'
import { defu } from 'defu'
import Checkbox, { type CheckboxProps } from '../../src/runtime/components/Checkbox.vue'
import ComponentRender from '../component-render'

describe('Checkbox', () => {
  it.each([
    ['basic case', {}],
    ['with class', { props: { class: 'inline-flex' } }],
    ['with ui', { props: { ui: { wrapper: 'ms-4' } } }],
    ['with defaultValue', { props: { defaultValue: true } }],
    ['with id', { props: { id: 'custom-id' } }],
    ['with name', { props: { name: 'custom-name' } }],
    ['with value', { props: { value: 'custom-value' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with icon', { props: { icon: 'i-heroicons-heart' } }],
    ['with indeterminate', { props: { indeterminate: true } }],
    ['with indeterminateIcon', { props: { indeterminate: true, icon: 'i-heroicons-trash' } }],
    ['with label', { props: { label: 'Label' } }],
    ['with required', { props: { label: 'Label', required: true } }],
    ['with description', { props: { label: 'Label', description: 'Description' } }],
    ['with color', { props: { label: 'Label', color: 'red' as const } }],
    ['with size 2xs', { props: { size: '2xs' as const } }],
    ['with size xs', { props: { size: 'xs' as const } }],
    ['with size sm', { props: { size: 'sm' as const } }],
    ['with size md', { props: { size: 'md' as const } }],
    ['with size lg', { props: { size: 'lg' as const } }],
    ['with size xl', { props: { size: 'xl' as const } }],
    ['with label slot', { slots: { label: () => 'Label slot' } }],
    ['with description slot', { slots: { label: () => 'Description slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: CheckboxProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, defu(options, { props: { id: 42 } }), Checkbox)
    expect(html).toMatchSnapshot()
  })
})
