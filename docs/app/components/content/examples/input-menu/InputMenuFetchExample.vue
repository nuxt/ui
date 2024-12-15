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
    icon="i-lucide-user"
    placeholder="Select user"
  >
    <template #leading="{ modelValue, ui }">
      <UAvatar
        v-if="modelValue"
        v-bind="modelValue.avatar"
        :size="ui.leadingAvatarSize()"
        :class="ui.leadingAvatar()"
      />
    </template>
  </UInputMenu>
</template>
