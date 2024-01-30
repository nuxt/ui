<script setup lang="ts">
const people = ['Wade Cooper', 'Arlene Mccoy', 'Devon Webb', 'Tom Cook', 'Tanya Fox', 'Hellen Schmidt', 'Caroline Schultz', 'Mason Heaney', 'Claudie Smitham', 'Emil Schaefer']

const selected = ref(people[3])
</script>

<template>
  <USelectMenu v-slot="{ open }" v-model="selected" :options="people">
    <UButton color="gray" class="flex-1 justify-between">
      {{ selected }}

      <UIcon name="i-heroicons-chevron-right-20-solid" class="w-5 h-5 transition-transform text-gray-400 dark:text-gray-500" :class="[open && 'transform rotate-90']" />
    </UButton>
  </USelectMenu>
</template>
