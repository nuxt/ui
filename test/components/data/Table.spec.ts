import { describe, it, expect, vi } from 'vitest'
import { UTable } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Table', () => {
  it.each([
    [
      'basic case',
      {
        props: {
          columns: [{ key: 'name', label: 'Name' }, { key: 'age', label: 'Age' }],
          ui: { tr: { base: '' }, th: { base: '' }, emptyState: { wrapper: 'flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14' } }
        }
      }
    ],
    [
      'sort',
      {
        props: {
          sort: { column: 'name', direction: 'desc' }, columns: [{ key: 'name', label: 'Name', sortable: true }, { key: 'age', label: 'Age' }],
          ui: { tr: { base: '' }, th: { base: '' }, emptyState: { wrapper: 'flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14' }, default: { sortButton: { icon: 'i-heroicons-academic-cap-16-solid' } } }
        }
      }
    ],
    [
      'sort mode',
      {
        props: {
          sortMode: 'manual', columns: [{ key: 'name', label: 'Name', sortable: true }, { key: 'age', label: 'Age' }],
          ui: { tr: { base: '' }, th: { base: '' }, emptyState: { wrapper: 'flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14' }, default: { sortButton: { icon: 'i-heroicons-academic-cap-16-solid' } } }
        }
      }
    ],
    [
      'custom sort button',
      {
        props:
        {
          sortButton: { label: 'Custom button', size: 'xl', variant: 'orange', icon: 'i-heroicons-academic-cap' }, columns: [{ sortable: true, key: 'name', label: 'Name' }, { key: 'age', label: 'Age' }],
          ui: { tr: { base: '' }, th: { base: '' }, emptyState: { wrapper: 'flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14' }, default: { sortButton: { icon: 'i-heroicons-academic-cap' } } }
        }
      }
    ],
    [
      'sort asc icon',
      {
        props:
        {
          sortAscIcon: 'i-heroicons-adjustments-horizontal', sort: { column: 'name', direction: 'asc' }, columns: [{ sortable: true, key: 'name', label: 'Name' }, { key: 'age', label: 'Age' }],
          ui: { tr: { base: '' }, th: { base: '' }, td: { base: '' }, emptyState: { wrapper: 'flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14' }, default: { sortButton: { icon: 'i-heroicons-academic-cap' } } }
        }
      }
    ],
    [
      'sort desc icon',
      {
        props: {
          sortDescIcon: 'i-heroicons-arrow-down-left-solid', sort: { column: 'name', direction: 'desc' }, columns: [{ sortable: true, key: 'name', label: 'Name' }, { key: 'age', label: 'Age' }],
          ui: { tr: { base: '' }, th: { base: '' }, td: { base: '' }, emptyState: { wrapper: 'flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14' }, default: { sortButton: { icon: 'i-heroicons-academic-cap' } } }
        }
      }
    ],
    [
      'loading state',
      {
        props:
        {
          loading: true, loadingState: { icon: 'i-heroicons-sparkles', label: 'Loading...' }, columns: [{ key: 'name', label: 'Name' }, { key: 'age', label: 'Age' }],
          ui: { tr: { base: '' }, th: { base: '' }, loadingState: { wrapper: 'flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14' } }
        }
      }
    ],
    [
      'loading state slot',
      {
        slots: { 'loading-state': 'Loading state slot' },
        props:
        {
          loading: true, loadingState: { icon: 'i-heroicons-sparkles', label: 'Loading...' }, columns: [{ key: 'name', label: 'Name' }, { key: 'age', label: 'Age' }],
          ui: { tr: { base: '' }, th: { base: '' }, loadingState: { wrapper: 'flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14' } }
        }
      }
    ],
    ['empty state props',
      {
        props:
        {
          rows: [], emptyState: { icon: 'i-heroicons-inbox', label: 'No data available' }, columns: [{ key: 'name', label: 'Name' }, { key: 'age', label: 'Age' }],
          ui: { tr: { base: '' }, th: { base: '' }, emptyState: { wrapper: 'flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14' } }
        }
      }
    ],
    ['empty state slot',
      {
        slots: { 'empty-state': 'Empty state slot' },
        props: {
          emptyState: { label: 'emptyStateLabel', icon: 'i-heroicons-chevron-up-down-solid' }, columns: [{ key: 'name', label: 'Name' }, { key: 'age', label: 'Age' }],
          ui: { tr: { base: '' }, th: { base: '' }, emptyState: { wrapper: 'flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14' } }
        }
      }
    ],
    ['selected rows',
      {
        props: {
          rows: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }, { id: 3, name: 'Doe' }], columns: [{ key: 'name', label: 'Name' }, { key: 'age', label: 'Age' }],
          ui: { tr: { base: '' }, th: { base: '' }, td: { base: '' }, emptyState: { wrapper: 'flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14' } }
        }
      }
    ],

    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Table.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UTable)
    expect(html).toMatchSnapshot()
  })
})
