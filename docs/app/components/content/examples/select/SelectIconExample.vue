<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
</script>

<template>
  <USelect
    default-value="Backlog"
    :items="items"
    :ui="{
      trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
    }"
  />
</template>
