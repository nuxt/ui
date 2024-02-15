import { describe, it, expect, vi } from 'vitest'
import { UTable } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'
import ui from '../../../src/runtime/ui.config/data/table'

describe('Table', () => {
  it.each([
    [
      'basic case',
      {
        props: {
          columns: [{ key: 'name', label: 'Name' }, { key: 'age', label: 'Age' }],
          ui: { tr: { base: ui.tr.base }, th: { base: ui.th.base }, emptyState: { wrapper: ui.emptyState.wrapper } }
        }
      }
    ],
    [
      'sort',
      {
        props: {
          sort: { column: 'name', direction: 'desc' }, columns: [{ key: 'name', label: 'Name', sortable: true }, { key: 'age', label: 'Age' }],
          ui: { tr: { base: ui.tr.base }, th: { base: ui.th.base }, emptyState: { wrapper: ui.emptyState.wrapper }, default: { sortButton: { icon: ui.default.sortButton } } }
        }
      }
    ],
    [
      'sort mode',
      {
        props: {
          sortMode: 'manual', columns: [{ key: 'name', label: 'Name', sortable: true }, { key: 'age', label: 'Age' }],
          ui: { tr: { base: ui.tr.base }, th: { base: ui.th.base }, emptyState: { wrapper: ui.emptyState.wrapper }, default: { sortButton: { icon: ui.default.sortButton } } }
        }
      }
    ],
    [
      'custom sort button',
      {
        props:
        {
          sortButton: { label: 'Custom button', size: 'xl', variant: 'orange', icon: 'i-heroicons-academic-cap' }, columns: [{ sortable: true, key: 'name', label: 'Name' }, { key: 'age', label: 'Age' }],
          ui: { tr: { base: ui.tr.base }, th: { base: ui.th.base }, emptyState: { wrapper: ui.emptyState.wrapper }, default: { sortButton: { icon: ui.default.sortButton } } }
        }
      }
    ],
    [
      'sort asc icon',
      {
        props:
        {
          sortAscIcon: 'i-heroicons-adjustments-horizontal', sort: { column: 'name', direction: 'asc' }, columns: [{ sortable: true, key: 'name', label: 'Name' }, { key: 'age', label: 'Age' }],
          ui: { tr: { base: ui.tr.base }, th: { base: ui.th.base }, emptyState: { wrapper: ui.emptyState.wrapper }, default: { sortButton: { icon: ui.default.sortButton } } }
        }
      }
    ],
    [
      'sort desc icon',
      {
        props: {
          sortDescIcon: 'i-heroicons-arrow-down-left-solid', sort: { column: 'name', direction: 'desc' }, columns: [{ sortable: true, key: 'name', label: 'Name' }, { key: 'age', label: 'Age' }],
          ui: { tr: { base: ui.tr.base }, th: { base: ui.th.base }, emptyState: { wrapper: ui.emptyState.wrapper }, default: { sortButton: { icon: ui.default.sortButton } } }
        }
      }
    ],
    [
      'loading state',
      {
        props:
        {
          loading: true, loadingState: { icon: 'i-heroicons-sparkles', label: 'Loading...' }, columns: [{ key: 'name', label: 'Name' }, { key: 'age', label: 'Age' }],
          ui: { tr: { base: ui.tr.base }, th: { base: ui.th.base }, loadingState: { wrapper: ui.loadingState.wrapper } }
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
          ui: { tr: { base: ui.tr.base }, th: { base: ui.th.base }, loadingState: { wrapper: ui.loadingState.wrapper } }
        }
      }
    ],
    ['empty state props',
      {
        props:
        {
          rows: [], emptyState: { icon: 'i-heroicons-inbox', label: 'No data available' }, columns: [{ key: 'name', label: 'Name' }, { key: 'age', label: 'Age' }],
          ui: { tr: { base: ui.tr.base }, th: { base: ui.th.base }, emptyState: { wrapper: ui.emptyState.wrapper } }
        }
      }
    ],
    ['empty state slot',
      {
        slots: { 'empty-state': 'Empty state slot' },
        props: {
          emptyState: { label: 'emptyStateLabel', icon: 'i-heroicons-chevron-up-down-solid' }, columns: [{ key: 'name', label: 'Name' }, { key: 'age', label: 'Age' }],
          ui: { tr: { base: ui.tr.base }, th: { base: ui.th.base }, emptyState: { wrapper: ui.emptyState.wrapper } }
        }
      }
    ],
    ['selected rows',
      {
        props: {
          rows: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }, { id: 3, name: 'Doe' }], columns: [{ key: 'name', label: 'Name' }, { key: 'age', label: 'Age' }],
          ui: { tr: { base: ui.tr.base }, th: { base: ui.th.base }, td: { base: ui.td.base }, emptyState: { wrapper: ui.emptyState.wrapper } }
        }
      }
    ],

    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Table.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UTable)
    expect(html).toMatchSnapshot()
  })
})
