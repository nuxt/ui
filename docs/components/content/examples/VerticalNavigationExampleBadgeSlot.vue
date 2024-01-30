<script setup lang="ts">
const links = [{
  label: '.github',
  icon: 'i-heroicons-folder-20-solid',
  badge: 'chore(github): use pnpm 8',
  time: 'last month'
}, {
  label: '.editorconfig',
  icon: 'i-heroicons-document-solid',
  badge: 'Initial commit',
  time: '2 years ago'
}, {
  label: '.package.json',
  icon: 'i-heroicons-document-solid',
  badge: 'chore(deps): bump',
  time: '16 hours ago'
}]
</script>

<template>
  <UVerticalNavigation
    :links="links"
    class="w-full"
    :ui="{
      label: 'truncate relative text-gray-900 dark:text-white flex-initial w-32 text-left'
    }"
  >
    <template #badge="{ link }">
      <div class="flex-1 flex justify-between relative truncate">
        <div>{{ link.badge }}</div>
        <div>{{ link.time }}</div>
      </div>
    </template>
  </UVerticalNavigation>
</template>
