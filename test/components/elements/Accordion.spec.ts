import { describe, it, expect } from 'vitest'
import { UAccordion } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Accordion', () => {
  it.each([
    ['basic case', {}],
    //TODO: check disclosuer errors
    // ['renders with multiple items', { props: { items: [{ content: 'Item 1' }, { content: 'Item 2' }] } }],
    // ['renders with defaultOpen set to true', { props: { items: [{ content: 'Accordion Content' }], defaultOpen: true } }],
    // ['renders with custom openIcon', { props: { items: [{ content: 'Accordion Content' }], openIcon: 'heroicons-plus' } }],
    // ['renders with custom closeIcon', { props: { items: [{ content: 'Accordion Content' }], closeIcon: 'heroicons-minus' } }],
    // ['renders with multiple allowed to be open', { props: { items: [{ content: 'Item 1' }, { content: 'Item 2' }], multiple: true } }],
    // ['renders with custom class', { props: { items: [{ content: 'Accordion Content' }], class: 'custom-class' } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Accordion.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UAccordion)
    expect(html).toMatchSnapshot()
  })
})
