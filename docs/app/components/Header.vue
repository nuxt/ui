<script setup lang="ts">
import type { NavItem } from '@nuxt/content'
import type { NavigationMenuItem } from '@nuxt/ui'

const props = defineProps<{
  links: NavigationMenuItem[]
}>()

const route = useRoute()
const config = useRuntimeConfig().public

const navigation = inject<Ref<NavItem[]>>('navigation')

const items = computed(() => props.links.map(({ icon, ...link }) => link))
</script>

<template>
  <UHeader
    :class="{
      'border-primary-200/75 dark:border-primary-900/50': route.path === '/',
      'border-gray-200 dark:border-gray-800': route.path !== '/'
    }"
  >
    <template #left>
      <NuxtLink to="/" class="flex items-end gap-2 font-bold text-xl text-gray-900 dark:text-white" aria-label="Nuxt UI">
        <Logo class="w-auto h-6" />

        <UBadge :label="`v${config.version}`" variant="subtle" size="sm" class="-mb-[2px] rounded font-semibold" />
      </NuxtLink>
    </template>

    <!-- <UNavigationMenu :items="items" variant="link" /> -->

    <template #right>
      <!-- <ColorPicker /> -->

      <UTooltip text="Search" :kbds="['meta', 'K']">
        <UContentSearchButton />
      </UTooltip>

      <!-- <UColorModeButton /> -->

      <UButton
        color="gray"
        variant="ghost"
        to="https://github.com/nuxt/ui"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="GitHub"
      />
    </template>

    <template #content>
      <UNavigationMenu orientation="vertical" :items="items" class="-ml-2.5" />

      <USeparator type="dashed" class="my-4" />

      <UContentNavigation :navigation="navigation" />
    </template>
  </UHeader>
</template>
