<script setup lang="ts">
const config = useRuntimeConfig().public
</script>

<template>
  <UBanner icon="i-heroicons-light-bulb" :actions="[{ label: 'Go to Nuxt UI v2', to: 'https://ui.nuxt.com', trailingIcon: 'i-heroicons-arrow-right-20-solid', class: 'rounded-full' }]" :close="false">
    <template #title>
      You're looking at the documentation for <span class="font-semibold">Nuxt UI v{{ config.version }}</span>!
    </template>
  </UBanner>
</template>
