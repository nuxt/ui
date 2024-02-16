import { describe, it, expect } from 'vitest'
import { UPagination } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'
import uiPagination from '../../../src/runtime/ui.config/navigation/pagination'

describe('Pagination', () => {
  it.each([
    ['basic case', { props: { ui: uiPagination } }],
    ['with disabled', { props: { disabled: true, ui: uiPagination } }],
    ['with size', { props: { size: 'lg', ui: uiPagination } }],
    ['with first button', { props: { showFirst: true, firstButton: { label: 'Start', color: 'red' }, ui: uiPagination } }],
    ['with first button slot', { slots: { first: 'first button slot' }, props: { ui: uiPagination } }],
    ['with last button', { props: { showLast: true, lastButton: { label: 'Last', color: 'red' }, ui: uiPagination } }],
    ['with last button slot', { slots: { last: 'last button slot' }, props: { ui: uiPagination } }],
    ['with next button', { props: { nextButton: { label: 'Next', color: 'red' }, ui: uiPagination } }],
    ['with next button slot', { slots: { next: 'next button slot' }, props: { ui: uiPagination } }],
    ['with prev button', { props: { nextButton: { label: 'Prev', color: 'red' }, ui: uiPagination } }],
    ['with prev button slot', { slots: { next: 'prev button slot' }, props: { ui: uiPagination } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Pagination.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UPagination)
    expect(html).toMatchSnapshot()
  })
})
