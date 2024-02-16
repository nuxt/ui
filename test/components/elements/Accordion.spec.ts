import { describe, it, expect } from 'vitest'
import { UAccordion } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'
import uiAccordion from '../../../src/runtime/ui.config/elements/accordion'

describe('Accordion', () => {
  it.each([
    ['basic case', {}],
    //TODO: check disclosure errors
    // ['renders with multiple items', { props: { items: [{ content: 'Item 1' }, { content: 'Item 2' }] }, ui: uiAccordion }],
    // ['renders with defaultOpen set to true', { props: { items: [{ content: 'Accordion Content' }], defaultOpen: true }, ui: uiAccordion }],
    // ['renders with custom openIcon', { props: { items: [{ content: 'Accordion Content' }], openIcon: 'heroicons-plus' }, ui: uiAccordion }],
    // ['renders with custom closeIcon', { props: { items: [{ content: 'Accordion Content' }], closeIcon: 'heroicons-minus'}, ui: uiAccordion }],
    // ['renders with multiple allowed to be open', { props: { items: [{ content: 'Item 1' }, { content: 'Item 2' }], multiple: true }, ui: uiAccordion }],
    // ['renders with custom class', { props: { items: [{ content: 'Accordion Content' }], class: 'custom-class' }, ui: uiAccordion }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Accordion.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UAccordion)
    expect(html).toMatchSnapshot()
  })
})
