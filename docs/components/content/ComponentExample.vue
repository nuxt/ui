<template>
  <div class="[&>div>pre]:!rounded-t-none [&>div>pre]:!mt-0">
    <div class="flex border border-gray-200 dark:border-gray-700 relative not-prose rounded-t-md" :class="[{ 'p-4': padding, 'rounded-b-md': !$slots.code, 'border-b-0': !!$slots.code }, backgroundClass, overflowClass]">
      <ContentSlot v-if="$slots.default" :use="$slots.default" />
    </div>

    <ContentSlot v-if="$slots.code" :use="$slots.code" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  padding: {
    type: Boolean,
    default: true
  },
  backgroundClass: {
    type: String,
    default: 'bg-white dark:bg-gray-900'
  },
  overflowClass: {
    type: String,
    default: ''
  }
})
</script>
