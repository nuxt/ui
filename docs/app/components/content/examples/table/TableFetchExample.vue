<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

const UAvatar = resolveComponent('UAvatar')

type User = {
  id: number
  name: string
  username: string
  email: string
  avatar: { src: string }
  company: { name: string }
}

const { data, status } = await useFetch<User[]>('https://jsonplaceholder.typicode.com/users', {
  transform: (data) => {
    return data?.map(user => ({
      ...user,
      avatar: { src: `https://i.pravatar.cc/120?img=${user.id}` }
    })) || []
  },
  lazy: true
})

const columns: TableColumn<User>[] = [{
  accessorKey: 'id',
  header: 'ID'
}, {
  accessorKey: 'name',
  header: 'Name',
  cell: ({ row }) => {
    return h('div', { class: 'flex items-center gap-3' }, [
      h(UAvatar, {
        ...row.original.avatar,
        size: 'lg'
      }),
      h('div', undefined, [
        h('p', { class: 'font-medium text-[var(--ui-text-highlighted)]' }, row.original.name),
        h('p', { class: '' }, `@${row.original.username}`)
      ])
    ])
  }
}, {
  accessorKey: 'email',
  header: 'Email'
}, {
  accessorKey: 'company',
  header: 'Company',
  cell: ({ row }) => row.original.company.name
}]
</script>

<template>
  <UTable :data="data" :columns="columns" :loading="status === 'pending'" class="flex-1" />
</template>
