<template>
  <nav v-if="hasPro" class="w-full grid grid-cols-2 gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-800/50">
    <NuxtLink
      v-for="tab in tabs"
      :key="tab.to"
      :to="tab.to"
      class="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors"
      :class="tab.active ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-700' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
    >
      <UIcon :name="tab.icon" class="w-4 h-4 flex-shrink-0" />
      {{ tab.label }}
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

const route = useRoute()

const nav = inject<Ref<NavItem[]>>('navigation', ref([]))

const hasPro = computed(() => nav.value.some(item => item._path === '/pro'))

const tabs = computed(() => [{
  label: 'UI',
  icon: 'i-heroicons-cube',
  to: '/getting-started',
  active: !route.path.startsWith('/pro')
}, {
  label: 'UI Pro',
  icon: 'i-heroicons-square-3-stack-3d',
  to: '/pro/getting-started',
  active: route.path.startsWith('/pro')
}])
</script>
