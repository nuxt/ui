<script setup lang="ts">
import type { AvatarProps } from '@nuxt/ui'

const { data: users, status } = useFetch('https://jsonplaceholder.typicode.com/users', {
  key: 'typicode-users',
  transform: (data: { id: number, name: string }[]) => {
    return data?.map(user => ({
      label: user.name,
      value: String(user.id),
      avatar: { src: `https://i.pravatar.cc/120?img=${user.id}`, loading: 'lazy' as const }
    }))
  },
  lazy: true,
  server: false
})
</script>

<template>
  <UInputMenu
    :items="users"
    :loading="status !== 'success'"
    icon="i-lucide-user"
    placeholder="Select user"
  >
    <template #leading="{ modelValue, ui }">
      <UAvatar
        v-if="modelValue"
        v-bind="modelValue.avatar"
        :size="(ui.leadingAvatarSize() as AvatarProps['size'])"
        :class="ui.leadingAvatar()"
      />
    </template>
  </UInputMenu>
</template>
