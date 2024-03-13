<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'antialiased font-sans text-gray-900 dark:text-white bg-white dark:bg-gray-900'
  }
})

const components = ['avatar', 'badge', 'button', 'chip', 'collapsible', 'kbd', 'popover', 'skeleton', 'tooltip']
</script>

<template>
  <UProvider>
    <UContainer class="min-h-screen flex flex-col gap-4 items-center justify-center overflow-y-auto">
      <div class="flex gap-1.5 py-4">
        <ULink v-for="component in components" :key="component" :to="`/${component}`" active-class="text-primary-500 dark:text-primary-400 font-medium" class="capitalize text-sm">
          {{ component }}
        </ULink>
      </div>

      <div class="flex-1 flex flex-col justify-center">
        <NuxtPage />
      </div>
    </UContainer>
  </UProvider>
</template>