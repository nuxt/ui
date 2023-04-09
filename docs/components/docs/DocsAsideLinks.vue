<template>
  <div class="space-y-8">
    <div v-for="(group, index) in navigation" :key="index" class="space-y-3">
      <div class="text-sm font-semibold text-gray-900 dark:text-gray-200">
        <span class="truncate">{{ group.title }}</span>
      </div>

      <UVerticalNavigation :links="mapContentLinks(group.children)" class="mt-1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

const { navigation } = useContent()

function mapContentLinks (links: NavItem[]) {
  return links?.map(link => ({ label: link.title, icon: link.icon, to: link._path })) || []
}
</script>
