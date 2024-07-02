<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import theme from '#build/ui/select-menu'
import type { User } from '~/types'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>

const fruits = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']
const vegetables = ['Aubergine', 'Broccoli', 'Carrot', 'Courgette', 'Leek']

const items = [[{ label: 'Fruits', type: 'label' }, ...fruits], [{ label: 'Vegetables', type: 'label' }, ...vegetables]]
const selectedItems = ref([fruits[0], vegetables[0]])

const statuses = [{
  label: 'Backlog',
  value: 'backlog',
  icon: 'i-heroicons-question-mark-circle'
}, {
  label: 'Todo',
  value: 'todo',
  icon: 'i-heroicons-plus-circle'
}, {
  label: 'In Progress',
  value: 'in_progress',
  icon: 'i-heroicons-arrow-up-circle'
}, {
  label: 'Done',
  value: 'done',
  icon: 'i-heroicons-check-circle'
}, {
  label: 'Canceled',
  value: 'canceled',
  icon: 'i-heroicons-x-circle'
}]

const searchTerm = ref('')
const searchTermDebounced = refDebounced(searchTerm, 200)

const { data: users, status } = await useFetch('https://jsonplaceholder.typicode.com/users', {
  params: { q: searchTermDebounced },
  transform: (data: User[]) => {
    return data?.map(user => ({ id: user.id, label: user.name, avatar: { src: `https://i.pravatar.cc/120?img=${user.id}` } })) || []
  },
  lazy: true
})
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex flex-col gap-4 w-60">
      <USelectMenu :items="items" />
      <USelectMenu :items="items" placeholder="Search..." color="gray" />
      <USelectMenu :items="items" placeholder="Search..." color="primary" />
      <USelectMenu :items="items" placeholder="Search..." variant="none" />
      <USelectMenu :items="items" placeholder="Disabled" disabled />
      <USelectMenu :items="items" placeholder="Required" required />
      <USelectMenu v-model="selectedItems" :items="items" placeholder="Multiple" multiple />
      <USelectMenu :items="items" loading placeholder="Search..." />
    </div>
    <div class="flex items-center gap-4">
      <USelectMenu
        v-for="size in sizes"
        :key="size"
        :items="items"
        placeholder="Search..."
        :size="size"
        class="w-60"
      />
    </div>
    <div class="flex items-center gap-4">
      <USelectMenu
        v-for="size in sizes"
        :key="size"
        :items="statuses"
        placeholder="Search status..."
        icon="i-heroicons-magnifying-glass"
        trailing-icon="i-heroicons-chevron-up-down-20-solid"
        :size="size"
        class="w-60"
      >
        <template #leading="{ modelValue, ui }">
          <UIcon v-if="modelValue" :name="modelValue.icon" :class="ui.leadingIcon()" />
        </template>
      </USelectMenu>
    </div>
    <div class="flex items-center gap-4">
      <USelectMenu
        v-for="size in sizes"
        :key="size"
        v-model:search-term="searchTerm"
        :items="users || []"
        :loading="status === 'pending'"
        :filter="false"
        icon="i-heroicons-user"
        placeholder="Search users..."
        :size="size"
        class="w-60"
        @update:open="searchTerm = ''"
      >
        <template #leading="{ modelValue, ui }">
          <UAvatar v-if="modelValue?.avatar" :size="ui.itemLeadingAvatarSize()" v-bind="modelValue.avatar" />
        </template>
      </USelectMenu>
    </div>
  </div>
</template>
