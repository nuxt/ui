<script setup lang="ts">
import theme from '#build/ui/select'
import type { User } from '~/types'

const sizes = Object.keys(theme.variants.size)

const fruits = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']
const vegetables = ['Aubergine', 'Broccoli', 'Carrot', 'Courgette', 'Leek']

const items = [[{ label: 'Fruits', type: 'label' }, ...fruits], [{ label: 'Vegetables', type: 'label' }, ...vegetables]]

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

const { data: users, pending } = await useFetch('https://jsonplaceholder.typicode.com/users', {
  transform: (data: User[]) => {
    return data?.map(user => ({ label: user.name, value: user.id, avatar: { src: `https://i.pravatar.cc/120?img=${user.id}` } })) || []
  },
  lazy: true
})
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex flex-col gap-4 w-60">
      <USelect :items="items" />
      <USelect :items="items" placeholder="Search..." color="gray" />
      <USelect :items="items" placeholder="Search..." color="primary" />
      <USelect :items="items" placeholder="Search..." variant="none" />
      <USelect :items="items" placeholder="Disabled" disabled />
      <USelect :items="items" placeholder="Required" required />
      <USelect :items="items" loading placeholder="Search..." />
      <USelect :items="statuses" placeholder="Search status..." icon="i-heroicons-magnifying-glass" trailing-icon="i-heroicons-chevron-up-down-20-solid" />
      <USelect :items="users || []" :loading="pending" icon="i-heroicons-user" placeholder="Search users..." />
    </div>
    <div class="flex items-center gap-4">
      <USelect
        v-for="size in sizes"
        :key="size"
        :items="items"
        placeholder="Search..."
        :size="(size as any)"
        class="w-60"
      />
    </div>
    <div class="flex items-center gap-4">
      <USelect
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
      <USelect
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
