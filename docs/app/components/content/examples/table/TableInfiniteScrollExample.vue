<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { useInfiniteScroll } from '@vueuse/core'

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
const url = computed(() => `https://dummyjson.com/users?limit=10&skip=${skip.value}&select=firstName,username,email,image`)

const { data, status, execute } = await useFetch(url, {
  key: 'table-users-infinite-scroll',
  transform: (data?: UserResponse) => {
    return data?.users.map(user => ({
      ...user
    }))
  },
  lazy: true,
  immediate: false,
  watch: [skip]
})

execute()

const users = ref<User[]>([])

watch(data, () => {
  users.value = [
    ...users.value,
    ...data.value || []
  ]
})

const columns: TableColumn<User>[] = [{
  accessorKey: 'id',
  header: 'ID'
}, {
  accessorKey: 'image',
  header: 'Avatar',
  cell: ({ row }) => h('img', { src: row.original.image, class: 'h-12 w-auto' })
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

const table = useTemplateRef<ComponentPublicInstance>('table')

onMounted(() => {
  useInfiniteScroll(
    table.value?.$el,
    () => {
      skip.value += 10
    },
    {
      distance: 200,
      canLoadMore: () => {
        if (status.value === 'pending') return false

        return true
      }
    }
  )
})
</script>

<template>
  <UTable
    ref="table"
    :data="users"
    :columns="columns"
    :loading="status === 'pending'"
    sticky
    class="flex-1 h-80"
  />
</template>
