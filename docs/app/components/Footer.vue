<script setup lang="ts">
const route = useRoute()

// const items = [{
//   label: 'Figma Kit',
//   to: 'https://www.figma.com/community/file/1288455405058138934',
//   target: '_blank'
// }, {
//   label: 'Playground',
//   to: 'https://stackblitz.com/edit/nuxt-ui',
//   target: '_blank'
// }, {
//   label: 'Roadmap',
//   to: '/roadmap'
// }, {
//   label: 'Releases',
//   to: '/releases'
// }]
</script>

<template>
  <USeparator icon="i-simple-icons-nuxtdotjs" class="h-px" />

  <UFooter>
    <template #left>
      <NuxtLink v-if="route.path.startsWith('/pro')" to="https://ui.nuxt.com/pro/purchase" target="_blank" class="text-sm text-[var(--ui-text-muted)]">
        Purchase <span class="text-[var(--ui-text-highlighted)]">Nuxt UI Pro</span>
      </NuxtLink>
      <NuxtLink v-else to="https://github.com/nuxt/ui" target="_blank" class="text-sm text-[var(--ui-text-muted)]">
        Published under <span class="text-[var(--ui-text-highlighted)]">MIT License</span>
      </NuxtLink>
    </template>

    <!-- <UNavigationMenu :items="items" variant="link" color="neutral" /> -->

    <template #right>
      <UButton
        aria-label="Nuxt Website"
        icon="i-simple-icons-nuxtdotjs"
        to="https://nuxt.com"
        target="_blank"
        color="neutral"
        variant="ghost"
      />
      <UButton
        aria-label="Nuxt UI on Discord"
        icon="i-simple-icons-discord"
        to="https://chat.nuxt.dev"
        target="_blank"
        color="neutral"
        variant="ghost"
      />
      <UButton
        aria-label="Nuxt on X"
        icon="i-simple-icons-x"
        to="https://x.com/nuxt_js"
        target="_blank"
        color="neutral"
        variant="ghost"
      />
      <UButton
        aria-label="Nuxt UI on GitHub"
        icon="i-simple-icons-github"
        to="https://github.com/nuxt/ui"
        target="_blank"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
