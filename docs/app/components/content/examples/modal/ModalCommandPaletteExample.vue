<script setup lang="ts">
const searchTerm = ref('')

const { data: users, status, execute } = await useLazyFetch('https://jsonplaceholder.typicode.com/users', {
  key: 'modal-command-palette-users',
  params: { q: searchTerm },
  transform: (data: { id: number, name: string, email: string }[]) => {
    return data?.map(user => ({ id: user.id, label: user.name, suffix: user.email, avatar: { src: `https://i.pravatar.cc/120?img=${user.id}`, loading: 'lazy' as const } })) || []
  },
  immediate: false
})

const groups = computed(() => [{
  id: 'users',
  label: searchTerm.value ? `Users matching “${searchTerm.value}”...` : 'Users',
  items: users.value || [],
  ignoreFilter: true
}])

function onOpen() {
  if (!users.value?.length) {
    execute()
  }
}
</script>

<template>
  <UModal @update:open="onOpen">
    <UButton
      label="Search users..."
      color="neutral"
      variant="subtle"
      icon="i-lucide-search"
    />

    <template #content>
      <UCommandPalette
        v-model:search-term="searchTerm"
        :loading="status === 'pending'"
        :groups="groups"
        placeholder="Search users..."
        class="h-80"
      />
    </template>
  </UModal>
</template>
