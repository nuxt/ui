<script setup lang="ts">
import type { NuxtError } from '#app'
const pg = usePg()


const { components, groups, items } = useNavigation()

defineProps<{
  error: NuxtError
}>()

provide('components', components)
</script>

<template>
  <UApp>
    <UDashboardGroup unit="rem">
      <UDashboardSidebar :class="pg.bg_elevated_25">
        <template #header>
          <NuxtLink to="/" :class="pg.text_highlighted">
            <Logo :class="pg.h_5_w_auto" />
          </NuxtLink>

          <div :class="pg.flex_items_center_ms_auto">
            <ThemeDropdown />

            <UColorModeButton />
          </div>
        </template>

        <UDashboardSearchButton />

        <UNavigationMenu :items="items" orientation="vertical" />

        <USeparator type="dashed" />

        <UNavigationMenu :items="components" orientation="vertical" />
      </UDashboardSidebar>

      <UDashboardPanel>
        <UDashboardNavbar :class="pg.border_b_0" />

        <UError :error="error" />
      </UDashboardPanel>

      <UDashboardSearch :groups="groups" />
    </UDashboardGroup>
  </UApp>
</template>
