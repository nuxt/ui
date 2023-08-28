<template>
  <UList :items="items" class="w-56" orientation="horizontal" :separator="false" :wrap="true">
    <div v-for="item in items" :key="item" class="grow rounded-full ring-1 ring-gray-300 dark:ring-gray-700 py-0.5 px-2 m-2 text-sm">
      {{ item }}
    </div>
  </UList>
</template>

<script setup>
const items = ['First', 'Second', 'Third', 'Password Reset']
</script>
