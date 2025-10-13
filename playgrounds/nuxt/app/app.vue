<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()

const { components, groups, items } = useNavigation()

useHead({
  title: 'Nuxt UI - Playground',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'Explore and test all Nuxt UI components in an interactive environment' }
  ],
  htmlAttrs: {
    lang: 'en',
    dir: computed(() => appConfig.dir as 'ltr' | 'rtl')
  }
})

provide('components', components)
</script>

<template>
  <UApp :toaster="appConfig.toaster" :dir="appConfig.dir">
    <UDashboardGroup unit="rem">
      <UDashboardSidebar class="bg-elevated/25">
        <template #header>
          <NuxtLink to="/" class="text-highlighted" aria-label="Home">
            <Logo class="h-5 w-auto" />
          </NuxtLink>

          <div class="flex items-center ms-auto">
            <ThemeDropdown />

            <UColorModeButton />
          </div>
        </template>

        <UDashboardSearchButton />

        <UNavigationMenu :items="items" orientation="vertical" />

        <USeparator type="dashed" />

        <UNavigationMenu :items="components" orientation="vertical" />
      </UDashboardSidebar>

      <UDashboardPanel :ui="{ body: ['justify-center items-center', route.path.startsWith('/components') && 'mt-16'] }">
        <template #body>
          <NuxtPage />
        </template>
      </UDashboardPanel>

      <UDashboardSearch :groups="groups" :fuse="{ resultLimit: 100 }" />
    </UDashboardGroup>
  </UApp>
</template>
