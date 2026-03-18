<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import type { AvatarProps } from '@nuxt/ui'

const searchTerm = ref('')
const searchTermDebounced = refDebounced(searchTerm, 200)

const { data: users, status, execute } = await useLazyFetch('https://jsonplaceholder.typicode.com/users', {
  key: 'select-menu-users-search',
  params: { q: searchTermDebounced },
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
  <USelectMenu
    v-model:search-term="searchTerm"
    :items="users"
    :search-input="{
      icon: 'i-lucide-search',
      loading: status === 'pending'
    }"
    ignore-filter
    icon="i-lucide-user"
    placeholder="Select user"
    class="w-48"
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
  </USelectMenu>
</template>
