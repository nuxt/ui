<script setup lang="ts">
const ui = {
  button: {
    base: 'rounded-full'
  },
  badge: {
    base: 'rounded-full'
  }
}
</script>

<template>
  <UTheme :ui="ui">
    <div class="flex items-center gap-2">
      <UButton label="Button" />
      <UBadge label="Badge" />
    </div>
  </UTheme>
</template>
