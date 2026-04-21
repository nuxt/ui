<script setup lang="ts">
import { refDebounced } from '@vueuse/core'

const searchTerm = ref('')
const searchTermDebounced = refDebounced(searchTerm, 200)

const { data: users, status, execute } = await useLazyFetch('https://jsonplaceholder.typicode.com/users', {
  key: 'listbox-users-search',
  params: { q: searchTermDebounced },
  transform: (data: { id: number, name: string }[]) => {
    return data?.map(user => ({
      label: user.name,
      value: String(user.id),
      avatar: { src: `https://i.pravatar.cc/120?img=${user.id}`, loading: 'lazy' as const }
    }))
  },
  immediate: false
})

onMounted(() => {
  execute()
})
</script>

<template>
  <UListbox
    v-model:search-term="searchTerm"
    :items="users || []"
    :filter="{
      icon: 'i-lucide-search',
      loading: status === 'pending'
    }"
    ignore-filter
    class="w-full"
  />
</template>
