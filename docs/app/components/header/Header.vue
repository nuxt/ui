<script setup lang="ts">
const route = useRoute()
const { desktopLinks } = useHeader()
</script>

<template>
  <UHeader
    :ui="{ left: 'min-w-0', container: [route.path.startsWith('/blog/') ? 'max-w-none' : ''] }"
    class="flex flex-col"
  >
    <template #left>
      <HeaderLogo />

      <VersionMenu />
    </template>

    <UNavigationMenu :items="desktopLinks" variant="link" />

    <template #right>
      <ThemePicker />

      <UTooltip text="Search" :kbds="['meta', 'K']">
        <UContentSearchButton />
      </UTooltip>

      <UTooltip text="Open on GitHub" class="hidden lg:flex">
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

    <template #toggle="{ open, toggle, ui }">
      <HeaderToggleButton
        :open="open"
        :class="ui.toggle({ toggleSide: 'right' })"
        @click="toggle"
      />
    </template>

    <template #body>
      <HeaderBody />
    </template>

    <template v-if="route.path.startsWith('/docs/')" #bottom>
      <HeaderBottom />
    </template>
  </UHeader>
</template>
