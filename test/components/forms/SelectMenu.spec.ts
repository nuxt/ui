import { describe, it, expect } from 'vitest'
import { USelectMenu } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('SelectMenu', () => {
  it.each([
    ['basic case', {}],
    ['with query', { query: 'exampleQuery' }],
    ['with by', { by: 'exampleBy' }],
    ['with options', {
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3', disabled: true }
      ]
    }],
    ['with id', { id: 'exampleId' }],
    ['with name', { name: 'exampleName' }],
    ['with required', { required: true }],
    ['with icon', { icon: 'exampleIcon' }],
    ['with loadingIcon', { loadingIcon: 'exampleLoadingIcon' }],
    ['with leadingIcon', { leadingIcon: 'exampleLeadingIcon' }],
    ['with trailingIcon', { trailingIcon: 'exampleTrailingIcon' }],
    ['with trailing', { trailing: true }],
    ['with leading', { leading: true }],
    ['with loading', { loading: true }],
    ['with selectedIcon', { selectedIcon: 'exampleSelectedIcon' }],
    ['with disabled', { disabled: true }],
    ['with multiple', { multiple: true }],
    ['with searchable', { searchable: true }],
    ['with creatable', { creatable: true }],
    ['with searchablePlaceholder', { searchablePlaceholder: 'exampleSearchablePlaceholder' }],
    ['with clearSearchOnClose', { clearSearchOnClose: true }],
    ['with debounce', { debounce: 300 }],
    ['with showCreateOptionWhen', { showCreateOptionWhen: 'empty' }],
    ['with placeholder', { placeholder: 'examplePlaceholder' }],
    ['with padded', { padded: false }],
    ['with size', { size: 'exampleSize' }],
    ['with color', { color: 'exampleColor' }],
    ['with variant', { variant: 'exampleVariant' }],
    ['with optionAttribute', { optionAttribute: 'exampleOptionAttribute' }],
    ['with valueAttribute', { valueAttribute: 'exampleValueAttribute' }],
    ['with searchAttributes', { searchAttributes: ['attribute1', 'attribute2'] }],
    ['with popper', { popper: { key: { id: '1' }, placement: 'bottom' }, arrow: true }],
    ['with selectClass', { selectClass: 'exampleSelectClass' }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof SelectMenu.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, USelectMenu)
    expect(html).toMatchSnapshot()
  })
})
