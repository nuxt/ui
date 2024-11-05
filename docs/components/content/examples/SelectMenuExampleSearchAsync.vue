<script setup lang="ts">
const loading = ref(false)
const selected = ref([])

async function search(q: string) {
  loading.value = true

  const users: any[] = await $fetch('https://jsonplaceholder.typicode.com/users', { params: { q } })

  loading.value = false

  return users
}
</script>

<template>
  <USelectMenu
    v-model="selected"
    :loading="loading"
    :searchable="search"
    placeholder="Search for a user..."
    option-attribute="name"
    multiple
    trailing
    by="id"
  />
</template>
