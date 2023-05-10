<template>
  <div class="space-y-8">
    <div v-for="(group, index) in navigation" :key="index" class="space-y-3">
      <div class="text-sm font-semibold text-gray-900 dark:text-gray-200">
        <span class="truncate">{{ group.title }}</span>
      </div>

      <UVerticalNavigation
        :links="mapContentLinks(group.children)"
        class="mt-1"
        :ui="{
          wrapper: 'border-l border-gray-200 dark:border-gray-800 space-y-2',
          padding: 'pl-4',
          base: 'group text-sm block border-l -ml-px lg:leading-6',
          active: 'text-primary-500 dark:text-primary-400 border-current font-semibold',
          inactive: 'border-transparent hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

const { navigation } = useContent() as { navigation: NavItem[] }

function mapContentLinks (links: NavItem[]) {
  return links?.map(link => ({ label: link.title, icon: link.icon, to: link._path })) || []
}
</script>
