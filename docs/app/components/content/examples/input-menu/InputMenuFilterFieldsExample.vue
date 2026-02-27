<script setup lang="ts">
import type { AvatarProps } from '@nuxt/ui'

const { data: users, status } = useFetch('https://jsonplaceholder.typicode.com/users', {
  key: 'typicode-users-email',
  transform: (data: { id: number, name: string, email: string }[]) => {
    return data?.map(user => ({
      label: user.name,
      email: user.email,
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
    :filter-fields="['label', 'email']"
    icon="i-lucide-user"
    placeholder="Select user"
    class="w-80"
  >
    <template #leading="{ modelValue, ui }">
      <UAvatar
        v-if="modelValue"
        v-bind="modelValue.avatar"
        :size="(ui.leadingAvatarSize() as AvatarProps['size'])"
        :class="ui.leadingAvatar()"
      />
    </template>

    <template #item-label="{ item }">
      {{ item.label }}

      <span class="text-muted">
        {{ item.email }}
      </span>
    </template>
  </UInputMenu>
</template>
