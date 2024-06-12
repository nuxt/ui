<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import type { User } from '~/types'
import theme from '#build/ui/input-menu'

const sizes = Object.keys(theme.variants.size)

const fruits = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']
const vegetables = ['Aubergine', 'Broccoli', 'Carrot', 'Courgette', 'Leek']

const items = [[{ label: 'Fruits', type: 'label' }, ...fruits], [{ label: 'Vegetables', type: 'label' }, ...vegetables]]
const selectedItems = ref([fruits[0], vegetables[0]])

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
      <UInputMenu v-model="selectedItems" :items="items" placeholder="Multiple" multiple />
      <UInputMenu :items="items" loading placeholder="Search..." />
      <UInputMenu :items="statuses" placeholder="Search status..." icon="i-heroicons-magnifying-glass" trailing-icon="i-heroicons-chevron-up-down-20-solid">
        <template #leading="{ modelValue }">
          <UIcon v-if="modelValue?.icon" :name="modelValue.icon" class="size-5" />
        </template>
      </UInputMenu>
      <UInputMenu
        v-model:search-term="searchTerm"
        :items="users || []"
        :loading="pending"
        :filter="false"
        icon="i-heroicons-user"
        placeholder="Search users..."
      >
        <template #leading="{ modelValue }">
          <UAvatar v-if="modelValue?.avatar" size="2xs" v-bind="modelValue.avatar" />
        </template>
      </UInputMenu>
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
    <div class="flex items-center gap-4">
      <UInputMenu
        v-for="size in sizes"
        :key="size"
        :items="items"
        :model-value="[fruits[0]]"
        multiple
        icon="i-heroicons-magnifying-glass"
        placeholder="Search..."
        :size="(size as any)"
        class="w-60"
      />
    </div>
  </div>
</template>
