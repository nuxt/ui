<script setup lang="ts">
const searchTerm = ref('')
const searchTermDebounced = refDebounced(searchTerm, 200)

const { data: users, status } = await useFetch('https://jsonplaceholder.typicode.com/users', {
  params: { q: searchTermDebounced },
  transform: (data: { id: number, name: string }[]) => {
    return data?.map(user => ({
      label: user.name,
      value: String(user.id),
      avatar: { src: `https://i.pravatar.cc/120?img=${user.id}` }
    })) || []
  },
  lazy: true
})
</script>

<template>
  <USelectMenu
    v-model:search-term="searchTerm"
    :items="users || []"
    :loading="status === 'pending'"
    ignore-filter
    icon="i-lucide-user"
    placeholder="Select user"
    class="w-48"
  >
    <template #leading="{ modelValue, ui }">
      <UAvatar
        v-if="modelValue"
        v-bind="modelValue.avatar"
        :size="ui.leadingAvatarSize()"
        :class="ui.leadingAvatar()"
      />
    </template>
  </USelectMenu>
</template>
