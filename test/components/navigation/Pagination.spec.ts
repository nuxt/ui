import { describe, it, expect } from 'vitest'
import { UPagination } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'
import ui from '../../../src/runtime/ui.config/navigation/pagination'

describe('Pagination', () => {
  it.each([
    ['basic case', { props: { ui: { default: { prevButton: ui.default.prevButton } }}}],
    ['with disabled', { props: { disabled: true , ui: { default: { prevButton: ui.default.prevButton } } } }],
    ['with size', { props: { size: 'lg', ui: { default: { prevButton: ui.default.prevButton } } } }],
    ['with first button', { props: { showFirst: true, firstButton: { label: 'Start', color: 'red' }, ui: { default: { prevButton: ui.default.prevButton } } } }],
    ['with first button slot', { slots: { first: 'first button slot' }, props: { ui: { default: { prevButton: ui.default.prevButton } } } }],
    ['with last button', { props: { showLast: true, lastButton: { label: 'Last', color: 'red' }, ui: { default: { prevButton: ui.default.prevButton } } } }],
    ['with last button slot', { slots: { last: 'last button slot' }, props: { ui: { default: { prevButton: ui.default.prevButton } } } }],
    ['with next button', { props: { nextButton: { label: 'Next', color: 'red' }, ui: { default: { prevButton: ui.default.prevButton } } } }],
    ['with next button slot', { slots: { next: 'next button slot' }, props: { ui: { default: { prevButton: ui.default.prevButton } } } }],
    ['with prev button', { props: { nextButton: { label: 'Prev', color: 'red' }, ui: { default: { prevButton: ui.default.prevButton } } } }],
    ['with prev button slot', { slots: { next: 'prev button slot' }, props: { ui: { default: { prevButton: ui.default.prevButton } } } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Pagination.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UPagination)
    expect(html).toMatchSnapshot()
  })
})
