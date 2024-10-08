<script setup lang="ts">
import type { NavItem } from '@nuxt/content'
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  links: NavigationMenuItem[]
}>()

const config = useRuntimeConfig().public

const navigation = inject<Ref<NavItem[]>>('navigation')

// const items = computed(() => props.links.map(({ icon, ...link }) => link))

defineShortcuts({
  meta_g: () => {
    window.open('https://github.com/nuxt/ui/tree/v3', '_blank')
  }
})
</script>

<template>
  <UHeader :ui="{ left: 'min-w-0' }">
    <template #left>
      <NuxtLink to="/" class="flex items-end gap-2 font-bold text-xl text-[--ui-text-highlighted] min-w-0" aria-label="Nuxt UI">
        <Logo class="w-auto h-6 shrink-0" />

        <UBadge :label="`v${config.version}`" variant="subtle" size="sm" class="-mb-[2px] rounded font-semibold inline-block truncate" />
      </NuxtLink>
    </template>

    <!-- <UNavigationMenu :items="items" variant="link" /> -->

    <template #right>
      <ThemePicker />

      <UTooltip text="Search" :kbds="['meta', 'K']">
        <UContentSearchButton />
      </UTooltip>

      <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/nuxt/ui/tree/v3"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </UTooltip>
    </template>

    <template #content>
      <!-- <UNavigationMenu orientation="vertical" :items="items" class="-ml-2.5" />

      <USeparator type="dashed" class="my-4" /> -->

      <UContentNavigation :navigation="navigation" />
    </template>
  </UHeader>
</template>
