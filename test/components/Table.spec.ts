import { h, ref, computed } from 'vue'
import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { aggregationFn_sum, cellSelectionFeature, cellSpanningFeature, columnGroupingFeature, createGroupedRowModel, rowAggregationFeature, stockFeatures } from '@tanstack/vue-table'
import { upperFirst } from 'scule'
import { renderEach } from '../component-render'
import { UCheckbox, UButton, UBadge, UDropdownMenu } from '#components'
import Table from '../../src/runtime/components/Table.vue'
import type { TableColumn, TableRow } from '../../src/runtime/components/Table.vue'
import type { Virtualizer } from '@tanstack/vue-virtual'
import theme from '#build/ui/table'

async function triggerKeydown(element: Element, init: KeyboardEventInit) {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })
  element.dispatchEvent(event)
  await flushPromises()
  return event
}

describe('Table', () => {
  const loadingColors = Object.keys(theme.variants.loadingColor) as any
  const loadingAnimations = Object.keys(theme.variants.loadingAnimation) as any

  const data = [{
    id: 'm5gr84i9',
    amount: 316,
    status: 'success',
    email: 'ken99@yahoo.com'
  }, {
    id: '3u1reuv4',
    amount: 242,
    status: 'success',
    email: 'Abe45@gmail.com'
  }, {
    id: 'derv1ws0',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@gmail.com'
  }, {
    id: '5kma53ae',
    amount: 874,
    status: 'success',
    email: 'Silas22@gmail.com'
  }, {
    id: 'bhqecj4p',
    amount: 721,
    status: 'failed',
    email: 'carmella@hotmail.com'
  }]

  const columns: TableColumn<typeof data[number]>[] = [{
    id: 'select',
    header: ({ table }) => h(UCheckbox<boolean>, {
      'modelValue': table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? 'indeterminate' : false,
      'onUpdate:modelValue': value => table.toggleAllPageRowsSelected(!!value),
      'label': 'Select all'
    }),
    cell: ({ row }) => h(UCheckbox<boolean>, {
      'modelValue': row.getIsSelected(),
      'onUpdate:modelValue': value => row.toggleSelected(!!value),
      'aria-label': 'Select row'
    }),
    enableSorting: false,
    enableHiding: false
  }, {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => `#${row.getValue('id')}`
  }, {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      return new Date(row.getValue('date')).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  }, {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const color = ({
        paid: 'success',
        failed: 'error',
        refunded: 'neutral'
      } as const)[row.getValue('status') as string]

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => row.getValue('status'))
    }
  }, {
    accessorKey: 'email',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Email',
        icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    meta: {
      class: {
        td: 'lowercase'
      }
    }
  }, {
    accessorKey: 'amount',
    header: 'Amount',
    meta: {
      class: {
        th: 'text-right',
        td: 'text-right font-medium'
      }
    },
    footer: ({ table }) => {
      const total = table.getFilteredRowModel().rows.reduce((acc: number, row: TableRow<typeof data[number]>) => acc + Number.parseFloat(row.getValue('amount')), 0)
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR'
      }).format(total)
      return `Total: ${formatted}`
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'))
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount)
    }
  }, {
    id: 'actions',
    enableHiding: false,
    meta: {
      class: {
        td: 'text-right'
      }
    },
    cell: ({ row }) => {
      const items = [{
        type: 'label',
        label: 'Actions'
      }, {
        label: 'Copy payment ID'
      }, {
        label: row.getIsExpanded() ? 'Collapse' : 'Expand'
      }, {
        type: 'separator'
      }, {
        label: 'View customer'
      }, {
        label: 'View payment details'
      }]

      return h<any>(UDropdownMenu, {
        content: {
          align: 'end'
        },
        items
      }, () => h(UButton, {
        'icon': 'i-lucide-ellipsis-vertical',
        'color': 'neutral',
        'variant': 'ghost',
        'aria-label': 'Actions'
      }))
    }
  }]

  const props = { data }

  const groupedHeaderColumns: TableColumn<typeof data[number]>[] = [
    { accessorKey: 'id', header: 'ID' },
    {
      header: 'Payment',
      columns: [
        { accessorKey: 'email', header: 'Email' },
        {
          header: 'Details',
          columns: [
            { accessorKey: 'status', header: 'Status' },
            { accessorKey: 'amount', header: 'Amount' }
          ]
        }
      ]
    }
  ]

  renderEach(Table, [
    // Props
    ['with data', { props }],
    ['without data', {}],
    ['with empty', { props: { empty: 'There is no data' } }],
    ['with caption', { props: { ...props, caption: 'Table caption' } }],
    ['with columns', { props: { ...props, columns } }],
    ['with sticky', { props: { ...props, sticky: true } }],
    ['with loading', { props: { ...props, loading: true } }],
    ...loadingColors.map((loadingColor: string) => [`with loading color ${loadingColor}`, { props: { ...props, loading: true, loadingColor } }]),
    ...loadingAnimations.map((loadingAnimation: string) => [`with loading animation ${loadingAnimation}`, { props: { ...props, loading: true, loadingAnimation } }]),
    ['with meta prop', { props: { ...props, meta: { class: { tr: 'custom-row-class' }, style: { tr: { backgroundColor: 'lightgray' } } } } }],
    ['with meta field on columns', { props: { ...props, columns: columns.map(c => ({ ...c, meta: { class: { th: 'custom-heading-class', td: 'custom-cell-class' }, style: { th: { backgroundColor: 'black' }, td: { backgroundColor: 'lightgray' } } } })) } }],
    ['with virtualize', { props: { ...props, virtualize: true } }],
    ['with virtualize and sticky', { props: { ...props, columns, virtualize: true, sticky: true } }],
    ['with virtualize external scroll element', { props: { ...props, virtualize: { getScrollElement: () => document.body, scrollMargin: 20 } } }],
    ['with row pinning', { props: { ...props, rowPinning: { top: ['2'], bottom: ['3'] } } }],
    ['with row pinning and virtualization', { props: { ...props, virtualize: true, rowPinning: { top: ['2'], bottom: ['3'] } } }],
    ['with column pinning and footer', { props: { ...props, columns, columnPinning: { start: ['id'], end: ['actions'] } } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'absolute' } }],
    ['with ui', { props: { ...props, ui: { base: 'table-auto' } } }],
    // Slots
    ['with header slot', { props, slots: { 'id-header': () => 'ID Header slot' } }],
    ['with cell slot', { props, slots: { 'id-cell': () => 'ID Cell slot' } }],
    ['with expanded slot', { props, slots: { expanded: () => 'Expanded slot' } }],
    ['with empty slot', { props: { columns }, slots: { empty: () => 'Empty slot' } }],
    ['with loading slot', { props: { columns, loading: true }, slots: { loading: () => 'Loading slot' } }],
    ['with caption slot', { props, slots: { caption: () => 'Caption slot' } }],
    ['with body-top slot', { props, slots: { 'body-top': () => 'Body top slot' } }],
    ['with body-bottom slot', { props, slots: { 'body-bottom': () => 'Body bottom slot' } }]
  ])

  it('merges grouped headers with different depths', async () => {
    const wrapper = await mountSuspended(Table<typeof data[number]>, {
      props: { data, columns: groupedHeaderColumns },
      slots: { 'id-header': 'Custom ID' }
    })

    const rows = wrapper.findAll('thead tr[data-slot="table-tr"]')
    expect(rows.map(row => row.findAll('th').map(th => th.text()))).toEqual([
      ['Custom ID', 'Payment'],
      ['Email', 'Details'],
      ['Status', 'Amount']
    ])
    expect(rows[0]!.findAll('th')[0]!.attributes('rowspan')).toBe('3')
    expect(rows[0]!.findAll('th')[1]!.attributes('colspan')).toBe('3')
    expect(rows[1]!.findAll('th')[0]!.attributes('rowspan')).toBe('2')
    expect(rows[1]!.findAll('th')[1]!.attributes('colspan')).toBe('2')
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('updates merged headers when columns are hidden', async () => {
    const wrapper = await mountSuspended(Table<typeof data[number]>, {
      props: { data, columns: groupedHeaderColumns }
    })

    await wrapper.setProps({ columnVisibility: { status: false, amount: false } })

    const rows = wrapper.findAll('thead tr[data-slot="table-tr"]')
    expect(rows.map(row => row.findAll('th').map(th => th.text()))).toEqual([
      ['ID', 'Payment'],
      ['Email']
    ])
    expect(rows[0]!.find('th').attributes('rowspan')).toBe('2')
    expect(rows[0]!.findAll('th')[1]!.attributes('colspan')).toBeUndefined()

    await wrapper.setProps({ columnVisibility: { email: false, status: false, amount: false } })

    expect(wrapper.findAll('thead th').map(th => th.text())).toEqual(['ID'])
    expect(wrapper.find('thead th').attributes('rowspan')).toBeUndefined()

    await wrapper.setProps({ columnVisibility: {} })

    expect(wrapper.find('thead th').attributes('rowspan')).toBe('3')
    expect(wrapper.findAll('thead th')).toHaveLength(6)
  })

  it('keeps merged headers aligned when columns are reordered and pinned', async () => {
    const wrapper = await mountSuspended(Table<typeof data[number]>, {
      props: {
        data,
        columns: groupedHeaderColumns,
        columnOrder: ['id', 'amount', 'email', 'status'],
        columnPinning: { left: [], right: ['id'] }
      }
    })

    const rows = wrapper.findAll('thead tr[data-slot="table-tr"]')
    expect(rows.map(row => row.findAll('th').map(th => th.text()))).toEqual([
      ['Payment', 'ID'],
      ['Details', 'Email', 'Details'],
      ['Amount', 'Status']
    ])
    const idTh = rows[0]!.findAll('th')[1]!
    expect(idTh.attributes('rowspan')).toBe('3')
    expect(idTh.attributes('data-pinned')).toBe('right')
    expect(rows[1]!.findAll('th')[1]!.attributes('rowspan')).toBe('2')
    expect(wrapper.find('tbody tr').findAll('td').map(td => td.text())).toEqual([
      '316', 'ken99@yahoo.com', 'success', 'm5gr84i9'
    ])
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        ...props,
        columns: columns as any,
        caption: 'Table caption'
      }
    })
    expect(await axe(wrapper.element, {
      rules: {
        // This is just incorrect test setup, and generally something
        // that is in the control of the developer using the component.
        'empty-table-header': { enabled: false }
      }
    })).toHaveNoViolations()
  })

  it('passes accessibility tests with select event', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        ...props,
        columns: columns as any,
        caption: 'Table caption',
        onSelect: () => {}
      }
    })
    expect(await axe(wrapper.element, {
      rules: {
        'empty-table-header': { enabled: false }
      }
    })).toHaveNoViolations()
  })

  it('calls select on Enter and Space', async () => {
    const onSelect = vi.fn()
    const wrapper = await mountSuspended(Table, {
      props: { ...props, onSelect }
    })

    const row = wrapper.find('tbody tr')
    expect(row.attributes('tabindex')).toBe('0')
    expect(row.attributes('role')).toBeUndefined()

    const enterEvent = await triggerKeydown(row.element, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(enterEvent.defaultPrevented).toBe(true)

    const spaceEvent = await triggerKeydown(row.element, { key: ' ' })
    expect(onSelect).toHaveBeenCalledTimes(2)
    expect(spaceEvent.defaultPrevented).toBe(true)
  })

  it('does not call select when a modifier key is held', async () => {
    const onSelect = vi.fn()
    const wrapper = await mountSuspended(Table, {
      props: { ...props, onSelect }
    })

    const row = wrapper.find('tbody tr')
    const metaEvent = await triggerKeydown(row.element, { key: 'Enter', metaKey: true })
    expect(metaEvent.defaultPrevented).toBe(false)

    const shiftEvent = await triggerKeydown(row.element, { key: ' ', shiftKey: true })
    expect(shiftEvent.defaultPrevented).toBe(false)

    expect(onSelect).not.toHaveBeenCalled()

    await triggerKeydown(row.element, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('does not call select on repeated keydown', async () => {
    const onSelect = vi.fn()
    const wrapper = await mountSuspended(Table, {
      props: { ...props, onSelect }
    })

    const row = wrapper.find('tbody tr')
    await row.trigger('keydown', { key: 'Enter', repeat: true })
    const spaceEvent = await triggerKeydown(row.element, { key: ' ', repeat: true })
    expect(spaceEvent.defaultPrevented).toBe(true)
    expect(onSelect).not.toHaveBeenCalled()

    await row.trigger('keydown', { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('does not call select from nested controls', async () => {
    const onSelect = vi.fn()
    const wrapper = await mountSuspended(Table, {
      props: {
        ...props,
        columns: [{
          id: 'controls',
          header: 'Controls',
          cell: () => [
            h('input', { 'type': 'checkbox', 'aria-label': 'Select row' }),
            h('button', { type: 'button' }, 'Edit'),
            h('a', { href: '#' }, 'Details'),
            h('label', {}, [h('input', { type: 'checkbox' }), 'Toggle'])
          ]
        }] as any,
        onSelect
      }
    })

    const checkbox = wrapper.find<HTMLInputElement>('tbody tr input')
    const checkboxEvent = await triggerKeydown(checkbox.element, { key: ' ' })
    expect(checkboxEvent.defaultPrevented).toBe(false)

    const buttonEvent = await triggerKeydown(wrapper.find('tbody tr button').element, { key: ' ' })
    expect(buttonEvent.defaultPrevented).toBe(false)

    const linkEvent = await triggerKeydown(wrapper.find('tbody tr a').element, { key: 'Enter' })
    expect(linkEvent.defaultPrevented).toBe(false)

    await checkbox.trigger('click')
    expect(checkbox.element.checked).toBe(true)

    await wrapper.find('tbody tr button').trigger('click')
    await wrapper.find('tbody tr a').trigger('click')
    await wrapper.find('tbody tr label').trigger('click')
    expect(wrapper.find<HTMLInputElement>('tbody tr label input').element.checked).toBe(true)

    expect(onSelect).not.toHaveBeenCalled()

    await wrapper.find('tbody tr').trigger('keydown', { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('does not call select from a nested contenteditable', async () => {
    const onSelect = vi.fn()
    const wrapper = await mountSuspended(Table, {
      props: {
        ...props,
        columns: [{
          id: 'notes',
          header: 'Notes',
          cell: () => h('div', { contenteditable: 'true' }, 'Notes')
        }] as any,
        onSelect
      }
    })

    const editable = wrapper.find('tbody tr [contenteditable]')
    const enterEvent = await triggerKeydown(editable.element, { key: 'Enter' })
    expect(enterEvent.defaultPrevented).toBe(false)

    const spaceEvent = await triggerKeydown(editable.element, { key: ' ' })
    expect(spaceEvent.defaultPrevented).toBe(false)

    expect(onSelect).not.toHaveBeenCalled()
  })

  it('sets aria-sort on sortable th elements', async () => {
    const sortableColumns: TableColumn<typeof data[number]>[] = [
      { accessorKey: 'id', header: 'Id', enableSorting: true },
      { accessorKey: 'email', header: 'Email', enableSorting: false },
      { accessorKey: 'amount', header: 'Amount' }
    ]

    const wrapper = await mountSuspended(Table, {
      props: { data, columns: sortableColumns as any }
    })

    const [idTh, emailTh, amountTh] = wrapper.findAll('th')
    expect(idTh!.attributes('aria-sort')).toBe('none')
    expect(emailTh!.attributes('aria-sort')).toBeUndefined()
    // No `enableSorting` means no sort UI, so the column must not claim to be sortable.
    expect(amountTh!.attributes('aria-sort')).toBeUndefined()

    await wrapper.setProps({ sorting: [{ id: 'id', desc: false }] })
    expect(wrapper.findAll('th')[0]!.attributes('aria-sort')).toBe('ascending')

    await wrapper.setProps({ sorting: [{ id: 'id', desc: true }] })
    expect(wrapper.findAll('th')[0]!.attributes('aria-sort')).toBe('descending')
  })

  it('only sets a directional aria-sort on the primary sort column', async () => {
    const sortableColumns: TableColumn<typeof data[number]>[] = [
      { accessorKey: 'id', header: 'Id', enableSorting: true },
      { accessorKey: 'email', header: 'Email', enableSorting: true }
    ]

    const wrapper = await mountSuspended(Table, {
      props: {
        data,
        columns: sortableColumns as any,
        sorting: [{ id: 'email', desc: false }, { id: 'id', desc: true }]
      }
    })

    const [idTh, emailTh] = wrapper.findAll('th')
    expect(emailTh!.attributes('aria-sort')).toBe('ascending')
    expect(idTh!.attributes('aria-sort')).toBe('none')
  })

  it('skips sort keys with no th on screen when picking the primary sort column', async () => {
    const sortableColumns: TableColumn<typeof data[number]>[] = [
      { accessorKey: 'id', header: 'Id', enableSorting: true },
      { accessorKey: 'email', header: 'Email', enableSorting: true }
    ]

    const unknownIdWrapper = await mountSuspended(Table, {
      props: {
        data,
        columns: sortableColumns as any,
        sorting: [{ id: 'unknown', desc: false }, { id: 'id', desc: true }]
      }
    })

    expect(unknownIdWrapper.findAll('th')[0]!.attributes('aria-sort')).toBe('descending')

    const hiddenColumnWrapper = await mountSuspended(Table, {
      props: {
        data,
        columns: sortableColumns as any,
        columnVisibility: { email: false },
        sorting: [{ id: 'email', desc: false }, { id: 'id', desc: true }]
      }
    })

    const visibleThs = hiddenColumnWrapper.findAll('thead th')
    expect(visibleThs.length).toBe(1)
    expect(visibleThs[0]!.attributes('aria-sort')).toBe('descending')
  })

  it('spans a header over the placeholders above it', async () => {
    const groupedColumns: TableColumn<typeof data[number]>[] = [
      { header: 'Group', columns: [{ accessorKey: 'id', header: 'Id', footer: 'Id total', enableSorting: true }] },
      { accessorKey: 'email', header: 'Email', enableSorting: true }
    ]

    const wrapper = await mountSuspended(Table, {
      props: { data, columns: groupedColumns as any, sorting: [{ id: 'email', desc: false }] },
      slots: { 'email-header': () => 'Email slot' }
    })

    const [firstRow, secondRow] = wrapper.findAll('thead tr')
    const [groupTh, emailTh] = firstRow!.findAll('th')
    expect(groupTh!.attributes('aria-sort')).toBeUndefined()
    expect(emailTh!.attributes('rowspan')).toBe('2')
    expect(emailTh!.attributes('aria-sort')).toBe('ascending')
    expect(emailTh!.text()).toBe('Email slot')
    expect(secondRow!.findAll('th').map(th => th.text())).toEqual(['Id'])

    const footerThs = wrapper.findAll('tfoot th')
    expect(footerThs.length).toBeGreaterThan(0)
    expect(footerThs.every(th => th.attributes('aria-sort') === undefined && th.attributes('rowspan') === undefined)).toBe(true)
  })

  it('does not set aria-sort on th elements the table cannot sort', async () => {
    const sortableColumns: TableColumn<typeof data[number]>[] = [
      { accessorKey: 'id', header: 'Id', enableSorting: true },
      { accessorKey: 'email', header: 'Email', enableSorting: true }
    ]

    const disabledWrapper = await mountSuspended(Table, {
      props: { data, columns: sortableColumns as any, options: { enableSorting: false } }
    })

    expect(disabledWrapper.findAll('th').every(th => th.attributes('aria-sort') === undefined)).toBe(true)

    const displayColumns: TableColumn<typeof data[number]>[] = [
      { id: 'actions', header: 'Actions' },
      { accessorKey: 'id', header: 'Id' }
    ]

    const defaultColumnWrapper = await mountSuspended(Table, {
      props: { data, columns: displayColumns as any, defaultColumn: { enableSorting: true } }
    })

    const [actionsTh, idTh] = defaultColumnWrapper.findAll('th')
    expect(actionsTh!.attributes('aria-sort')).toBeUndefined()
    expect(idTh!.attributes('aria-sort')).toBe('none')
  })

  it.each([
    ['globalFilter', '', 'carmella'],
    ['columnFilters', [], [{ id: 'email', value: 'carmella' }]],
    ['columnOrder', [], ['email', 'id']],
    ['columnVisibility', {}, { email: false }],
    ['columnPinning', { start: [], end: [] }, { start: ['id'], end: [] }],
    ['columnSizing', {}, { id: 200 }],
    ['columnResizing', {}, { columnSizingStart: [], deltaOffset: null, deltaPercentage: null, isResizingColumn: 'id', startOffset: null, startSize: null }],
    ['rowSelection', {}, { 0: true }],
    ['rowPinning', { top: [], bottom: [] }, { top: ['0'], bottom: [] }],
    ['sorting', [], [{ id: 'id', desc: true }]],
    ['grouping', [], ['status']],
    ['expanded', {}, { 0: true }],
    ['pagination', { pageIndex: 0, pageSize: 10 }, { pageIndex: 1, pageSize: 2 }],
    ['cellSelection', [], [{ anchorRowId: '0', anchorColumnId: 'id', focusRowId: '0', focusColumnId: 'id' }]]
  ])('updates a bound %s model through TanStack', async (key, initial, value) => {
    const onUpdate = vi.fn()
    const wrapper = await mountSuspended(Table, {
      props: { data, features: stockFeatures, [key]: initial, [`onUpdate:${key}`]: onUpdate }
    })
    ;(wrapper.vm as any).tableApi[`set${upperFirst(key)}`](value)

    expect(onUpdate).toHaveBeenLastCalledWith(value)
  })

  it('updates a model bound after setup', async () => {
    const onUpdate = vi.fn()
    const wrapper = await mountSuspended(Table, { props: { data, 'onUpdate:sorting': onUpdate } })
    await wrapper.setProps({ sorting: [] })
    ;(wrapper.vm as any).tableApi.setSorting([{ id: 'id', desc: true }])

    expect(onUpdate).toHaveBeenLastCalledWith([{ id: 'id', desc: true }])
  })

  it('keeps an unbound slice in TanStack state', async () => {
    const wrapper = await mountSuspended(Table, { props: { data } })
    ;(wrapper.vm as any).tableApi.setColumnVisibility({ email: false })
    await flushPromises()

    expect(wrapper.findAll('th').map(th => th.text())).not.toContain('Email')
  })

  it('renders aggregated cells with aggregatedCell and leaves placeholder cells empty', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        data,
        columns: [
          { accessorKey: 'status', header: 'Status' },
          { accessorKey: 'amount', header: 'Amount', aggregationFn: 'sum', aggregatedCell: ({ getValue }: any) => `Total ${getValue()}` }
        ] as any,
        grouping: ['status'],
        expanded: true,
        features: { columnGroupingFeature, rowAggregationFeature, groupedRowModel: createGroupedRowModel(), aggregationFns: { sum: aggregationFn_sum } }
      }
    })

    const rows = wrapper.findAll('tbody tr')
    const successTotal = data.filter(row => row.status === 'success').reduce((acc, row) => acc + row.amount, 0)
    expect(rows[0]!.findAll('td').map(td => td.text())).toEqual(['success', `Total ${successTotal}`])
    expect(rows[1]!.findAll('td')[0]!.text()).toBe('')
  })

  it('spans cells with the cell spanning feature', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        data: [{ category: 'A', name: 'One', note: 'x' }, { category: 'A', name: 'Two', note: 'y' }, { category: 'B', name: 'Three', note: 'z' }],
        columns: [
          { accessorKey: 'category', header: 'Category', spanRows: true },
          { accessorKey: 'name', header: 'Name', spanColumns: ({ row }: any) => row.original.category === 'B' ? 2 : 1 },
          { accessorKey: 'note', header: 'Note' }
        ] as any,
        features: { cellSpanningFeature }
      }
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows[0]!.findAll('td')[0]!.attributes('rowspan')).toBe('2')
    expect(rows[1]!.findAll('td').map(td => td.text())).toEqual(['Two', 'y'])
    expect(rows[2]!.findAll('td').map(td => td.text())).toEqual(['B', 'Three'])
    expect(rows[2]!.findAll('td')[1]!.attributes('colspan')).toBe('2')
  })

  it('selects cells with the pointer and the keyboard', async () => {
    const wrapper = await mountSuspended(Table, {
      props: { data: data.slice(0, 3), columns: [{ accessorKey: 'id' }, { accessorKey: 'email' }] as any, features: { cellSelectionFeature } },
      attachTo: document.body
    })

    const firstCell = () => wrapper.findAll('tbody tr')[0]!.findAll('td')[0]!
    await firstCell().trigger('mousedown', { button: 0 })
    expect(firstCell().attributes('data-selected')).toBe('true')
    expect(firstCell().attributes('tabindex')).toBe('0')

    await firstCell().trigger('keydown', { key: 'ArrowDown', shiftKey: true })
    expect(wrapper.findAll('tbody tr')[1]!.findAll('td')[0]!.attributes('data-selected')).toBe('true')
    expect(firstCell().attributes('data-selected')).toBe('true')

    await firstCell().trigger('keydown', { key: 'ArrowRight' })
    expect(firstCell().attributes('data-selected')).toBe('false')
    expect(wrapper.findAll('tbody tr')[0]!.findAll('td')[1]!.attributes('tabindex')).toBe('0')

    wrapper.unmount()
  })

  it('renders a resize handle on columns that enable resizing', async () => {
    const wrapper = await mountSuspended(Table, {
      props: { data, columns: [{ accessorKey: 'id', header: 'Id', enableResizing: true, size: 120 }, { accessorKey: 'email', header: 'Email' }] as any }
    })

    const [idTh, emailTh] = wrapper.findAll('thead th')
    expect(idTh!.find('[data-slot="table-resizer"]').exists()).toBe(true)
    expect(idTh!.attributes('style')).toContain('width: 120px')
    expect(emailTh!.find('[data-slot="table-resizer"]').exists()).toBe(false)
  })

  it('binds meta attrs on rows and cells', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        data: data.slice(0, 1),
        columns: [{ accessorKey: 'id', header: 'Id', meta: { attrs: { th: { 'data-th': 'id' }, td: (cell: any) => ({ 'data-td': cell.getValue() }) } } }] as any,
        meta: { attrs: { tr: (row: any) => ({ 'data-id': row.original.id, 'tabindex': -1 }) } },
        onSelect: () => {}
      }
    })

    const tr = wrapper.find('tbody tr')
    expect(tr.attributes('data-id')).toBe(data[0]!.id)
    expect(tr.attributes('tabindex')).toBe('-1')
    expect(tr.find('td').attributes('data-td')).toBe(data[0]!.id)
    expect(wrapper.find('thead th').attributes('data-th')).toBe('id')
  })

  it('marks rows selectable from an enableRowSelection predicate', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        data: data.slice(0, 2),
        columns: [{ accessorKey: 'id' }] as any,
        options: { enableRowSelection: (row: any) => row.index === 0 },
        onSelect: () => {}
      }
    })

    expect(wrapper.findAll('tbody tr').map(tr => tr.attributes('data-selectable'))).toEqual(['true', 'false'])
  })

  describe('defaultColumn', () => {
    const defaultColumn = {
      header: ({ column }: any) => `H:${column.id}`,
      cell: ({ getValue }: any) => `C:${getValue()}`
    }

    it('applies cell and header with explicit columns', async () => {
      const wrapper = await mountSuspended(Table, {
        props: { data: [{ id: 1 }], columns: [{ accessorKey: 'id' }], defaultColumn }
      })

      expect(wrapper.find('th').text()).toBe('H:id')
      expect(wrapper.find('td').text()).toBe('C:1')
    })

    it('applies header with auto-generated columns', async () => {
      const wrapper = await mountSuspended(Table, {
        props: { data: [{ id: 1 }], defaultColumn: { header: defaultColumn.header } }
      })

      expect(wrapper.find('th').text()).toBe('H:id')
    })

    it('applies cell with auto-generated columns', async () => {
      const wrapper = await mountSuspended(Table, {
        props: { data: [{ id: 1 }], defaultColumn: { cell: defaultColumn.cell } }
      })

      expect(wrapper.find('td').text()).toBe('C:1')
    })

    it('lets a column\'s own cell win over defaultColumn', async () => {
      const wrapper = await mountSuspended(Table, {
        props: { data: [{ id: 1 }], columns: [{ accessorKey: 'id', cell: () => 'own' }], defaultColumn }
      })

      expect(wrapper.find('td').text()).toBe('own')
    })
  })

  it('reactive columns', async () => {
    const wrapper = await mountSuspended({
      components: { Table },
      setup() {
        const filter = ref<1 | 2>(1)

        const columns = computed<TableColumn<typeof data[number]>[]>(() => [
          {
            accessorKey: 'id'
          },
          ...(filter.value === 2
            ? [
              {
                accessorKey: 'amount',
                header: () => h('div', { ['data-test-th']: 'amount' }, 'Amount')
              } satisfies TableColumn<typeof data[number]>
              ]
            : [])
        ])

        function onClick() {
          filter.value = 2
        }

        return { data, columns, onClick }
      },
      template: `
            <div>
              <button @click="onClick">Change filter</button>
              <Table :data :columns />
            </div>
          `
    })

    expect(wrapper.find('[data-test-th="amount"]').exists()).toBeFalsy()

    wrapper.find('button').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-test-th="amount"]').exists()).toBeTruthy()
  })

  it('excludes hidden columns from colspan', async () => {
    const columnVisibility = { email: false }
    const visibleColumns = String(columns.length - 1)

    const empty = await mountSuspended(Table, {
      props: { columns: columns as any, columnVisibility }
    })

    expect(empty.find('[data-slot="table-empty"]').attributes('colspan')).toBe(visibleColumns)

    const expanded = await mountSuspended(Table, {
      props: { ...props, columns: columns as any, columnVisibility, expanded: { 0: true } },
      slots: { expanded: () => 'Expanded slot' }
    })

    expect(expanded.findAll('td').find(td => td.text() === 'Expanded slot')?.attributes('colspan')).toBe(visibleColumns)
  })

  it.each([
    ['default index attribute', undefined, 'data-index'],
    ['custom index attribute', 'data-row-index', 'data-row-index']
  ])('measures virtualized rows with %s', async (_name: string, indexAttribute: string | undefined, attribute: string) => {
    const measureElement = vi.fn(() => 50)

    const wrapper = await mountSuspended(Table, {
      props: {
        data,
        // jsdom has no layout, so give the virtualizer a viewport to render rows into
        virtualize: { observeElementRect: (_, cb) => cb({ width: 1000, height: 500 }), measureElement, indexAttribute }
      },
      attachTo: document.body
    })
    await flushPromises()

    const rows = wrapper.findAll(`tbody tr[${attribute}]`)

    expect(rows.length).toBe(data.length)
    expect(rows.map(row => row.attributes(attribute))).toEqual(data.map((_, index) => String(index)))
    expect(rows.every(row => !row.attributes('style')?.includes('height'))).toBe(true)
    expect(measureElement).toHaveBeenCalled()

    wrapper.unmount()
  })

  it.each([
    ['default item key', false],
    ['custom item key', true]
  ])('keeps measured heights with their rows when sorting virtualized rows with %s', async (_name: string, customKey: boolean) => {
    // Give each row its own height, read from the id it renders
    const heights = Object.fromEntries(data.map((row, index) => [row.id, 40 + index * 10]))
    const measureElement = (el: Element) => heights[data.find(row => el.textContent?.includes(row.id))!.id]!
    const sorted = data.map((row, index) => ({ ...row, index })).sort((a, b) => b.amount - a.amount)
    // A custom key with a stable reference that reads the current order
    let order = data.map((_, index) => index)
    const getItemKey = customKey ? (index: number) => `key-${order[index]}` : undefined
    let virtualizer: Virtualizer<Element, Element> | undefined

    const wrapper = await mountSuspended(Table, {
      props: {
        data,
        virtualize: {
          observeElementRect: (_, cb) => cb({ width: 1000, height: 500 }),
          measureElement,
          getItemKey,
          onChange: (instance) => {
            virtualizer = instance
          }
        }
      },
      attachTo: document.body
    })
    await flushPromises()

    order = sorted.map(row => row.index)
    await wrapper.setProps({ sorting: [{ id: 'amount', desc: true }] })
    await flushPromises()

    const items = virtualizer!.getVirtualItems()

    expect(items.map(item => item.key)).toEqual(sorted.map(row => customKey ? `key-${row.index}` : String(row.index)))
    expect(items.map(item => item.size)).toEqual(sorted.map(row => heights[row.id]))

    wrapper.unmount()
  })

  it.each([
    ['default measurement', undefined, 40],
    ['custom measurement', (el: Element) => el.hasAttribute('data-index') ? 30 : 0, 30]
  ])('measures the expanded row along with its virtualized row with %s', async (_name: string, measureElement: ((el: Element) => number) | undefined, rowHeight: number) => {
    // happy-dom has no layout: rows are 40px tall, expanded rows 100px
    const offsetHeight = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
      return this.tagName !== 'TR' ? 0 : this.hasAttribute('data-index') ? 40 : 100
    })
    let virtualizer: Virtualizer<Element, Element> | undefined

    const wrapper = await mountSuspended(Table, {
      props: {
        data,
        expanded: { 0: true },
        virtualize: {
          observeElementRect: (_, cb) => cb({ width: 1000, height: 500 }),
          measureElement,
          onChange: (instance) => {
            virtualizer = instance
          }
        }
      },
      slots: { expanded: () => 'Expanded slot' },
      attachTo: document.body
    })
    await flushPromises()

    const sizes = () => virtualizer!.getVirtualItems().map(item => item.size - rowHeight)

    expect(sizes()).toEqual([100, 0, 0, 0, 0])

    await wrapper.setProps({ expanded: { 2: true } })
    await flushPromises()

    expect(sizes()).toEqual([0, 0, 100, 0, 0])

    await wrapper.setProps({ expanded: {} })
    await flushPromises()

    expect(sizes()).toEqual([0, 0, 0, 0, 0])

    wrapper.unmount()
    offsetHeight.mockRestore()
  })

  it('does not re-render virtualized rows when the visible range is unchanged', async () => {
    const renderCell = vi.fn(() => 'cell')
    let onScroll: ((offset: number, isScrolling: boolean) => void) | undefined
    let virtualizer: Virtualizer<Element, Element> | undefined

    const wrapper = await mountSuspended(Table, {
      props: {
        data,
        virtualize: {
          observeElementRect: (_, cb) => cb({ width: 1000, height: 500 }),
          observeElementOffset: (_, cb) => {
            onScroll = cb
          },
          onChange: (instance) => {
            virtualizer = instance
          }
        }
      },
      slots: { 'id-cell': renderCell },
      attachTo: document.body
    })
    await flushPromises()

    const range = virtualizer!.getVirtualItems().map(item => item.index)
    renderCell.mockClear()

    // Starting to scroll notifies the virtualizer's listeners without changing the rendered rows
    onScroll!(5, true)
    await flushPromises()

    expect(virtualizer!.getVirtualItems().map(item => item.index)).toEqual(range)
    expect(renderCell).not.toHaveBeenCalled()

    wrapper.unmount()
  })
})
