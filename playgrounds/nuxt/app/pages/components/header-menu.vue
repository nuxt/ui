<script setup lang="ts">
const modes = ['inline', 'modal', 'slideover', 'drawer'] as const
const mode = ref<typeof modes[number]>('inline')

const items = [{
  label: 'Docs',
  icon: 'i-lucide-book-open'
}, {
  label: 'Components',
  icon: 'i-lucide-box',
  active: true
}, {
  label: 'Releases',
  icon: 'i-lucide-rocket',
  to: 'https://github.com/nuxt/ui/releases',
  target: '_blank'
}]
</script>

<template>
  <Navbar>
    <USelect v-model="mode" :items="[...modes]" />
  </Navbar>

  <UHeader class="w-full">
    <template #title>
      <Logo class="h-6 w-auto" />
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />
    </template>

    <template #menu>
      <UHeaderMenu :mode="mode">
        <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
      </UHeaderMenu>
    </template>
  </UHeader>
</template>
