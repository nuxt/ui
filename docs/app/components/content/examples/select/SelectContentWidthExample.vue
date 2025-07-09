<script setup lang="ts">
const value = ref<string>()

const { data: users } = await useFetch('https://jsonplaceholder.typicode.com/users', {
  key: 'typicode-users-email',
  transform: (data: { id: number, name: string, email: string }[]) => {
    return data?.map(user => ({
      label: user.name,
      email: user.email,
      value: String(user.id),
      avatar: { src: `https://i.pravatar.cc/120?img=${user.id}` }
    }))
  },
  lazy: true
})
</script>

<template>
  <USelect
    v-model="value"
    :items="users"
    placeholder="Select user"
    value-key="value"
    :ui="{ content: 'min-w-fit' }"
    class="w-48"
  >
    <template #item-label="{ item }">
      {{ item.label }}

      <span class="text-muted">
        {{ item.email }}
      </span>
    </template>
  </USelect>
</template>
