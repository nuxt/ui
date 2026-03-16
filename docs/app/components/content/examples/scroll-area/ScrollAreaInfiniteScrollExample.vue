<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core'

type User = {
  id: number
  firstName: string
  lastName: string
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

const { data, status } = useLazyFetch('https://dummyjson.com/users?limit=10&select=firstName,lastName,username,email,image', {
  key: 'scroll-area-users-infinite-scroll',
  params: { skip },
  transform: (data?: UserResponse) => {
    return data?.users
  },
  server: false
})

const users = ref<User[]>([])

watch(data, () => {
  users.value = [
    ...users.value,
    ...(data.value || [])
  ]
})

const isLoading = computed(() => status.value === 'pending' || status.value === 'idle')

const scrollArea = useTemplateRef('scrollArea')

onMounted(() => {
  useInfiniteScroll(scrollArea.value?.$el, () => {
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
  <UScrollArea
    ref="scrollArea"
    :items="users"
    :virtualize="{
      estimateSize: 88,
      skipMeasurement: true
    }"
    class="h-96 w-full"
  >
    <template #default="{ item }">
      <UPageCard
        orientation="horizontal"
        class="rounded-none"
      >
        <UUser
          :name="`${item.firstName} ${item.lastName}`"
          :description="item.email"
          :avatar="{ src: item.image, alt: item.firstName, loading: 'lazy' as const }"
          size="lg"
        />
      </UPageCard>
    </template>

    <template #trailing>
      <div v-if="isLoading" class="flex items-center justify-center p-4">
        <UChatShimmer text="Loading..." />
      </div>
    </template>
  </UScrollArea>
</template>
