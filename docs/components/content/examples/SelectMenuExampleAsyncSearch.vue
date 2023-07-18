<script setup>
const search = async (q) => {
  const users = await $fetch('https://jsonplaceholder.typicode.com/users', { params: { q } })

  return users.map(user => ({ id: user.id, label: user.name, suffix: user.email })).filter(Boolean)
}

const selected = ref([])
</script>

<template>
  <USelectMenu
    v-model="selected"
    :searchable="search"
    placeholder="Search for a user..."
    multiple
    by="id"
  />
</template>
