<template>
  <component
    :is="to ? NuxtLink : 'div'"
    :to="to"
    class="block pl-4 pr-6 py-3 rounded-md !border !border-gray-200 dark:!border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 text-sm leading-6 my-5 last:mb-0 font-normal group relative"
    :class="[to ? 'hover:!border-primary-500 dark:hover:!border-primary-400 hover:text-primary-500 dark:hover:text-primary-400 border-dashed' : '']"
  >
    <UIcon v-if="!!to" name="i-heroicons-link-20-solid" class="w-3 h-3 absolute right-2 top-2 text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400" />

    <UIcon v-if="icon" :name="icon" class="w-4 h-4 mr-2 inline-flex items-center align-text-top" :class="color" />

    <ContentSlot :use="$slots.default" unwrap="p" />
  </component>
</template>

<script setup lang="ts">
const NuxtLink = resolveComponent('NuxtLink')

defineProps({
  icon: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: 'text-primary-500 dark:text-primary-400'
  },
  to: {
    type: String,
    default: null
  }
})
</script>
