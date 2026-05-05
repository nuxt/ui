# Dashboard Layout

Build admin interfaces with resizable sidebars, multi-panel layouts, and toolbars.

## When to use

- Admin panels, back-office UIs
- Email clients, project management tools
- Any app with a persistent sidebar and content panels
- Combine with chat or editor layouts for specialized dashboards

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
          :collapsed="collapsed"
          :items="items"
          orientation="vertical"
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
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
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

### Common mistakes

- Forgetting `definePageMeta({ layout: 'dashboard' })` — the page won't use the dashboard layout without it.
- Putting content directly in `UDashboardPanel` without using `#body` slot — content won't scroll properly.
- Not handling the `collapsed` slot prop — sidebar content should adapt when collapsed (hide labels, center icons).

## Key components

### DashboardGroup

Root wrapper. Manages sidebar state and persistence.

| Prop | Default | Purpose |
|---|---|---|
| `storage` | `'cookie'` | `'cookie'`, `'localStorage'`, `false` |
| `storage-key` | `'dashboard'` | Storage key name |

### DashboardSidebar

Resizable, collapsible sidebar. Must be inside `DashboardGroup`.

| Prop | Default | Purpose |
|---|---|---|
| `resizable` | `false` | Drag to resize |
| `collapsible` | `false` | Collapse when dragged to edge |
| `side` | `'left'` | `'left'` or `'right'` |
| `mode` | `'slideover'` | Mobile: `'modal'`, `'slideover'`, `'drawer'` |

All slots receive `{ collapsed, collapse }` — `collapsed` is the boolean state, `collapse(value)` toggles it programmatically. Use `v-model:collapsed` and `v-model:open` (mobile) for state control.

### DashboardPanel

Content panel with `#header`, `#body` (scrollable), `#footer`, and `#default` (raw, no scroll) slots.

### DashboardNavbar / DashboardToolbar

Navbar: `#leading`, `#left`, `#default`, `#right` slots + `title` prop. Use `UDashboardSidebarCollapse` in `#leading` to toggle sidebar on mobile.
Toolbar: same slots, sits below navbar for filters/actions.

### UNavigationMenu in sidebar

Always pass `:collapsed="collapsed"` to `UNavigationMenu` inside a collapsible sidebar — it auto-hides labels and centers icons. Use `NavigationMenuItem[][]` (array of arrays) for separate groups (main nav + footer links).

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
