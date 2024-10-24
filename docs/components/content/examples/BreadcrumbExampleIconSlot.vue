<script setup lang="ts">
const links = [{
  label: 'Home',
  to: '/'
}, {
  label: 'Navigation'
}, {
  label: 'Breadcrumb'
}]
</script>

<template>
  <UBreadcrumb :links="links" :divider="null" :ui="{ ol: 'gap-x-3' }">
    <template #icon="{ link, index, isActive }">
      <UAvatar
        :alt="(index + 1).toString()"
        :ui="{
          background: isActive ? 'bg-primary-500 dark:bg-primary-400' : undefined,
          placeholder: isActive ? 'text-white dark:text-gray-900' : !!link.to ? 'group-hover:text-gray-700 dark:group-hover:text-gray-200' : ''
        }"
        size="xs"
      />
    </template>
  </UBreadcrumb>
</template>
