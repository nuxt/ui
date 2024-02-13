import { describe, it, expect } from 'vitest'
import { UPagination } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Pagination', () => {
  it.each([
    ['basic case', {}],
    ['with pageCount', { pageCount: 20 }],
    ['with total', { total: 100 }],
    ['with max', { max: 10 }],
    ['with disabled', { disabled: true }],
    ['with size', { size: 'lg' }],
    ['with activeButton', { activeButton: { color: 'blue', label: 'active' } }],
    ['with inactiveButton', { inactiveButton: { color: 'gray', label: 'inactive' } }],
    ['with showFirst', { showFirst: true }],
    ['with showLast', { showLast: true }],
    ['with firstButton', { firstButton: { label: 'Start', color: 'blue' } }],
    ['with lastButton', { lastButton: { label: 'End', color: 'red' } }],
    ['with prevButton', { prevButton: { label: 'Prev', color: 'blue', variant: 'outline' } }],
    ['with nextButton', { nextButton: { label: 'Next', variant: 'outline' } }],
    ['with divider', { divider: '-' }],
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
