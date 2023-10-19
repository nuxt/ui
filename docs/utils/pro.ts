export const pro = {
  code: `
\`\`\`vue [app.vue]
<script setup lang="ts">
const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' }
]
</script>

<template>
  <UHeader :links="links" />

  <UMain>
    <ULandingHero title="Hello World" />

    <ULandingSection title="Features">
      <UPageGrid>
        <ULandingCard title="First Card" />
        <ULandingCard title="Second Card" />
        <ULandingCard title="Third Card" />
      </UPageGrid>
    </ULandingSection>
  </UMain>

  <UFooter />
</template>
\`\`\`
  `
}
