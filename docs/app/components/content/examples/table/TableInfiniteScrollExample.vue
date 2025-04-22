<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { useInfiniteScroll } from '@vueuse/core'

const UAvatar = resolveComponent('UAvatar')

type User = {
  id: number
  firstName: string
  username: string
  email: string
  image: string
}

type UserResponse = {
  users: User[]
  total: number
  skip: number
  limit: number
}

const skip = ref(0)

const { data, status, execute } = await useFetch('https://dummyjson.com/users?limit=10&select=firstName,username,email,image', {
  key: 'table-users-infinite-scroll',
  params: { skip },
  transform: (data?: UserResponse) => {
    return data?.users
  },
  lazy: true,
  immediate: false
})

const columns: TableColumn<User>[] = [{
  accessorKey: 'id',
  header: 'ID'
}, {
  accessorKey: 'image',
  header: 'Avatar',
  cell: ({ row }) => h(UAvatar, { src: row.original.image })
}, {
  accessorKey: 'firstName',
  header: 'First name'
}, {
  accessorKey: 'email',
  header: 'Email'
}, {
  accessorKey: 'username',
  header: 'Username'
}]

const users = ref<User[]>([])

watch(data, () => {
  users.value = [
    ...users.value,
    ...(data.value || [])
  ]
})

execute()

const table = useTemplateRef<ComponentPublicInstance>('table')

onMounted(() => {
  useInfiniteScroll(table.value?.$el, () => {
    skip.value += 10
  }, {
    distance: 200,
    canLoadMore: () => {
      return status.value !== 'pending'
    }
  })
})
</script>

<template>
  <div class="w-full">
    <UTable
      ref="table"
      :data="users"
      :columns="columns"
      :loading="status === 'pending'"
      sticky
      class="flex-1 h-80"
    />
  </div>
</template>
