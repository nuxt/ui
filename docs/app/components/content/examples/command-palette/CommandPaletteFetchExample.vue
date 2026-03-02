<script setup lang="ts">
const searchTerm = ref('')

const { data: users, status } = useLazyFetch('https://jsonplaceholder.typicode.com/users', {
  key: 'command-palette-users',
  transform: (data: { id: number, name: string, email: string }[]) => {
    return data?.map(user => ({ id: user.id, label: user.name, suffix: user.email, avatar: { src: `https://i.pravatar.cc/120?img=${user.id}`, loading: 'lazy' as const } })) || []
  },
  server: false
})

const groups = computed(() => [{
  id: 'users',
  label: searchTerm.value ? `Users matching “${searchTerm.value}”...` : 'Users',
  items: users.value || []
}])
</script>

<template>
  <UCommandPalette
    v-model:search-term="searchTerm"
    :loading="status === 'pending' || status === 'idle'"
    :groups="groups"
    class="flex-1 h-80"
  />
</template>
