<script setup lang="ts">
const { data: users, status, execute } = await useLazyFetch('https://jsonplaceholder.typicode.com/users', {
  key: 'listbox-users-email',
  transform: (data: { id: number, name: string, email: string }[]) => {
    return data?.map(user => ({
      label: user.name,
      email: user.email,
      value: String(user.id)
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
    :items="users || []"
    :loading="status === 'pending'"
    :filter-fields="['label', 'email']"
    filter
    class="w-full"
  >
    <template #item-label="{ item }">
      {{ item.label }}

      <span class="text-muted">
        {{ item.email }}
      </span>
    </template>
  </UListbox>
</template>
