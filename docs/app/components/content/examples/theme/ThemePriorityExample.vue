<script setup lang="ts">
const ui = {
  button: {
    base: 'rounded-full'
  }
}
</script>

<template>
  <UTheme :ui="ui">
    <div class="flex items-center gap-2">
      <UButton label="Themed" />
      <UButton label="Override" :ui="{ base: 'rounded-none' }" />
    </div>
  </UTheme>
</template>
