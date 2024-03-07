<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'antialiased font-sans text-gray-900 dark:text-white bg-white dark:bg-gray-900'
  }
})

const components = ['button', 'tooltip']
</script>

<template>
  <UProvider>
    <UContainer class="min-h-screen flex flex-col gap-4 items-center justify-center">
      <div class="flex gap-1.5">
        <ULink v-for="component in components" :key="component" :to="`/${component}`" active-class="text-primary capitalize text-sm">
          {{ component }}
        </ULink>
      </div>

      <NuxtPage />
    </UContainer>
  </UProvider>
</template>