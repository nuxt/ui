import { describe, it, expect } from 'vitest'
import { UInput } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Input', () => {
  it.each([
    ['basic case', {}],
    ['with name', { props: { name: 'username' } }],
    ['with placeholder', { props: { placeholder: 'Enter your username' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with readonly', { props: { readonly: true } }],
    ['with required', { props: { required: true } }],
    ['with custom type', { props: { type: 'password' } }],
    ['with icon', { props: { icon: 'i-heroicons-battery-50-solid' } }],
    ['with leading and icon', { props: { leading: true, icon: 'i-heroicons-battery-50-solid' } }],
    ['with leadingIcon', { props: { leadingIcon: 'i-heroicons-battery-50-solid' } }],
    ['with loading icon', { props: { loading: true } }],
    ['with leading slots', { slots: { leading: 'leading slot' } }],
    ['with trailing and icon', { props: { trailing: true, icon: 'i-heroicons-battery-50-solid' } }],
    ['with trailingIcon', { props: { trailingIcon: 'i-heroicons-battery-50-solid' } }],
    ['with trailing slots', { slots: { leading: 'trailing slot' } }],
    ['without padded', { props: { padded: false } }],
    ['with size', { props: { size: 'xs' } }],
    ['with color', { props: { color: 'red' } }],
    ['with variant', { props: { variant: 'outline' } }],
    ['with input class', { props: { inputClass: 'w-full' } }],


    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Input.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UInput)
    expect(html).toMatchSnapshot()
  })
})
