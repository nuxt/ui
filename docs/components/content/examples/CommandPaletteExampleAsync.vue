<script setup lang="ts">
const groups = [{
  key: 'users',
  label: q => q && `Users matching “${q}”...`,
  search: async (q) => {
    if (!q) {
      return []
    }

    // @ts-ignore
    const users: any[] = await $fetch('https://jsonplaceholder.typicode.com/users', { params: { q } })

    return users.map(user => ({ id: user.id, label: user.name, suffix: user.email }))
  }
}]
</script>

<template>
  <UCommandPalette :groups="groups" :autoselect="false" />
</template>
