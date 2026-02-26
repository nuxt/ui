# Dashboard Layout

Build admin interfaces with resizable sidebars, multi-panel layouts, and toolbars.

## Component tree

```
UApp
└── NuxtLayout (dashboard)
    └── UDashboardGroup
        ├── UDashboardSidebar
        │   ├── #header (logo, search button)
        │   ├── #default (navigation) — receives { collapsed } slot prop
        │   └── #footer (user menu)
        └── NuxtPage
            └── UDashboardPanel
                ├── #header → UDashboardNavbar + UDashboardToolbar
                ├── #body (scrollable content)
                └── #footer (optional)
```

## Layout

```vue [layouts/dashboard.vue]
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = computed<NavigationMenuItem[]>(() => [{
  label: 'Home',
  icon: 'i-lucide-house',
  to: '/dashboard'
}, {
  label: 'Inbox',
  icon: 'i-lucide-inbox',
  to: '/dashboard/inbox'
}, {
  label: 'Users',
  icon: 'i-lucide-users',
  to: '/dashboard/users'
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
        <UDashboardSearchButton :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          :ui="{ link: collapsed ? 'justify-center' : undefined }"
        />
      </template>

      <template #footer="{ collapsed }">
        <UButton
          :icon="collapsed ? 'i-lucide-log-out' : undefined"
          :label="collapsed ? undefined : 'Sign out'"
          color="neutral"
          variant="ghost"
          block
        />
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
```

## Page

```vue [pages/dashboard/index.vue]
<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Home">
        <template #right>
          <UButton icon="i-lucide-plus" label="New" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- Page content -->
    </template>
  </UDashboardPanel>
</template>
```

## Key components

### DashboardGroup

Root layout wrapper. Manages sidebar state and persistence.

| Prop | Default | Description |
|---|---|---|
| `storage` | `'cookie'` | State persistence: `'cookie'`, `'localStorage'`, `false` |
| `storage-key` | `'dashboard'` | Storage key name |
| `unit` | `'percentages'` | Size unit: `'percentages'` or `'pixels'` |

### DashboardSidebar

Resizable, collapsible sidebar. Must be inside `DashboardGroup`.

| Prop | Default | Description |
|---|---|---|
| `resizable` | `false` | Enable resize by dragging |
| `collapsible` | `false` | Enable collapse when dragged to edge |
| `side` | `'left'` | `'left'` or `'right'` |
| `mode` | `'slideover'` | Mobile menu mode: `'modal'`, `'slideover'`, `'drawer'` |

Slots receive `{ collapsed }` prop. Control state: `v-model:collapsed`, `v-model:open` (mobile).

### DashboardPanel

Content panel with `#header`, `#body` (scrollable), `#footer`, and `#default` (raw) slots.

| Prop | Default | Description |
|---|---|---|
| `id` | `—` | Unique ID (required for multi-panel) |
| `resizable` | `false` | Enable resize by dragging |

### DashboardNavbar / DashboardToolbar

Navbar has `#left`, `#default`, `#right` slots and a `title` prop. Toolbar has the same slots for filters/actions below the navbar.

## Multi-panel (list-detail)

```vue [pages/dashboard/inbox.vue]
<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
</script>

<template>
  <UDashboardPanel id="inbox-list" resizable>
    <template #header>
      <UDashboardNavbar title="Inbox" />
    </template>
    <template #body>
      <!-- Email list -->
    </template>
  </UDashboardPanel>

  <UDashboardPanel id="inbox-detail" class="hidden lg:flex">
    <template #header>
      <UDashboardNavbar title="Message" />
    </template>
    <template #body>
      <!-- Email content -->
    </template>
  </UDashboardPanel>
</template>
```

## With toolbar

```vue
<UDashboardPanel>
  <template #header>
    <UDashboardNavbar title="Users" />

    <UDashboardToolbar>
      <template #left>
        <UInput icon="i-lucide-search" placeholder="Search..." />
      </template>
      <template #right>
        <USelect :items="['All', 'Active', 'Inactive']" />
      </template>
    </UDashboardToolbar>
  </template>
</UDashboardPanel>
```

## With search

```vue [layouts/dashboard.vue]
<template>
  <UDashboardGroup>
    <UDashboardSidebar>
      <template #header>
        <UDashboardSearchButton />
      </template>
      <!-- ... -->
    </UDashboardSidebar>

    <slot />

    <UDashboardSearch :groups="searchGroups" />
  </UDashboardGroup>
</template>
```

## Right sidebar

```vue
<UDashboardGroup>
  <UDashboardSidebar collapsible resizable>
    <!-- Left sidebar -->
  </UDashboardSidebar>

  <slot />

  <UDashboardSidebar side="right" resizable>
    <!-- Right sidebar -->
  </UDashboardSidebar>
</UDashboardGroup>
```
