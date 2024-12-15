<script setup lang="ts">
const showBookmarks = ref(true)
const showHistory = ref(false)
const showDownloads = ref(false)

const items = computed(() => [{
  label: 'Interface',
  icon: 'i-lucide-app-window',
  type: 'label' as const
}, {
  type: 'separator' as const
}, {
  label: 'Show Bookmarks',
  icon: 'i-lucide-bookmark',
  type: 'checkbox' as const,
  checked: showBookmarks.value,
  onUpdateChecked(checked: boolean) {
    showBookmarks.value = checked
  },
  onSelect(e: Event) {
    e.preventDefault()
  }
}, {
  label: 'Show History',
  icon: 'i-lucide-clock',
  type: 'checkbox' as const,
  checked: showHistory.value,
  onUpdateChecked(checked: boolean) {
    showHistory.value = checked
  }
}, {
  label: 'Show Downloads',
  icon: 'i-lucide-download',
  type: 'checkbox' as const,
  checked: showDownloads.value,
  onUpdateChecked(checked: boolean) {
    showDownloads.value = checked
  }
}])
</script>

<template>
  <UDropdownMenu :items="items" :content="{ align: 'start' }" :ui="{ content: 'w-48' }">
    <UButton label="Open" color="neutral" variant="outline" icon="i-lucide-menu" />
  </UDropdownMenu>
</template>
