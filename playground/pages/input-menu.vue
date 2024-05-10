<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import type { User } from '~/types'
import theme from '#build/ui/input-menu'

const sizes = Object.keys(theme.variants.size)

const fruits = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']
const vegetables = ['Aubergine', 'Broccoli', 'Carrot', 'Courgette', 'Leek']

const items = [[{ label: 'Fruits', type: 'label' }, ...fruits], [{ label: 'Vegetables', type: 'label' }, ...vegetables]]

const statuses = [{
  label: 'Backlog',
  icon: 'i-heroicons-question-mark-circle'
}, {
  label: 'Todo',
  icon: 'i-heroicons-plus-circle'
}, {
  label: 'In Progress',
  icon: 'i-heroicons-arrow-up-circle'
}, {
  label: 'Done',
  icon: 'i-heroicons-check-circle'
}, {
  label: 'Canceled',
  icon: 'i-heroicons-x-circle'
}]

const searchTerm = ref('')
const searchTermDebounced = refDebounced(searchTerm, 200)

const { data: users, pending } = await useFetch('https://jsonplaceholder.typicode.com/users', {
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
      <UInputMenu :items="items" autofocus />
      <UInputMenu :items="items" placeholder="Search..." color="gray" />
      <UInputMenu :items="items" placeholder="Search..." color="primary" />
      <UInputMenu :items="items" placeholder="Search..." variant="none" />
      <UInputMenu :items="items" placeholder="Disabled" disabled />
      <UInputMenu :items="items" placeholder="Required" required />
      <UInputMenu :items="items" loading placeholder="Search..." />
      <UInputMenu :items="items" loading leading-icon="i-heroicons-magnifying-glass" placeholder="Search..." />
      <UInputMenu :items="statuses" placeholder="Search status..." icon="i-heroicons-magnifying-glass" trailing-icon="i-heroicons-chevron-up-down-20-solid" />
      <UInputMenu
        v-model:search-term="searchTerm"
        :items="users || []"
        :loading="pending"
        :filter="false"
        icon="i-heroicons-user"
        placeholder="Search users..."
        @update:open="searchTerm = ''"
      />
    </div>
    <div class="flex items-center gap-4">
      <UInputMenu
        v-for="size in sizes"
        :key="size"
        :items="items"
        placeholder="Search..."
        :size="(size as any)"
        class="w-60"
      />
    </div>
    <div class="flex items-center gap-4">
      <UInputMenu
        v-for="size in sizes"
        :key="size"
        :items="items"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search..."
        :size="(size as any)"
        class="w-60"
      />
    </div>
    <div class="flex items-center gap-4">
      <UInputMenu
        v-for="size in sizes"
        :key="size"
        :items="items"
        icon="i-heroicons-magnifying-glass"
        trailing
        placeholder="Search..."
        :size="(size as any)"
        class="w-60"
      />
    </div>
  </div>
</template>
