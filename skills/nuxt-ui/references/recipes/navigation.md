# Navigation

Patterns for headers, sidebars, breadcrumbs, and tab navigation.

## Responsive header with mobile menu

```vue [app.vue]
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = computed<NavigationMenuItem[]>(() => [{
  label: 'Features',
  to: '#features'
}, {
  label: 'Pricing',
  to: '/pricing'
}, {
  label: 'Docs',
  to: '/docs'
}])
</script>

<template>
  <UApp>
    <UHeader>
      <template #title>
        <Logo class="h-6 w-auto" />
      </template>

      <!-- Desktop nav (horizontal) -->
      <UNavigationMenu :items="items" />

      <template #right>
        <UColorModeButton />
        <UButton label="Sign in" color="neutral" variant="ghost" />
        <UButton label="Get started" />
      </template>

      <!-- Mobile menu content (shown when hamburger is tapped) -->
      <template #body>
        <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>
  </UApp>
</template>
```

The `#body` slot is critical — without it, mobile users have no navigation. `UHeader` automatically shows a hamburger button on small screens that toggles the body content.

## Sidebar navigation (dashboard)

```vue [layouts/dashboard.vue]
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = computed<NavigationMenuItem[]>(() => [{
  label: 'Home',
  icon: 'i-lucide-house',
  to: '/dashboard'
}, {
  label: 'Projects',
  icon: 'i-lucide-folder',
  to: '/dashboard/projects'
}, {
  label: 'Analytics',
  icon: 'i-lucide-bar-chart-3',
  to: '/dashboard/analytics'
}, {
  label: 'Settings',
  icon: 'i-lucide-settings',
  to: '/dashboard/settings'
}])
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible resizable>
      <template #header="{ collapsed }">
        <NuxtLink to="/dashboard" class="flex items-center gap-2">
          <Logo class="size-6" />
          <span v-if="!collapsed" class="font-semibold text-default">My App</span>
        </NuxtLink>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          :ui="{ link: collapsed ? 'justify-center' : undefined }"
        />
      </template>

      <template #footer="{ collapsed }">
        <UDropdownMenu
          :items="[
            [{ label: 'Profile', icon: 'i-lucide-user', to: '/profile' }],
            [{ label: 'Sign out', icon: 'i-lucide-log-out', onSelect: () => signOut() }]
          ]"
        >
          <UButton
            :icon="collapsed ? 'i-lucide-user' : undefined"
            :label="collapsed ? undefined : 'John Doe'"
            color="neutral"
            variant="ghost"
            block
          />
        </UDropdownMenu>
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
```

## Breadcrumbs

```vue
<script setup lang="ts">
const route = useRoute()

const breadcrumbs = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  return segments.map((segment, index) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1),
    to: '/' + segments.slice(0, index + 1).join('/')
  }))
})
</script>

<template>
  <UBreadcrumb :items="breadcrumbs" />
</template>
```

## Tab navigation (within a page)

```vue
<script setup lang="ts">
const items = [{
  label: 'Overview',
  icon: 'i-lucide-layout-dashboard',
  slot: 'overview' as const
}, {
  label: 'Activity',
  icon: 'i-lucide-activity',
  slot: 'activity' as const
}, {
  label: 'Members',
  icon: 'i-lucide-users',
  slot: 'members' as const
}]
</script>

<template>
  <UTabs :items="items">
    <template #overview>
      <!-- Overview content -->
    </template>
    <template #activity>
      <!-- Activity feed -->
    </template>
    <template #members>
      <!-- Members list -->
    </template>
  </UTabs>
</template>
```

## Choosing the right navigation pattern

- **UHeader** + **UNavigationMenu** (horizontal) — public-facing sites, marketing pages
- **UDashboardSidebar** + **UNavigationMenu** (vertical) — admin dashboards, apps
- **UTabs** — switching views within a single page (no URL change needed)
- **UBreadcrumb** — showing hierarchy in nested page structures
- **UCommandPalette** — power-user search and keyboard navigation (Cmd+K)
- **UDropdownMenu** — contextual actions on a trigger (user menu, action buttons)
