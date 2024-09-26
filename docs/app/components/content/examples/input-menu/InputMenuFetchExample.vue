<script setup lang="ts">
const { data: users, status } = await useFetch('https://jsonplaceholder.typicode.com/users', {
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
  <UInputMenu
    :items="users || []"
    :loading="status === 'pending'"
    icon="i-heroicons-user"
    placeholder="Select user"
    class="w-48"
  >
    <template #leading="{ modelValue, ui }">
      <UAvatar
        v-if="modelValue"
        v-bind="modelValue.avatar"
        :size="ui.itemLeadingAvatarSize()"
        :class="ui.itemLeadingAvatar()"
      />
    </template>
  </UInputMenu>
</template>
