<script setup lang="ts">
import type { AvatarProps } from '@nuxt/ui'

const { data: users, status, execute } = await useLazyFetch('https://jsonplaceholder.typicode.com/users', {
  key: 'typicode-users',
  transform: (data: { id: number, name: string }[]) => {
    return data?.map(user => ({
      label: user.name,
      value: String(user.id),
      avatar: { src: `https://i.pravatar.cc/120?img=${user.id}`, loading: 'lazy' as const }
    }))
  },
  immediate: false
})

function onOpen() {
  if (!users.value?.length) {
    execute()
  }
}
</script>

<template>
  <UInputMenu
    :items="users"
    :loading="status === 'pending'"
    icon="i-lucide-user"
    placeholder="Select user"
    @update:open="onOpen"
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
