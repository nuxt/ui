import { describe, it, expect } from 'vitest'
import { UInputMenu } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('InputMenu', () => {
  it.each([
    ['basic case', {}],
    ['with name', { props: { name: 'username' } }],
    ['with placeholder', { props: { placeholder: 'Enter your username' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with required', { props: { required: true } }],
    ['with custom type', { props: { type: 'password' } }],
    ['with nullable', { props: { nullable: true } }],
    ['with id', { props: { id: 'comboboxId' } }],
    ['with leading', { props: { leading: true } }],
    ['with icon', { props: { icon: 'i-heroicons-battery-50-solid' } }],
    ['with leading and icon', { props: { leading: true, icon: 'i-heroicons-battery-50-solid' } }],
    ['with leadingIcon', { props: { leadingIcon: 'i-heroicons-battery-50-solid' } }],
    ['with loading icon', { props: { loading: true } }],
    ['with leading slots', { slots: { leading: () => 'leading slot' } }],
    ['with loading', { props: { loading: true } }],
    ['with trailing and icon', { props: { trailing: true, icon: 'i-heroicons-battery-50-solid' } }],
    ['with trailingIcon', { props: { trailing: true, trailingIcon: 'i-heroicons-battery-50-solid' } }],
    ['with loading and trailing', { props: { trailing: true, loading: true } }],
    ['with trailing slots', { slots: { leading: () => 'trailing slot' } }],
    ['with inputClass', { props: { inputClass: 'w-full' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UInputMenu.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UInputMenu)
    expect(html).toMatchSnapshot()
  })
})
