<script setup lang="ts">
const types = {
  bug: {
    icon: 'i-heroicons-bug-ant-20-solid',
    color: 'text-red-500'
  },
  docs: {
    icon: 'i-heroicons-document-text-20-solid',
    color: 'text-blue-500'
  },
  lock: {
    icon: 'i-heroicons-lock-closed-20-solid',
    color: 'text-gray dark:text-white'
  },
  default: {
    icon: 'i-heroicons-question-mark-circle-20-solid',
    color: 'text-green-500'
  }
}
const links = [{
  label: 'UDropdown and UPopover dropdown menu, dropdown will be obscured',
  type: 'bug'
}, {
  label: 'Uncaught (in promise) ReferenceError: ref is not defined',
  type: 'lock'
}, {
  label: 'Fully styled and customizable components for Nuxt.',
  type: 'docs'
}, {
  label: 'Can I pass a tailwind color to UNotifications with `toast.add()` ?'
}]
</script>

<template>
  <UVerticalNavigation
    :links="links"
    :ui="{ wrapper: 'truncate' }"
  >
    <template #icon="{ link }">
      <UIcon v-if="link.type" :name="types[link.type].icon" :class="types[link.type].color" class="text-base" />
      <UIcon v-else :name="types.default.icon" :class="types.default.color" class="text-base" />
    </template>
  </UVerticalNavigation>
</template>
