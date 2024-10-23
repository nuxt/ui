<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

type User = {
  id: number
  name: string
  username: string
  email: string
  avatar: { src: string }
  company: { name: string }
}

const { data: users, status } = await useFetch<User[]>('https://jsonplaceholder.typicode.com/users', {
  transform: (data) => {
    return data?.map(user => ({
      ...user,
      avatar: { src: `https://i.pravatar.cc/120?img=${user.id}` }
    })) || []
  },
  lazy: true
})

const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const columns: TableColumn<User>[] = [{
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
  accessorKey: 'name',
  header: 'Name',
  cell: ({ row }) => {
    // return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => row.getValue('status'))
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
      label: 'Copy payment ID',
      onSelect() {
        navigator.clipboard.writeText(row.original.id)

        toast.add({
          title: 'Payment ID copied to clipboard!',
          color: 'success',
          icon: 'i-heroicons-check-circle'
        })
      }
    }, {
      label: row.getIsExpanded() ? 'Collapse' : 'Expand',
      onSelect() {
        row.toggleExpanded()
      }
    }, {
      type: 'separator'
    }, {
      label: 'View customer'
    }, {
      label: 'View payment details'
    }]

    return h('div', { class: 'text-right' }, h(UDropdownMenu, {
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
</script>

<template>
  <UTable :data="users" :columns="columns" :loading="status === 'pending'" class="flex-1" />
</template>
