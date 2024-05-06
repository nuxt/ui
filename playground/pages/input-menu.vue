<script setup lang="ts">
import { refDebounced } from '@vueuse/core'

import type { User } from '~/types'

const fruits = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']
const vegetables = ['Aubergine', 'Broccoli', 'Carrot', 'Courgette', 'Leek']

const { data: users2 } = await useFetch('https://jsonplaceholder.typicode.com/users', {
  transform: (data: User[]) => {
    return data?.map(user => ({ id: user.id, label: user.name, avatar: { src: `https://i.pravatar.cc/120?img=${user.id}` } })) || []
  }
})

const searchTerm = ref('')
const searchTermDebounced = refDebounced(searchTerm, 200)

const { data: users3, pending } = await useFetch('https://jsonplaceholder.typicode.com/users', {
  params: { q: searchTermDebounced },
  transform: (data: User[]) => {
    return data?.map(user => ({ id: user.id, label: user.name, avatar: { src: `https://i.pravatar.cc/120?img=${user.id}` } })) || []
  }
})

const statuses = [{
  label: 'Backlog',
  icon: 'i-heroicons-question-mark-circle'
}, {
  label: 'To Do',
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
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-4">
      <UInputMenu :items="[[{ label: 'Fruits', type: 'label' }, ...fruits], [{ label: 'Vegetables', type: 'label' }, ...vegetables]]" placeholder="Search..." />

      <UInputMenu :items="statuses" placeholder="Search status..." icon="i-heroicons-magnifying-glass" trailing-icon="i-heroicons-chevron-up-down-20-solid" />

      <UInputMenu :items="users2 || []" icon="i-heroicons-user" placeholder="Search users..." />

      <UInputMenu
        v-model:search-term="searchTerm"
        :items="users3 || []"
        :loading="pending"
        :filter="false"
        icon="i-heroicons-user"
        placeholder="Search users async..."
        @update:open="searchTerm = ''"
      />
    </div>
  </div>
</template>
