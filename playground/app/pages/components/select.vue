<script setup lang="ts">
import { upperFirst } from 'scule'
import theme from '#build/ui/select'
import type { User } from '~/types'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
const variants = Object.keys(theme.variants.variant) as Array<keyof typeof theme.variants.variant>

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

const { data: users, status } = await useFetch('https://jsonplaceholder.typicode.com/users', {
  transform: (data: User[]) => {
    return data?.map(user => ({ label: user.name, value: String(user.id), avatar: { src: `https://i.pravatar.cc/120?img=${user.id}` } })) || []
  },
  lazy: true
})

function getStatusIcon(value: string): string {
  return statuses.find(status => status.value === value)?.icon || 'i-heroicons-user'
}

function getUserAvatar(value: string) {
  return users.value?.find(user => user.value === value)?.avatar || {}
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex flex-col gap-4 w-48">
      <USelect :items="items" placeholder="Search..." />
    </div>
    <div class="flex items-center gap-2">
      <USelect
        v-for="variant in variants"
        :key="variant"
        :items="items"
        :placeholder="upperFirst(variant)"
        :variant="variant"
        class="w-48"
      />
    </div>
    <div class="flex items-center gap-2">
      <USelect
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
      <USelect
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
      <USelect :items="items" placeholder="Disabled" disabled />
      <USelect :items="items" placeholder="Required" required />
      <USelect :items="items" loading placeholder="Search..." />
    </div>
    <div class="flex items-center gap-4">
      <USelect
        v-for="size in sizes"
        :key="size"
        :items="items"
        placeholder="Search..."
        :size="size"
        class="w-48"
      />
    </div>
    <div class="flex items-center gap-4">
      <USelect
        v-for="size in sizes"
        :key="size"
        :items="statuses"
        placeholder="Search status..."
        icon="i-heroicons-magnifying-glass"
        trailing-icon="i-heroicons-chevron-up-down-20-solid"
        :size="size"
        class="w-48"
      >
        <template #leading="{ modelValue, ui }">
          <UIcon v-if="modelValue" :name="getStatusIcon(modelValue)" :class="ui.leadingIcon()" />
        </template>
      </USelect>
    </div>
    <div class="flex items-center gap-4">
      <USelect
        v-for="size in sizes"
        :key="size"
        :items="users || []"
        :loading="status === 'pending'"
        icon="i-heroicons-user"
        placeholder="Search users..."
        :size="size"
        class="w-48"
      >
        <template #leading="{ modelValue, ui }">
          <UAvatar v-if="modelValue" :size="ui.itemLeadingAvatarSize()" v-bind="getUserAvatar(modelValue)" />
        </template>
      </USelect>
    </div>
  </div>
</template>
