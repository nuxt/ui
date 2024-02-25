import { describe, it, expect } from 'vitest'
import { USelect } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Select', () => {
  it.each([
    ['basic case', {}],
    ['with custom id', { props: { id: 'mySelect' }, options: [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] }],
    ['with custom name', { props: { name: 'mySelectInput' }, options: [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] }],
    ['with placeholder', { props: { placeholder: 'Select an option' }, options: [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] }],
    ['with disabled', { props: { disabled: true }, options: [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] }],
    ['with icon', { props: { icon: 'i-heroicons-academic-cap' }, options: [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] }],
    ['with loading', { props: { loading: true }, options: [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] }],
    ['with loadingIcon', { props: { loading: true, loadingIcon: 'i-heroicons-adjustments-horizontal' }, options: [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] }],
    ['with leadingIcon', { props: { leadingIcon: 'i-heroicons-adjustments-vertical' }, options: [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] }],
    ['with trailing icon', { props: { trailingIcon: 'i-heroicons-archive-box' }, options: [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] }],
    ['with trailing', { props: { trailing: true, icon: '' }, options: [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] }],
    ['with leading + icon', { props: { leading: true, icon: 'i-heroicons-adjustments-vertical', options: [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] } }],
    ['with trailing + icon', { props: { trailing: true, icon: 'i-heroicons-archive-box', options: [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] } }],
    ['with padded', { props: { padded: false, options: [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] } }],
    ['with custom size', { props: { size: 'lg' }, options: [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] }],
    ['with custom color', { props: { color: 'red', options: [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] } }],
    ['with custom variant', { props: { variant: 'outlined' }, options: [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] }],
    ['with custom options', { props: { options: [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] } }],
    ['with leading slot', { slots: { leading: () => 'Leading slot' }, props: { options: [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] } }],
    ['with leading slot + iconName', { slots: { leading: () => 'Leading slot' }, props: { iconName: 'i-heroicons-cloud', options: [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] } }],
    ['with trailing slot', { slots: { trailing: () => 'Trailing slot' }, props: { options: [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] } }],
    ['with trailing slot + iconName', { slots: { trailing: () => 'Trailing slot' }, props: { iconName: 'i-heroicons-bookmark-solid', options: [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof USelect.props>) => {
    const html = await ComponentRender(nameOrHtml, options, USelect)
    expect(html).toMatchSnapshot()
  })
})
