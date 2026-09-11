<script setup lang="ts">
const pg = usePg()

const items = [{
  label: 'Docs',
  icon: 'i-lucide-book-open'
}, {
  label: 'Components',
  icon: 'i-lucide-box',
  active: true
}, {
  label: 'Figma',
  icon: 'i-simple-icons-figma',
  to: 'https://go.nuxt.com/figma-ui',
  target: '_blank'
}, {
  label: 'Releases',
  icon: 'i-lucide-rocket',
  to: 'https://github.com/nuxt/ui/releases',
  target: '_blank'
}]
</script>

<template>
  <Navbar />

  <UHeader :class="pg.w_full">
    <template #title>
      <Logo :class="pg.h_6_w_auto" />
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />

      <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/nuxt/ui"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </UTooltip>
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" :class="pg.mx_2_5" />
    </template>
  </UHeader>
</template>
