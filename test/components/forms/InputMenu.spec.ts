import { describe, it, expect } from 'vitest'
import { UInputMenu } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('InputMenu', () => {
  it.each([
    ['basic case', {}],
    ['with custom name and placeholder', { props: { name: 'username', placeholder: 'Enter your username' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with required', { props: { required: true } }],
    ['with custom class', { props: { class: 'custom-class' } }],
    ['with custom style', { props: { style: { color: 'red', fontSize: '16px' } } }],
    ['with custom type', { props: { type: 'password' } }],
    ['with nullable', { props: { nullable: true } }],
    ['with query', { props: { query: 'searchQuery' } }],
    ['with by', { props: { by: 'name' } }],
    ['with options', { props: { options: ['Option 1', 'Option 2', 'Option 3'] } }],
    ['with id', { props: { id: 'comboboxId' } }],
    ['with leading', { props: { leading: true } }],
    ['with trailing', { props: { trailing: true } }],
    ['with loading', { props: { loading: true } }],
    ['with selectedIcon', { props: { selectedIcon: 'check' } }],
    ['with optionAttribute', { props: { optionAttribute: 'value' } }],
    ['with valueAttribute', { props: { valueAttribute: 'id' } }],
    ['with searchAttributes', { props: { searchAttributes: ['name', 'description'] } }],
    ['with debounce', { props: { debounce: 300 } }],
    ['with popper', { props: { popper: { key: { id: '1' }, placement: 'bottom', arrow: true } } }],
    ['with inputClass', { props: { inputClass: 'input-class' } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof InputMenu.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UInputMenu)
    expect(html).toMatchSnapshot()
  })
})
