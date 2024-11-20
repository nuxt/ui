<script setup lang="ts">
const commandPaletteRef = ref()

const suggestions = [
  { id: 'linear', label: 'Linear', icon: 'i-simple-icons-linear' },
  { id: 'figma', label: 'Figma', icon: 'i-simple-icons-figma' },
  { id: 'slack', label: 'Slack', icon: 'i-simple-icons-slack' },
  { id: 'youtube', label: 'YouTube', icon: 'i-simple-icons-youtube' },
  { id: 'github', label: 'GitHub', icon: 'i-simple-icons-github' }
]

const commands = [
  { id: 'clipboard-history', label: 'Clipboard History', icon: 'i-heroicons-clipboard', click: () => alert('New file') },
  { id: 'import-extension', label: 'Import Extension', icon: 'i-heroicons-wrench-screwdriver', click: () => alert('New folder') },
  { id: 'manage-extensions', label: 'Manage Extensions', icon: 'i-heroicons-wrench-screwdriver', click: () => alert('Add hashtag') }
]

const groups = [{
  key: 'suggestions',
  label: 'Suggestions',
  inactive: 'Application',
  commands: suggestions
}, {
  key: 'commands',
  label: 'Commands',
  inactive: 'Command',
  commands
}]

const ui = {
  wrapper: 'flex flex-col flex-1 min-h-0 divide-y divide-gray-200 dark:divide-gray-700 bg-gray-50 dark:bg-gray-800',
  container: 'relative flex-1 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700 scroll-py-2',
  input: {
    base: 'w-full h-14 px-4 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 text-gray-900 dark:text-white focus:ring-0 focus:outline-none'
  },
  group: {
    label: 'px-2 my-2 text-xs font-semibold text-gray-500 dark:text-gray-400',
    command: {
      base: 'flex justify-between select-none cursor-default items-center rounded-md px-2 py-2 gap-2 relative',
      active: 'bg-gray-200 dark:bg-gray-700/50 text-gray-900 dark:text-white',
      container: 'flex items-center gap-3 min-w-0',
      icon: {
        base: 'flex-shrink-0 w-5 h-5',
        active: 'text-gray-900 dark:text-white',
        inactive: 'text-gray-400 dark:text-gray-500'
      },
      avatar: {
        size: '2xs'
      }
    }
  }
}
</script>

<template>
  <UCommandPalette
    ref="commandPaletteRef"
    :groups="groups"
    icon=""
    :ui="ui"
    :autoselect="false"
    placeholder="Search for apps and commands"
  />
</template>
