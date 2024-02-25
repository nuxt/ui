import { describe, it, expect } from 'vitest'
import { UPagination } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Pagination', () => {
  it.each([
    ['basic case', {}],
    ['with disabled', { props: { disabled: true } }],
    ['with size', { props: { size: 'lg' } }],
    ['with first button', { props: { showFirst: true, firstButton: { label: 'Start', color: 'red' } } }],
    ['with first button slot', { slots: { first: () => 'First button slot' } }],
    ['with last button', { props: { showLast: true, lastButton: { label: 'Last', color: 'red' } } }],
    ['with last button slot', { slots: { last: () => 'Last button slot' } }],
    ['with next button', { props: { nextButton: { label: 'Next', color: 'red' } } }],
    ['with next button slot', { slots: { next: () => 'Next button slot' } }],
    ['with prev button', { props: { nextButton: { label: 'Prev', color: 'red' } } }],
    ['with prev button slot', { slots: { next: () => 'Prev button slot' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UPagination.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UPagination)
    expect(html).toMatchSnapshot()
  })
})
