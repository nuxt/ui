<template>
  <UContainer class="min-h-screen flex items-center">
        <UButtonGroup size="lg" orientation="horizontal">
          <UButton label="Action" color="white" />
          <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
            <UButton class="w-full" color="white" label="Options" trailing-icon="i-heroicons-chevron-down-20-solid" />
          </UDropdown>
          <UInput placeholder="Search" />
          <UBadge label="New" color="blue" />
          <USelect :options="['All', 'Active', 'Completed']" placeholder="Select" />
          <USelectMenu :options="['All', 'Active', 'Completed']" placeholder="Select Menu" />
        </UButtonGroup>
        <!-- <div class="flex gap-2">
          <UButton label="Action" color="white" />
          <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
            <UButton color="white" label="Options" trailing-icon="i-heroicons-chevron-down-20-solid" />
          </UDropdown>
          <UBadge label="New" color="blue" />
          <UInput placeholder="Search" />
          <USelect :options="['All', 'Active', 'Completed']" placeholder="Select" />
          <USelectMenu :options="['All', 'Active', 'Completed']" placeholder="Select Menu" />
        </div> -->
  </UContainer>
</template>

<script setup>
const items = [
  [{
    label: 'Profile',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4'
    }
  }], [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    shortcuts: ['E'],
    click: () => {
      console.log('Edit')
    }
  }, {
    label: 'Duplicate',
    icon: 'i-heroicons-document-duplicate-20-solid',
    shortcuts: ['D'],
    disabled: true
  }], [{
    label: 'Archive',
    icon: 'i-heroicons-archive-box-20-solid'
  }, {
    label: 'Move',
    icon: 'i-heroicons-arrow-right-circle-20-solid'
  }], [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    shortcuts: ['⌘', 'D']
  }]
]
</script>

<style>
body {
  @apply antialiased font-sans text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900;
}
</style>
