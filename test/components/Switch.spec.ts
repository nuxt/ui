import { describe, it, expect } from 'vitest'
import Switch, { type SwitchProps } from '../../src/runtime/components/Switch.vue'
import ComponentRender from '../component-render'

describe('Switch', () => {
  it.each([
    ['basic case', {}],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }],
    ['with as', { props: { as: 'section' } }],
    ['with checked', { props: { checked: true } }],
    ['with defaultChecked', { props: { defaultChecked: true } }],
    ['with disabled', { props: { disabled: true } }],
    ['with id', { props: { id: 'test' } }],
    ['with name', { props: { name: 'test' } }],
    ['with required', { props: { required: true } }],
    ['with value', { props: { value: 'switch' } }],
    ['with size 2xs', { props: { size: '2xs' as const } }],
    ['with size xs', { props: { size: 'xs' as const } }],
    ['with size sm', { props: { size: 'sm' as const } }],
    ['with size md', { props: { size: 'md' as const } }],
    ['with size lg', { props: { size: 'lg' as const } }],
    ['with size xl', { props: { size: 'xl' as const } }],
    ['with size 2xl', { props: { size: '2xl' as const } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: SwitchProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Switch)
    expect(html).toMatchSnapshot()
  })
})
