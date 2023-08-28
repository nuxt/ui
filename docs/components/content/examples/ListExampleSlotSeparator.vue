<template>
  <UList :items="items" orientation="horizontal">
    <template #separator="{ isLast }">
      <UIcon v-if="isLast" name="i-heroicons-arrow-right-circle" class="mx-2 h-6 w-6 text-primary-500" />
      <UIcon v-else name="i-heroicons-arrow-small-right" class="mx-2 text-gray-500"/>
    </template>
  </Ulist>
</template>

<script setup>
const items = ['Home', 'Account', 'Security', 'Password Reset']
</script>
