<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import type { DropdownMenuItem } from '@nuxt/ui'

const searchTerm = ref('')
const searchTermDebounced = refDebounced(searchTerm, 200)

const { data: users, status } = await useLazyFetch('https://jsonplaceholder.typicode.com/users', {
  key: 'dropdown-menu-users-search',
  params: { q: searchTermDebounced },
  transform: (data: { id: number, name: string }[]) => {
    return data?.map(user => ({
      label: user.name,
      avatar: { src: `https://i.pravatar.cc/120?img=${user.id}`, loading: 'lazy' as const }
    })) as DropdownMenuItem[]
  }
})
</script>

<template>
  <UDropdownMenu
    v-model:search-term="searchTerm"
    :items="users || []"
    :loading="status === 'pending'"
    filter
    ignore-filter
    :content="{ align: 'start' }"
    :ui="{ content: 'w-48' }"
  >
    <UButton label="Open" color="neutral" variant="outline" icon="i-lucide-menu" />
  </UDropdownMenu>
</template>
