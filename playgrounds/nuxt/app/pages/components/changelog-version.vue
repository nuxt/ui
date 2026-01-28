<template>
  <Navbar />

  <UChangelogVersion
    title="v4.0.0"
    description="We are excited to announce Nuxt UI v4, a major milestone that unifies Nuxt UI and Nuxt UI Pro into a single, fully open-source library. Following NuxtLabs joining Vercel in July, we're now able to offer 125+ production-ready components and a complete Figma Kit available for free to everyone."
    date="2025-09-23"
    image="https://nuxt.com/assets/blog/nuxt-ui-v4.png"
    to="https://nuxt.com/blog/nuxt-ui-v4"
    target="_blank"
    badge="Release"
    :authors="[
      { name: 'Benjamin Canac', description: 'benjamincanac', avatar: { src: 'https://github.com/benjamincanac.png' }, to: 'https://github.com/benjamincanac', target: '_blank' },
      { name: 'Sebastien Chopin', description: 'atinux', avatar: { src: 'https://github.com/atinux.png' }, to: 'https://github.com/atinux', target: '_blank' },
      { name: 'Hugo Richard', description: 'hugorcd__', avatar: { src: 'https://github.com/hugorcd.png' }, to: 'https://github.com/hugorcd', target: '_blank' }
    ]"
    class="w-4xl"
    :ui="{
      container: 'max-w-lg'
    }"
  />
</template>
