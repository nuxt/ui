<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'

interface User {
  id: number
  name: string
  position: string
  email: string
  role: string
}

const toast = useToast()

const data = ref<User[]>([{
  id: 1,
  name: 'Lindsay Walton',
  position: 'Front-end Developer',
  email: 'lindsay.walton@example.com',
  role: 'Member'
}, {
  id: 2,
  name: 'Courtney Henry',
  position: 'Designer',
  email: 'courtney.henry@example.com',
  role: 'Admin'
}, {
  id: 3,
  name: 'Tom Cook',
  position: 'Director of Product',
  email: 'tom.cook@example.com',
  role: 'Member'
}, {
  id: 4,
  name: 'Whitney Francis',
  position: 'Copywriter',
  email: 'whitney.francis@example.com',
  role: 'Admin'
}, {
  id: 5,
  name: 'Leonard Krasner',
  position: 'Senior Designer',
  email: 'leonard.krasner@example.com',
  role: 'Owner'
}, {
  id: 6,
  name: 'Floyd Miles',
  position: 'Principal Designer',
  email: 'floyd.miles@example.com',
  role: 'Member'
}])

const columns: TableColumn<User>[] = [{
  accessorKey: 'id',
  header: 'ID'
}, {
  accessorKey: 'name',
  header: 'Name'
}, {
  accessorKey: 'email',
  header: 'Email'
}, {
  accessorKey: 'role',
  header: 'Role'
}, {
  id: 'action'
}]

function getDropdownActions(user: User): DropdownMenuItem[][] {
  return [
    [{
      label: 'Copy user Id',
      icon: 'i-lucide-copy',
      onSelect: () => {
        navigator.clipboard.writeText(user.id.toString())
        toast.add({
          title: 'User ID copied to clipboard!',
          color: 'success',
          icon: 'i-lucide-circle-check'
        })
      }
    }],
    [{
      label: 'Edit',
      icon: 'i-lucide-edit'
    }, {
      label: 'Delete',
      icon: 'i-lucide-trash',
      color: 'error'
    }]
  ]
}
</script>

<template>
  <UTable :data="data" :columns="columns" class="flex-1">
    <template #name-cell="{ row }">
      <div class="flex items-center gap-3">
        <UAvatar :src="`https://i.pravatar.cc/120?img=${row.original.id}`" size="lg" />
        <div>
          <p class="font-medium text-[var(--ui-text-highlighted)]">
            {{ row.original.name }}
          </p>
          <p>
            {{ row.original.position }}
          </p>
        </div>
      </div>
    </template>
    <template #action-cell="{ row }">
      <UDropdownMenu :items="getDropdownActions(row.original)">
        <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" />
      </UDropdownMenu>
    </template>
  </UTable>
</template>
