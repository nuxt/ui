<script setup lang="ts">
const ui = {
  button: {
    slots: {
      base: 'rounded-full'
    }
  },
  badge: {
    slots: {
      base: 'rounded-full'
    }
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
