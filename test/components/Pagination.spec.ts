import { describe, it, expect } from 'vitest'
import Pagination, { type PaginationProps, type PaginationSlots } from '../../src/runtime/components/Pagination.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/button'

describe('Pagination', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any

  const props = { total: 100 }

  it.each([
    // Props
    ['with total', { props }],
    ['with defaultPage', { props: { ...props, defaultPage: 2 } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ['with itemsPerPage', { props: { ...props, itemsPerPage: 5 } }],
    ['with page', { props: { ...props, page: 2 } }],
    ['with showEdges', { props: { ...props, showEdges: true } }],
    ['with siblingCount', { props: { ...props, siblingCount: 1, showEdges: true, page: 5 } }],
    ['without showControls', { props: { ...props, showControls: false } }],
    ['with firstIcon', { props: { ...props, firstIcon: 'i-lucide-arrow-left' } }],
    ['with prevIcon', { props: { ...props, prevIcon: 'i-lucide-arrow-left' } }],
    ['with nextIcon', { props: { ...props, nextIcon: 'i-lucide-arrow-right' } }],
    ['with lastIcon', { props: { ...props, lastIcon: 'i-lucide-arrow-right' } }],
    ['with ellipsisIcon', { props: { ...props, ellipsisIcon: 'i-lucide-ellipsis-vertical', siblingCount: 1, showEdges: true, page: 5 } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { ...props, variant } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { ...props, variant, color: 'primary' } }]),
    ...variants.map((activeVariant: string) => [`with primary active variant ${activeVariant}`, { props: { ...props, activeVariant } }]),
    ...variants.map((activeVariant: string) => [`with neutral active variant ${activeVariant}`, { props: { ...props, activeVariant, color: 'neutral' } }]),
    ['with as', { props: { ...props, as: 'div' } }],
    ['with class', { props: { ...props, class: 'relative' } }],
    ['with ui', { props: { ...props, ui: { list: 'gap-3' } } }],
    // Slots
    ['with first slot', { props, slots: { first: () => 'First slot' } }],
    ['with prev slot', { props, slots: { prev: () => 'Prev slot' } }],
    ['with next slot', { props, slots: { next: () => 'Next slot' } }],
    ['with last slot', { props, slots: { last: () => 'Last slot' } }],
    ['with ellipsis slot', { props: { ...props, siblingCount: 1, showEdges: true, page: 5 }, slots: { ellipsis: () => 'Ellipsis slot' } }],
    ['with item slot', { props, slots: { item: () => 'Item slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: PaginationProps, slots?: Partial<PaginationSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Pagination)
    expect(html).toMatchSnapshot()
  })
})
