<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import type { NavigationMenuItem } from '@nuxt/ui'

const props = defineProps<{
  links: NavigationMenuItem[]
}>()

const config = useRuntimeConfig().public
const { module } = useSharedData()

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const items = computed(() => props.links.map(({ icon, ...link }) => link))

defineShortcuts({
  meta_g: () => {
    window.open('https://github.com/nuxt/ui/tree/v3', '_blank')
  }
})
</script>

<template>
  <UHeader :ui="{ left: 'min-w-0', toggle: '-mr-1.5' }" mode="drawer" :menu="{ shouldScaleBackground: true }">
    <template #left>
      <NuxtLink to="/" class="flex items-end gap-2 font-bold text-xl text-[var(--ui-text-highlighted)] min-w-0 focus-visible:outline-[var(--ui-primary)] shrink-0" aria-label="Nuxt UI">
        <LogoPro class="w-auto h-6 shrink-0 ui-pro-only" />
        <Logo class="w-auto h-6 shrink-0 ui-only" />
      </NuxtLink>

      <UDropdownMenu
        v-slot="{ open }"
        :modal="false"
        :items="[{ label: `v${config.version}`, active: true, color: 'primary', checked: true, type: 'checkbox' }, { label: module === 'ui-pro' ? 'v1.5' : 'v2.19', to: module === 'ui-pro' ? 'https://ui.nuxt.com/pro' : 'https://ui.nuxt.com' }]"
        :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width) min-w-0' }"
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

      <UTooltip text="Open on GitHub" :kbds="['meta', 'G']" class="hidden lg:flex">
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
      <UNavigationMenu orientation="vertical" :items="links" class="-mx-2.5" />

      <USeparator type="dashed" class="mt-4 mb-6" />

      <div class="flex flex-col gap-2 w-[calc(100%+1.25rem)] mb-5.5 -mx-2.5">
        <ModuleSelect />
        <FrameworkSelect />
      </div>

      <UContentNavigation :navigation="navigation" highlight />
    </template>
  </UHeader>
</template>
