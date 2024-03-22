import { describe, it, expect } from 'vitest'
import Input, { type InputProps } from '../../src/runtime/components/Input.vue'
import ComponentRender from '../component-render'

describe('Input', () => {
  it.each([
    ['basic case', {}],
    ['with name', { props: { name: 'username' } }],
    ['with type', { props: { type: 'password' } }],
    ['with placeholder', { props: { placeholder: 'Enter your username' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with required', { props: { required: true } }],
    ['with icon', { props: { icon: 'i-heroicons-magnifying-glass' } }],
    ['with leading and icon', { props: { leading: true, icon: 'i-heroicons-magnifying-glass' } }],
    ['with leadingIcon', { props: { leadingIcon: 'i-heroicons-magnifying-glass' } }],
    ['with loading icon', { props: { loading: true } }],
    ['with leading slot', { slots: { leading: () => 'leading slot' } }],
    ['with trailing and icon', { props: { trailing: true, icon: 'i-heroicons-magnifying-glass' } }],
    ['with trailingIcon', { props: { trailingIcon: 'i-heroicons-magnifying-glass' } }],
    ['with trailing slot', { slots: { leading: () => 'trailing slot' } }],
    ['with size 2xs', { props: { size: '2xs' as const } }],
    ['with size xs', { props: { size: 'xs' as const } }],
    ['with size sm', { props: { size: 'sm' as const } }],
    ['with size md', { props: { size: 'md' as const } }],
    ['with size lg', { props: { size: 'lg' as const } }],
    ['with size xl', { props: { size: 'xl' as const } }],
    ['with color', { props: { color: 'red' as const } }],
    ['with variant', { props: { variant: 'outline' as const } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: InputProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Input)
    expect(html).toMatchSnapshot()
  })
})
