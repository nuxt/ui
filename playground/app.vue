<script setup lang="ts">
</script>

<template>
  <UContainer class="min-h-screen flex flex-col gap-4 items-center justify-center">
    <div class="flex gap-1">
      <UButton icon="i-heroicons-rocket-launch" to="/" label="/" />

      <UButton color="green" trailing-icon="i-heroicons-light-bulb" to="/about" label="/about" />

      <UButton color="red" label="Button" class="font-bold" />
    </div>

    <NuxtPage />
  </UContainer>
</template>