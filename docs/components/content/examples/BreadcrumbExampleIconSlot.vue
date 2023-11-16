<script setup>
const links = [{
  label: 'Documentation',
  to: '/'
}, {
  label: 'Navigation',
  to: '/navigation'
}, {
  label: 'Breadcrumb',
  to: '/navigation/breadcrumb'
}]
</script>

<template>
  <UBreadcrumb :links="links" :divider="null" :ui="{ container: 'gap-x-3' }">
    <template #icon="{ index, isActive }">
      <UAvatar
        :alt="(index + 1 ).toString()"
        :ui="{
          background: isActive ? 'bg-primary-500 dark:bg-primary-400' : undefined,
          placeholder: isActive ? 'text-white dark:text-gray-900' : 'group-hover:text-gray-700 dark:group-hover:text-gray-200'
        }"
        size="xs"
      />
    </template>
  </UBreadcrumb>
</template>
