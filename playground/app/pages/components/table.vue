<script setup lang="ts">
import { h } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import { UCheckbox, UButton, UDropdownMenu, UTable } from '#components'
import type { TableColumn } from '@nuxt/ui'

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
  accessorKey: 'status',
  header: 'Status',
  cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('status'))
}, {
  accessorKey: 'email',
  header: ({ column }) => {
    const isSorted = column.getIsSorted()

    return h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label: 'Email',
      icon: isSorted ? (isSorted === 'asc' ? 'i-heroicons-bars-arrow-up-20-solid' : 'i-heroicons-bars-arrow-down-20-solid') : 'i-heroicons-arrows-up-down-20-solid',
      class: '-my-3 -mx-2.5',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
    })
  },
  cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('email'))
}, {
  accessorKey: 'amount',
  header: () => h('div', { class: 'text-right' }, 'Amount'),
  cell: ({ row }) => {
    const amount = Number.parseFloat(row.getValue('amount'))

    // Format the amount as a dollar amount
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)

    return h('div', { class: 'text-right font-medium' }, formatted)
  }
}, {
  id: 'actions',
  enableHiding: false,
  cell: ({ row }) => {
    return h(UDropdownMenu, {
      content: {
        align: 'end'
      },
      items: [{
        type: 'label',
        label: 'Actions'
      }, {
        label: 'Copy payment ID',
        onClick() {
          navigator.clipboard.writeText(row.original.id)
        }
      }, {
        label: 'Expand',
        onClick() {
          row.toggleExpanded()
        }
      }, {
        type: 'separator'
      }, {
        label: 'View customer'
      }, {
        label: 'View payment details'
      }]
    }, h(UButton, {
      icon: 'i-heroicons-ellipsis-vertical-20-solid',
      color: 'neutral',
      variant: 'ghost',
      class: 'ml-auto'
    }))
  }
}]

const table = ref<ComponentExposed<typeof UTable<typeof data[number]>>>()
</script>

<template>
  <div class="w-full">
    <div class="flex gap-2 items-center py-4">
      <UInput
        class="max-w-sm"
        placeholder="Filter emails..."
        :model-value="(table?.tableApi?.getColumn('email')?.getFilterValue() as string)"
        @update:model-value="table?.tableApi?.getColumn('email')?.setFilterValue($event)"
      />

      <UDropdownMenu
        :items="table?.tableApi?.getAllColumns().filter((column) => column.getCanHide())"
        placeholder="Columns"
        variant="outline"
        label-key="id"
        :content="{ align: 'end' }"
      >
        <UButton label="Columns" color="neutral" variant="outline" trailing-icon="i-heroicons-chevron-down-20-solid" class="ml-auto" />
      </UDropdownMenu>

      <!-- <UDropdownMenu>
          <UButton label="Columns"  variant="outline" class="ml-auto">
            Columns <ChevronDown class="ml-2 h-4 w-4" />
            </Button>
          </ubutton>
        <UDropdownMenuContent align="end">
          <UDropdownMenuCheckboxItem
            v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
            :key="column.id"
            class="capitalize"
            :checked="column.getIsVisible()"
            @update:checked="(value) => {
              column.toggleVisibility(!!value)
            }"
          >
            {{ column.id }}
          </UDropdownMenuCheckboxItem>
        </UDropdownMenuContent>
      </UDropdownMenu> -->
    </div>

    <UTable ref="table" :data="data" :columns="columns" class="rounded-[--ui-radius] border-[--ui-border]">
      <template #expanded="{ row }">
        {{ row }}
      </template>
    </UTable>

    <div class="flex items-center justify-between gap-3 border-t border-[--ui-border] pt-4">
      <div class="text-sm text-[--ui-text-muted]">
        {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length }} of
        {{ table?.tableApi?.getFilteredRowModel().rows.length }} row(s) selected.
      </div>

      <div class="flex items-center gap-1.5">
        <UButton
          color="neutral"
          variant="outline"
          :disabled="!table?.tableApi?.getCanPreviousPage()"
          @click="table?.tableApi?.previousPage()"
        >
          Prev
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          :disabled="!table?.tableApi?.getCanNextPage()"
          @click="table?.tableApi?.nextPage()"
        >
          Next
        </UButton>
      </div>
    </div>
  </div>
</template>
