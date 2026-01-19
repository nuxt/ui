<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core'

type User = {
  firstName: string
}

type UserResponse = {
  users: User[]
  total: number
  skip: number
  limit: number
}

const skip = ref(0)

const { data, status, execute } = await useFetch('https://dummyjson.com/users?limit=10&select=firstName', {
  key: 'select-menu-users-infinite-scroll',
  params: { skip },
  transform: (data?: UserResponse) => {
    return data?.users.map(user => user.firstName)
  },
  lazy: true,
  immediate: false
})

const users = ref<string[]>([])

watch(data, () => {
  users.value = [
    ...users.value,
    ...(data.value || [])
  ]
})

execute()

const selectMenu = useTemplateRef('selectMenu')

onMounted(() => {
  useInfiniteScroll(() => selectMenu.value?.viewportRef, () => {
    skip.value += 10
  }, {
    canLoadMore: () => {
      return status.value !== 'pending'
    }
  })
})
</script>

<template>
  <USelectMenu
    ref="selectMenu"
    placeholder="Select user"
    :items="users"
  />
</template>
