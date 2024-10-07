<script setup lang="ts">
const items = [
  {
    label: 'Icons',
    icon: 'i-heroicons-face-smile',
    content: 'You have nothing to do, @nuxt/icon will handle it automatically.'
  },
  {
    label: 'Colors',
    icon: 'i-heroicons-swatch',
    content: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
  },
  {
    label: 'Components',
    icon: 'i-heroicons-cube-transparent',
    content: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
  }
]

const active = ref('0')

// Note: This is for demonstration purposes only. Don't do this at home.
onMounted(() => {
  setInterval(() => {
    active.value = String((Number(active.value) + 1) % items.length)
  }, 2000)
})
</script>

<template>
  <UAccordion v-model="active" :items="items" />
</template>
