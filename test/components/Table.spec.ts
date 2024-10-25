import { h } from 'vue'
import { describe, it, expect } from 'vitest'
import { UCheckbox, UButton, UBadge, UDropdownMenu } from '#components'
import Table, { type TableProps, type TableSlots, type TableColumn } from '../../src/runtime/components/Table.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/table'

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
    header: ({ table }) => h(UCheckbox, {
      'modelValue': table.getIsAllPageRowsSelected(),
      'indeterminate': table.getIsSomePageRowsSelected(),
      'onUpdate:modelValue': (value: boolean) => table.toggleAllPageRowsSelected(!!value),
      'ariaLabel': 'Select all'
    }),
    cell: ({ row }) => h(UCheckbox, {
      'modelValue': row.getIsSelected(),
      'onUpdate:modelValue': (value: boolean) => row.toggleSelected(!!value),
      'ariaLabel': 'Select row'
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
        paid: 'success' as const,
        failed: 'error' as const,
        refunded: 'neutral' as const
      })[row.getValue('status') as string]

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
        icon: isSorted ? (isSorted === 'asc' ? 'i-heroicons-bars-arrow-up-20-solid' : 'i-heroicons-bars-arrow-down-20-solid') : 'i-heroicons-arrows-up-down-20-solid',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('email'))
  }, {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, 'Amount'),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'))

      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount)

      return h('div', { class: 'text-right font-medium' }, formatted)
    }
  }, {
    id: 'actions',
    enableHiding: false,
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

      return h('div', { class: 'text-right' }, h<any>(UDropdownMenu, {
        content: {
          align: 'end'
        },
        items
      }, () => h(UButton, {
        icon: 'i-heroicons-ellipsis-vertical-20-solid',
        color: 'neutral',
        variant: 'ghost',
        class: 'ml-auto'
      })))
    }
  }]

  const props = { data }

  it.each([
    // Props
    ['with data', { props }],
    ['without results', {}],
    ['with columns', { props: { ...props, columns } }],
    ['with sticky', { props: { ...props, sticky: true } }],
    ['with loading', { props: { ...props, loading: true } }],
    ...loadingColors.map((loadingColor: string) => [`with loading color ${loadingColor}`, { props: { ...props, loading: true, loadingColor } }]),
    ...loadingAnimations.map((loadingAnimation: string) => [`with loading animation ${loadingAnimation}`, { props: { ...props, loading: true, loadingAnimation } }]),
    ['with class', { props: { ...props, class: 'absolute' } }],
    ['with ui', { props: { ...props, ui: { base: 'table-auto' } } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: TableProps<typeof data[number]>, slots?: Partial<TableSlots<typeof data[number]>> }) => {
    const html = await ComponentRender(nameOrHtml, options, Table)
    expect(html).toMatchSnapshot()
  })
})
