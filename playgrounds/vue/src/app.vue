<script setup lang="ts">
import { reactive } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const appConfig = useAppConfig()

appConfig.dir = ref('ltr')
appConfig.toaster = reactive({
  position: 'bottom-right' as const,
  expand: true,
  duration: 5000
})

useHead({
  title: 'Nuxt UI - Playground',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'Explore and test all Nuxt UI components in an interactive environment' }
  ],
  htmlAttrs: {
    dir: computed(() => appConfig.dir as 'ltr' | 'rtl')
  }
})

const { components, groups, items } = useNavigation()

provide('components', components)
</script>

<template>
  <UApp :toaster="appConfig.toaster" :dir="appConfig.dir">
    <UDashboardGroup unit="rem" storage="local">
      <UDashboardSidebar
        class="bg-elevated/25"
        resizable
        collapsible
        :toggle="{ size: 'sm', variant: 'outline', class: 'ring-default' }"
      >
        <template #header="{ collapsed }">
          <RouterLink to="/" class="text-highlighted inline-flex" aria-label="Home">
            <Logo class="h-5 w-auto" :collapsed="collapsed" />
          </RouterLink>

          <div v-if="!collapsed" class="flex items-center ms-auto">
            <ThemeDropdown />

            <UColorModeButton />
          </div>
        </template>

        <template #default="{ collapsed }">
          <UDashboardSearchButton :collapsed="collapsed" />

          <UNavigationMenu :collapsed="collapsed" :items="items" orientation="vertical" />

          <USeparator type="dashed" />

          <UNavigationMenu :collapsed="collapsed" :items="components" orientation="vertical" />
        </template>
      </UDashboardSidebar>

      <UDashboardPanel
        :ui="{
          body: [
            'justify-center items-center',
            route.path.startsWith('/components') && 'mt-16',
            route.path.startsWith('/components/scroll-area') && 'p-0!'
          ]
        }"
      >
        <template #body>
          <Suspense>
            <RouterView />
          </Suspense>
        </template>
      </UDashboardPanel>

      <UDashboardSearch :groups="groups" :fuse="{ resultLimit: 100 }" />
    </UDashboardGroup>
  </UApp>
</template>
