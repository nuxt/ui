<script setup lang="ts">
const outerUi = {
  button: {
    base: 'rounded-full'
  }
}

const innerUi = {
  button: {
    base: 'font-bold'
  }
}
</script>

<template>
  <UTheme :ui="outerUi">
    <div class="flex flex-col items-start gap-4">
      <UButton label="Outer theme" />

      <UTheme :ui="innerUi">
        <UButton label="Inner theme" />
      </UTheme>
    </div>
  </UTheme>
</template>
