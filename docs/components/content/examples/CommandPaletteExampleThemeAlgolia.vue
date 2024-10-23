<script setup lang="ts">
import type { NavItem, ParsedContent } from '@nuxt/content'
import type { Button } from '#ui/types'

const commandPaletteRef = ref()

const navigation = inject<Ref<NavItem[]>>('navigation')
const files = inject<Ref<ParsedContent[]>>('files')

const groups = computed(() => navigation.value.map(item => ({
  key: item._path,
  label: item.label,
  commands: files.value.filter(file => file._path.startsWith(item._path)).map(file => ({
    id: file._id,
    icon: 'i-heroicons-document',
    title: file.navigation?.title || file.title,
    category: item.title,
    to: file._path
  }))
})))

const closeButton = computed(() => commandPaletteRef.value?.query ? ({ icon: 'i-heroicons-x-mark', color: 'black', variant: 'ghost', size: 'lg', padded: false }) : null)
const emptyState = computed(() => commandPaletteRef.value?.query ? ({ icon: 'i-heroicons-magnifying-glass', queryLabel: 'No results' }) : ({ icon: '', label: 'No recent searches' }))

const ui = {
  wrapper: 'flex flex-col flex-1 min-h-0 bg-gray-50 dark:bg-gray-800',
  input: {
    wrapper: 'relative flex items-center mx-3 py-3',
    base: 'w-full rounded border-2 border-primary-500 placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-0 bg-white dark:bg-gray-900',
    padding: 'px-4',
    height: 'h-14',
    size: 'text-lg',
    icon: {
      base: 'pointer-events-none absolute left-3 text-primary-500 dark:text-primary-400',
      size: 'h-6 w-6'
    }
  },
  group: {
    wrapper: 'p-3 relative',
    label: '-mx-3 px-3 -mt-4 mb-2 py-1 text-sm font-semibold text-primary-500 dark:text-primary-400 font-semibold sticky top-0 bg-gray-50 dark:bg-gray-800 z-10',
    container: 'space-y-1',
    command: {
      base: 'flex justify-between select-none items-center rounded px-2 py-4 gap-2 relative font-medium text-sm group shadow',
      active: 'bg-primary-500 dark:bg-primary-400 text-white',
      inactive: 'bg-white dark:bg-gray-900',
      label: 'flex flex-col min-w-0',
      suffix: 'text-xs',
      icon: {
        base: 'flex-shrink-0 w-6 h-6',
        active: 'text-white',
        inactive: 'text-gray-400 dark:text-gray-500'
      }
    }
  },
  emptyState: {
    wrapper: 'flex flex-col items-center justify-center flex-1 py-9',
    label: 'text-sm text-center text-gray-500 dark:text-gray-400',
    queryLabel: 'text-lg text-center text-gray-900 dark:text-white',
    icon: 'w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4'
  }
}
</script>

<template>
  <UCommandPalette
    ref="commandPaletteRef"
    :groups="groups"
    :ui="ui"
    :close-button="(closeButton as Button)"
    :empty-state="(emptyState as any)"
    :autoselect="false"
    command-attribute="title"
    :fuse="{
      fuseOptions: { keys: ['title', 'category'] }
    }"
    placeholder="Search docs"
  />
</template>
