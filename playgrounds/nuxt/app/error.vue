<script setup lang="ts">
import type { NuxtError } from '#app'

const { components, groups, items } = useNavigation()

defineProps<{
  error: NuxtError
}>()

provide('components', components)
</script>

<template>
  <UApp>
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

      <UDashboardPanel>
        <UDashboardNavbar class="border-b-0" />

        <UError :error="error" />
      </UDashboardPanel>

      <UDashboardSearch :groups="groups" />
    </UDashboardGroup>
  </UApp>
</template>
