<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()

const { components, groups, items } = useNavigation()

useHead({
  title: 'Nuxt UI - Playground',
  htmlAttrs: {
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
          <NuxtLink to="/" class="text-highlighted">
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
