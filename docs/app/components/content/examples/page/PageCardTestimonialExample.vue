<script setup lang="ts">
const testimonial = ref({
  user: {
    name: 'Evan You',
    description: 'Author of Vue.js and Vite',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/499550?v=4',
      alt: 'Evan You'
    }
  },
  quote: '“Nuxt on Cloudflare infra with minimal effort - this is huge!”'
})
</script>

<template>
  <UPageCard :description="testimonial.quote" class="w-60">
    <template #footer>
      <UUser v-bind="testimonial.user" />
    </template>
  </UPageCard>
</template>
