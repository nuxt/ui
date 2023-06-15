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
          base: 'group block border-l -ml-px lg:leading-6 flex items-center gap-2',
          padding: 'pl-4',
          rounded: '',
          font: '',
          ring: '',
          active: 'text-primary-500 dark:text-primary-400 border-current',
          inactive: 'border-transparent hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
        }"
      >
        <template #badge="{ link }">
          <UBadge v-if="link.badge" size="xs" :ui="{ rounded: 'rounded-full' }">
            {{ link.badge }}
          </UBadge>
        </template>
      </UVerticalNavigation>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

const navigation: Ref<NavItem[]> = inject('navigation')

function mapContentLinks (links: NavItem[]) {
  return links?.map(link => ({ label: link.title, icon: link.icon, to: link._path, badge: link.badge })) || []
}
</script>
