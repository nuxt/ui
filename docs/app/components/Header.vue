<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import type { NavigationMenuItem } from '@nuxt/ui'

const props = defineProps<{
  links: NavigationMenuItem[]
}>()

const config = useRuntimeConfig().public

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const items = computed(() => props.links.map(({ icon, ...link }) => link))

defineShortcuts({
  meta_g: () => {
    window.open('https://github.com/nuxt/ui/tree/v3', '_blank')
  }
})
</script>

<template>
  <UHeader :ui="{ left: 'min-w-0' }">
    <template #left>
      <NuxtLink to="/" class="flex items-end gap-2 font-bold text-xl text-[var(--ui-text-highlighted)] min-w-0 focus-visible:outline-[var(--ui-primary)] shrink-0" aria-label="Nuxt UI">
        <Logo class="w-auto h-6 shrink-0" />
      </NuxtLink>

      <UDropdownMenu
        v-slot="{ open }"
        :modal="false"
        :items="[{ label: `v${config.version}`, active: true, color: 'primary', checked: true, type: 'checkbox' }, { label: 'v2.19', to: 'https://ui.nuxt.com' }]"
        :ui="{ content: 'w-(--radix-dropdown-menu-trigger-width) min-w-0' }"
        size="xs"
      >
        <UButton
          :label="`v${config.version}`"
          variant="subtle"
          trailing-icon="i-lucide-chevron-down"
          size="xs"
          class="-mb-[6px] font-semibold rounded-full truncate"
          :class="[open && 'bg-[var(--ui-primary)]/15 ']"
          :ui="{
            trailingIcon: ['transition-transform duration-200', open ? 'rotate-180' : undefined].filter(Boolean).join(' ')
          }"
        />
      </UDropdownMenu>
    </template>

    <UNavigationMenu :items="items" variant="link" />

    <template #right>
      <ThemePicker />

      <UTooltip text="Search" :kbds="['meta', 'K']">
        <UContentSearchButton />
      </UTooltip>

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

    <template #content>
      <UNavigationMenu orientation="vertical" :items="links" class="-ml-2.5" />

      <USeparator type="dashed" class="my-4" />

      <FrameworkSelect class="mb-4" />

      <UContentNavigation :navigation="navigation" highlight />
    </template>
  </UHeader>
</template>
