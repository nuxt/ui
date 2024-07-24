<script setup lang="ts">
const items = [
  {
    label: 'Colors',
    icon: 'i-heroicons-swatch',
    content: 'Choose a primary and a gray color from your Tailwind CSS theme.'
  },
  {
    label: 'Icons',
    icon: 'i-heroicons-face-smile',
    content: 'You have nothing to do, @nuxt/icon will handle it automatically.'
  },
  {
    label: 'Components',
    icon: 'i-heroicons-cube-transparent',
    content: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
  }
]

const active = ref('0')

// Note: This is for demonstration purposes only.
onMounted(() => {
  setInterval(() => {
    active.value = String((Number(active.value) + 1) % items.length)
  }, 2000)
})
</script>

<template>
  <UAccordion v-model="active" :items="items" />
</template>
