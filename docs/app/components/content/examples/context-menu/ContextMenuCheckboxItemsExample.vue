<script setup lang="ts">
const showSidebar = ref(true)
const showToolbar = ref(false)

const items = computed(() => [{
  label: 'View',
  type: 'label' as const
}, {
  type: 'separator' as const
}, {
  label: 'Show Sidebar',
  type: 'checkbox' as const,
  checked: showSidebar.value,
  onUpdateChecked(checked: boolean) {
    showSidebar.value = checked
  },
  onSelect(e: Event) {
    e.preventDefault()
  }
}, {
  label: 'Show Toolbar',
  type: 'checkbox' as const,
  checked: showToolbar.value,
  onUpdateChecked(checked: boolean) {
    showToolbar.value = checked
  }
}, {
  label: 'Collapse Pinned Tabs',
  type: 'checkbox' as const,
  disabled: true
}])
</script>

<template>
  <UContextMenu :items="items" :ui="{ content: 'w-48' }">
    <div class="flex items-center justify-center rounded-md border border-dashed border-[var(--ui-border-accented)] text-sm aspect-video w-72">
      Right click here
    </div>
  </UContextMenu>
</template>
