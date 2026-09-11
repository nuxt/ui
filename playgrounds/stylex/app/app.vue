<script setup lang="ts">
const pg = usePg()

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
    dir: computed(() => appConfig.dir)
  }
})

provide('components', components)
</script>

<template>
  <UApp :toaster="appConfig.toaster" :dir="appConfig.dir">
    <UDashboardGroup unit="rem">
      <UDashboardSidebar
        :class="pg.bg_elevated_25"
        resizable
        collapsible
        :toggle="{ size: 'sm', variant: 'outline', class: pg.ring_default }"
      >
        <template #header="{ collapsed }">
          <NuxtLink to="/" :class="pg.text_highlighted_inline_flex" aria-label="Home">
            <Logo :class="pg.h_5_w_auto" :collapsed="collapsed" />
          </NuxtLink>

          <div v-if="!collapsed" :class="pg.flex_items_center_ms_auto">
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

      <NuxtPage v-if="route.path.startsWith('/components/sidebar')" />
      <UDashboardPanel
        v-else
        :ui="{
          body: [
            route.path.startsWith('/components') && pg.mt_16,
            route.path.startsWith('/components/scroll-area') && pg.p_0_i
          ]
        }"
      >
        <template #body>
          <div :class="pg.flex_flex_col_items_center_justify_center_min_h_full_shrink_0">
            <NuxtPage />
          </div>
        </template>
      </UDashboardPanel>

      <UDashboardSearch :groups="groups" :fuse="{ resultLimit: 100 }" />
    </UDashboardGroup>
  </UApp>
</template>
