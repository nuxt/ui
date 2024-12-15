<script setup lang="ts">
import { upperFirst } from 'scule'
import theme from '#build/ui/select'
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

const { data: users, status } = await useFetch('https://jsonplaceholder.typicode.com/users', {
  transform: (data: User[]) => {
    return data?.map(user => ({ label: user.name, value: String(user.id), avatar: { src: `https://i.pravatar.cc/120?img=${user.id}` } })) || []
  },
  lazy: true
})

function getStatusIcon(value: string) {
  return statuses.find(status => status.value === value)?.icon || 'i-lucide-user'
}

function getUserAvatar(value: string) {
  return users.value?.find(user => user.value === value)?.avatar || {}
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex flex-col gap-4 w-48">
      <USelect :items="items" placeholder="Search..." default-value="Apple" />
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
      <USelect v-model="selectedItems" :items="items" placeholder="Multiple" multiple />
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
        icon="i-lucide-search"
        trailing-icon="i-lucide-chevrons-up-down"
        :size="size"
        class="w-48"
      >
        <template #leading="{ modelValue, ui }">
          <UIcon v-if="modelValue" :name="getStatusIcon(modelValue as string)" :class="ui.leadingIcon()" />
        </template>
      </USelect>
    </div>
    <div class="flex items-center gap-4">
      <USelect
        v-for="size in sizes"
        :key="size"
        :items="users || []"
        :loading="status === 'pending'"
        icon="i-lucide-user"
        placeholder="Search users..."
        :size="size"
        class="w-48"
      >
        <template #leading="{ modelValue, ui }">
          <UAvatar v-if="modelValue" :size="ui.itemLeadingAvatarSize()" v-bind="getUserAvatar(modelValue as string)" />
        </template>
      </USelect>
    </div>
  </div>
</template>
