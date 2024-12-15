<script setup lang="ts">
import { upperFirst } from 'scule'
import { refDebounced } from '@vueuse/core'
import theme from '#build/ui/select-menu'
import type { User } from '~/types'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
const variants = Object.keys(theme.variants.variant) as Array<keyof typeof theme.variants.variant>

const fruits = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']
const vegetables = ['Aubergine', 'Broccoli', 'Carrot', 'Courgette', 'Leek']

const items = [[{ label: 'Fruits', type: 'label' }, ...fruits], [{ label: 'Vegetables', type: 'label' }, ...vegetables]]
const selectedItems = ref([fruits[0]!, vegetables[0]!])

const statuses = [{
  label: 'Backlog',
  value: 'backlog',
  icon: 'i-lucide-circle-help'
}, {
  label: 'Todo',
  value: 'todo',
  icon: 'i-lucide-circle-plus'
}, {
  label: 'In Progress',
  value: 'in_progress',
  icon: 'i-lucide-circle-arrow-up'
}, {
  label: 'Done',
  value: 'done',
  icon: 'i-lucide-circle-check'
}, {
  label: 'Canceled',
  value: 'canceled',
  icon: 'i-lucide-circle-x'
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
    <div class="flex flex-col gap-4 w-48">
      <USelectMenu :items="items" placeholder="Search..." />
    </div>
    <div class="flex items-center gap-2">
      <USelectMenu
        v-for="variant in variants"
        :key="variant"
        :items="items"
        :placeholder="upperFirst(variant)"
        :variant="variant"
        class="w-48"
      />
    </div>
    <div class="flex items-center gap-2">
      <USelectMenu
        v-for="variant in variants"
        :key="variant"
        :items="items"
        :placeholder="upperFirst(variant)"
        :variant="variant"
        color="neutral"
        class="w-48"
      />
    </div>
    <div class="flex items-center gap-2">
      <USelectMenu
        v-for="variant in variants"
        :key="variant"
        :items="items"
        :placeholder="upperFirst(variant)"
        :variant="variant"
        color="error"
        highlight
        class="w-48"
      />
    </div>
    <div class="flex flex-col gap-4 w-48">
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
        class="w-48"
      />
    </div>
    <div class="flex items-center gap-4">
      <USelectMenu
        v-for="size in sizes"
        :key="size"
        :items="statuses"
        placeholder="Search status..."
        icon="i-lucide-search"
        trailing-icon="i-lucide-chevrons-up-down"
        :size="size"
        class="w-48"
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
        ignore-filter
        icon="i-lucide-user"
        placeholder="Search users..."
        :size="size"
        class="w-48"
        @update:open="searchTerm = ''"
      >
        <template #leading="{ modelValue, ui }">
          <UAvatar v-if="modelValue?.avatar" :size="ui.itemLeadingAvatarSize()" v-bind="modelValue.avatar" />
        </template>
      </USelectMenu>
    </div>
  </div>
</template>
