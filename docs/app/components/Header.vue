<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import type { NavigationMenuItem } from '@nuxt/ui'

const props = defineProps<{
  links: NavigationMenuItem[]
}>()

const route = useRoute()
const config = useRuntimeConfig().public
const { module } = useSharedData()

const value = ref<string | undefined>(module.value)

watch(module, () => {
  value.value = module.value
})

onMounted(() => {
  value.value = module.value
})

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const desktopLinks = computed(() => props.links.map(({ icon, ...link }) => link))
const mobileLinks = computed(() => props.links.map(link => ({ ...link, defaultOpen: link.children && route.path.startsWith(link.to as string) })))
</script>

<template>
  <UHeader :ui="{ left: 'min-w-0' }" :menu="{ shouldScaleBackground: true }">
    <template #left>
      <NuxtLink to="/" class="flex items-end gap-2 font-bold text-xl text-(--ui-text-highlighted) min-w-0 focus-visible:outline-(--ui-primary) shrink-0" aria-label="Nuxt UI">
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
          :class="[open && 'bg-(--ui-primary)/15 ']"
          :ui="{
            trailingIcon: ['transition-transform duration-200', open ? 'rotate-180' : undefined].filter(Boolean).join(' ')
          }"
        />
      </UDropdownMenu>
    </template>

    <UNavigationMenu :items="desktopLinks" variant="link" />

    <template #right>
      <ThemePicker />

      <UTooltip text="Search" :kbds="['meta', 'K']">
        <UContentSearchButton />
      </UTooltip>

      <UTooltip text="Open on GitHub" class="hidden lg:flex">
        <UButton
          :key="value"
          color="neutral"
          variant="ghost"
          :to="`https://github.com/nuxt/${value}`"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </UTooltip>
    </template>

    <template #body>
      <UNavigationMenu orientation="vertical" :items="mobileLinks" class="-mx-2.5" default-open />

      <USeparator type="dashed" class="mt-4 mb-6" />

      <div class="flex flex-col gap-2 w-[calc(100%+1.25rem)] mb-5.5 -mx-2.5">
        <FrameworkSelect />
        <ModuleSelect />
      </div>

      <UContentNavigation :navigation="navigation" highlight :ui="{ linkTrailingBadge: 'font-semibold uppercase' }">
        <template #link-title="{ link }">
          <span class="inline-flex items-center gap-0.5">
            {{ link.title }}

            <sup v-if="link.module === 'ui-pro'" class="text-[8px] font-medium text-(--ui-primary)">PRO</sup>
          </span>
        </template>
      </UContentNavigation>
    </template>
  </UHeader>
</template>
