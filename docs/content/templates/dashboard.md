---
title: How to Build an Admin Dashboard with Nuxt
description: Learn how to build an admin dashboard with a collapsible sidebar, charts, data tables, an inbox and settings pages using Nuxt and Nuxt UI.
navigation: false
date: 2026-10-27T10:00:00.000Z
---

## What we're building

By the end of this tutorial, you'll have an admin dashboard with:

- **A dashboard layout** with a resizable and collapsible sidebar, built with [`UDashboardGroup`](/docs/components/dashboard-group) and [`UDashboardSidebar`](/docs/components/dashboard-sidebar)
- **A command palette** to jump between pages and switch the color mode
- **A home page** with stats, a revenue chart and a date range picker
- **A customers table** with sorting, filtering, pagination, row selection and row actions
- **Modals** to add and delete customers, with a form validated by [Zod](https://zod.dev)
- **An inbox** with a resizable list of mails, where the selected mail opens in a slideover on mobile
- **Notifications** in a slideover and **keyboard shortcuts** to move around
- **Settings pages** with forms, switches and a list of members

::callout{icon="i-simple-icons-github"}
Check out the [`Nuxt`](https://github.com/nuxt-ui-templates/dashboard) and [`Vue`](https://github.com/nuxt-ui-templates/dashboard-vue) Dashboard templates on GitHub for complete implementations with a theme picker, a custom color palette and more.
::

## Prerequisites

Before we start, make sure you have:

- Node.js 22.19+ or 24.11+ installed

## Project setup

Start by creating a new Nuxt project:

```bash
npx nuxi@latest init nuxt-dashboard
cd nuxt-dashboard
```

### Installing dependencies

Install Nuxt UI and Tailwind CSS:

::code-group{sync="pm"}
```bash [pnpm]
pnpm add @nuxt/ui tailwindcss
```

```bash [yarn]
yarn add @nuxt/ui tailwindcss
```

```bash [npm]
npm install @nuxt/ui tailwindcss
```

```bash [bun]
bun add @nuxt/ui tailwindcss
```
::

The other packages are installed in the sections that need them.

### Configuration

Register the Nuxt UI module in your `nuxt.config.ts`:

::code-tree-intersection
```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],

  css: ['~/assets/css/main.css']
})
```
::

Create the main CSS file to import Tailwind CSS and Nuxt UI:

::code-tree-intersection
```css [app/assets/css/main.css]
@import "tailwindcss";
@import "@nuxt/ui";
```
::

Nuxt UI requires wrapping your app with `UApp` for tooltips, toasts and overlays to work properly:

::code-tree-intersection
```vue [app/app.vue]
<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
```
::

## Creating the layout

The dashboard components work together. [`UDashboardGroup`](/docs/components/dashboard-group) wraps the whole app and shares its state with a [`UDashboardSidebar`](/docs/components/dashboard-sidebar) and one or more [`UDashboardPanel`](/docs/components/dashboard-panel) next to it.

### Adding the sidebar

Create a default layout with the group, the sidebar and a `<slot />` where each page renders its panels:

::code-tree-intersection
:::code-collapse

```vue [app/layouts/default.vue]
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const links = [[{
  label: 'Home',
  icon: 'i-lucide-house',
  to: '/'
}, {
  label: 'Inbox',
  icon: 'i-lucide-inbox',
  to: '/inbox',
  badge: '4'
}, {
  label: 'Customers',
  icon: 'i-lucide-users',
  to: '/customers'
}, {
  label: 'Settings',
  to: '/settings',
  icon: 'i-lucide-settings',
  defaultOpen: true,
  type: 'trigger',
  children: [{
    label: 'General',
    to: '/settings',
    exact: true
  }, {
    label: 'Members',
    to: '/settings/members'
  }, {
    label: 'Notifications',
    to: '/settings/notifications'
  }, {
    label: 'Security',
    to: '/settings/security'
  }]
}], [{
  label: 'Feedback',
  icon: 'i-lucide-message-circle',
  to: 'https://github.com/nuxt-ui-templates/dashboard',
  target: '_blank'
}, {
  label: 'Help & Support',
  icon: 'i-lucide-info',
  to: 'https://github.com/nuxt-ui-templates/dashboard',
  target: '_blank'
}]] satisfies NavigationMenuItem[][]
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      collapsible
      resizable
      class="bg-elevated/25"
    >
      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
```

:::
::

Here's how the layout works:

**The group**

`UDashboardGroup` stores the size and collapsed state of the sidebar in a cookie, so they survive a reload without a flash on the server render. With `unit="rem"`, the sizes are expressed in `rem` instead of percentages.

**The sidebar**

The [`resizable`](/docs/components/dashboard-sidebar#resizable) prop lets you drag its edge, and [`collapsible`](/docs/components/dashboard-sidebar#collapsible) lets you collapse it to icons by dragging it near the edge of the screen. Its `id` is part of the cookie name. On mobile, the sidebar opens in a slideover and closes on its own when the route changes.

**The navigation**

The slots of `UDashboardSidebar` expose a `collapsed` boolean. Passed to [`UNavigationMenu`](/docs/components/navigation-menu), it hides the labels and shows them in a tooltip instead, while `popover` displays the children of the `Settings` item in a popover. The `trigger` type makes `Settings` expand its children instead of navigating.

The links to the other pages lead to a 404 for now. They're created in the next sections.

Then wrap the pages with `NuxtLayout`:

::code-tree-intersection
```vue [app/app.vue] {3-5}
<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
```
::

### Creating the first panel

Every page renders a `UDashboardPanel`. Its `header` slot stays at the top while its `body` slot scrolls:

::code-tree-intersection
```vue [app/pages/index.vue]
<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>
  </UDashboardPanel>
</template>
```
::

The [`UDashboardNavbar`](/docs/components/dashboard-navbar) component displays the title of the panel. On mobile, it also displays a button that opens the sidebar. The [`UDashboardSidebarCollapse`](/docs/components/dashboard-sidebar-collapse) button in its `leading` slot collapses the sidebar on desktop.

### Adding the team and user menus

The header of the sidebar holds a team switcher built with a [`UDropdownMenu`](/docs/components/dropdown-menu):

::code-tree-intersection
:::code-collapse

```vue [app/components/TeamsMenu.vue]
<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{
  collapsed?: boolean
}>()

const teams = ref([{
  label: 'Nuxt',
  avatar: {
    src: 'https://github.com/nuxt.png',
    alt: 'Nuxt'
  }
}, {
  label: 'NuxtHub',
  avatar: {
    src: 'https://github.com/nuxt-hub.png',
    alt: 'NuxtHub'
  }
}, {
  label: 'NuxtLabs',
  avatar: {
    src: 'https://github.com/nuxtlabs.png',
    alt: 'NuxtLabs'
  }
}])
const selectedTeam = ref(teams.value[0])

const items = computed<DropdownMenuItem[][]>(() => {
  return [teams.value.map(team => ({
    ...team,
    onSelect() {
      selectedTeam.value = team
    }
  })), [{
    label: 'Create team',
    icon: 'i-lucide-circle-plus'
  }, {
    label: 'Manage teams',
    icon: 'i-lucide-cog'
  }]]
})
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
      v-bind="{
        ...selectedTeam,
        label: collapsed ? undefined : selectedTeam?.label,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :class="[!collapsed && 'py-2']"
      :ui="{
        trailingIcon: 'text-dimmed'
      }"
    />
  </UDropdownMenu>
</template>
```

:::
::

And the footer holds a user menu with a color mode switch:

::code-tree-intersection
:::code-collapse

```vue [app/components/UserMenu.vue]
<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{
  collapsed?: boolean
}>()

const colorMode = useColorMode()

const user = ref({
  name: 'Benjamin Canac',
  avatar: {
    src: 'https://github.com/benjamincanac.png',
    alt: 'Benjamin Canac'
  }
})

const items = computed<DropdownMenuItem[][]>(() => ([[{
  type: 'label',
  label: user.value.name,
  avatar: user.value.avatar
}], [{
  label: 'Profile',
  icon: 'i-lucide-user'
}, {
  label: 'Billing',
  icon: 'i-lucide-credit-card'
}, {
  label: 'Settings',
  icon: 'i-lucide-settings',
  to: '/settings'
}], [{
  label: 'Appearance',
  icon: 'i-lucide-sun-moon',
  children: [{
    label: 'Light',
    icon: 'i-lucide-sun',
    type: 'checkbox',
    checked: colorMode.value === 'light',
    onSelect(e: Event) {
      e.preventDefault()

      colorMode.preference = 'light'
    }
  }, {
    label: 'Dark',
    icon: 'i-lucide-moon',
    type: 'checkbox',
    checked: colorMode.value === 'dark',
    onSelect(e: Event) {
      e.preventDefault()

      colorMode.preference = 'dark'
    }
  }]
}], [{
  label: 'Documentation',
  icon: 'i-lucide-book-open',
  to: 'https://ui.nuxt.com/docs/getting-started/installation/nuxt',
  target: '_blank'
}, {
  label: 'GitHub repository',
  icon: 'i-simple-icons-github',
  to: 'https://github.com/nuxt-ui-templates/dashboard',
  target: '_blank'
}], [{
  label: 'Log out',
  icon: 'i-lucide-log-out'
}]]))
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
      v-bind="{
        ...user,
        label: collapsed ? undefined : user?.name,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :ui="{
        trailingIcon: 'text-dimmed'
      }"
    />
  </UDropdownMenu>
</template>
```

:::
::

Both menus receive the `collapsed` state to only show an avatar when the sidebar is collapsed. Otherwise the `w-(--reka-dropdown-menu-trigger-width)` class makes the menu as wide as the button. Calling `e.preventDefault()` in `onSelect` keeps the menu open when you switch the color mode.

### Adding the search

The [`UDashboardSearch`](/docs/components/dashboard-search) component is a [`UCommandPalette`](/docs/components/command-palette) in a modal. It opens with :kbd{value="meta"} :kbd{value="k" class="ms-px"} or with the [`UDashboardSearchButton`](/docs/components/dashboard-search-button) component.

Add the menus to the `header` and `footer` slots of the sidebar, and the search with the links of the sidebar as a group:

::code-tree-intersection
:::code-collapse

```vue [app/layouts/default.vue] {49-53,63,65-67,70,89-91,94}
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const links = [[{
  label: 'Home',
  icon: 'i-lucide-house',
  to: '/'
}, {
  label: 'Inbox',
  icon: 'i-lucide-inbox',
  to: '/inbox',
  badge: '4'
}, {
  label: 'Customers',
  icon: 'i-lucide-users',
  to: '/customers'
}, {
  label: 'Settings',
  to: '/settings',
  icon: 'i-lucide-settings',
  defaultOpen: true,
  type: 'trigger',
  children: [{
    label: 'General',
    to: '/settings',
    exact: true
  }, {
    label: 'Members',
    to: '/settings/members'
  }, {
    label: 'Notifications',
    to: '/settings/notifications'
  }, {
    label: 'Security',
    to: '/settings/security'
  }]
}], [{
  label: 'Feedback',
  icon: 'i-lucide-message-circle',
  to: 'https://github.com/nuxt-ui-templates/dashboard',
  target: '_blank'
}, {
  label: 'Help & Support',
  icon: 'i-lucide-info',
  to: 'https://github.com/nuxt-ui-templates/dashboard',
  target: '_blank'
}]] satisfies NavigationMenuItem[][]

const groups = [{
  id: 'links',
  label: 'Go to',
  items: links.flat()
}]
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <TeamsMenu :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />
  </UDashboardGroup>
</template>
```

:::
::

::tip{to="/docs/components/dashboard-search#color-mode"}
The search also adds a group to switch the color mode. Set the `color-mode` prop to `false` to remove it.
::

## Building the home page

The home page has a toolbar with a date range picker and a period select. The stats, the chart and the table below all follow the selected range and period.

### Installing the chart dependencies

::code-group{sync="pm"}
```bash [pnpm]
pnpm add @tanstack/charts @internationalized/date date-fns
```

```bash [yarn]
yarn add @tanstack/charts @internationalized/date date-fns
```

```bash [npm]
npm install @tanstack/charts @internationalized/date date-fns
```

```bash [bun]
bun add @tanstack/charts @internationalized/date date-fns
```
::

The [`UChart`](/docs/components/chart) component is built on [TanStack Charts](https://tanstack.com/charts/v1), an optional peer dependency of Nuxt UI. The [`UCalendar`](/docs/components/calendar) component works with the date objects of `@internationalized/date`, and `date-fns` handles the date math.

### Defining the types

Declare the types used across the dashboard:

::code-tree-intersection
```ts [app/types/index.d.ts]
import type { AvatarProps } from '@nuxt/ui'

export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'
export type SaleStatus = 'paid' | 'failed' | 'refunded'

export interface User {
  id: number
  name: string
  email: string
  avatar?: AvatarProps
  status: UserStatus
  location: string
}

export interface Mail {
  id: number
  unread?: boolean
  from: User
  subject: string
  body: string
  date: string
}

export interface Member {
  name: string
  username: string
  role: 'member' | 'owner'
  avatar: AvatarProps
}

export interface Stat {
  title: string
  icon: string
  value: number | string
  variation: number
  formatter?: (value: number) => string
}

export interface Sale {
  id: string
  date: string
  status: SaleStatus
  email: string
  amount: number
}

export interface Notification {
  id: number
  unread?: boolean
  sender: User
  body: string
  date: string
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}
```
::

The dashboard has no database, so the home page generates random numbers. Add two helpers for that:

::code-tree-intersection
```ts [app/utils/index.ts]
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFrom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!
}
```
::

Nuxt auto-imports the functions exported from `app/utils`.

### Picking a date range

Nuxt prefixes components with the name of their directory, without doubling it. So `app/components/home/HomeStats.vue` becomes `HomeStats`, and `app/components/customers/AddModal.vue` becomes `CustomersAddModal`.

The date range picker opens a [`UPopover`](/docs/components/popover) with a list of preset ranges and a [`UCalendar`](/docs/components/calendar) that shows two months:

::code-tree-intersection
:::code-collapse

```vue [app/components/home/HomeDateRangePicker.vue]
<script setup lang="ts">
import { DateFormatter, getLocalTimeZone, CalendarDate, today } from '@internationalized/date'
import type { Range } from '~/types'

const df = new DateFormatter('en-US', {
  dateStyle: 'medium'
})

const selected = defineModel<Range>({ required: true })

const ranges = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 14 days', days: 14 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 3 months', months: 3 },
  { label: 'Last 6 months', months: 6 },
  { label: 'Last year', years: 1 }
]

const toCalendarDate = (date: Date) => {
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
}

const calendarRange = computed({
  get: () => ({
    start: selected.value.start ? toCalendarDate(selected.value.start) : undefined,
    end: selected.value.end ? toCalendarDate(selected.value.end) : undefined
  }),
  set: (newValue: { start: CalendarDate | null, end: CalendarDate | null }) => {
    selected.value = {
      start: newValue.start ? newValue.start.toDate(getLocalTimeZone()) : new Date(),
      end: newValue.end ? newValue.end.toDate(getLocalTimeZone()) : new Date()
    }
  }
})

const isRangeSelected = (range: { days?: number, months?: number, years?: number }) => {
  if (!selected.value.start || !selected.value.end) return false

  const currentDate = today(getLocalTimeZone())
  let startDate = currentDate.copy()

  if (range.days) {
    startDate = startDate.subtract({ days: range.days })
  } else if (range.months) {
    startDate = startDate.subtract({ months: range.months })
  } else if (range.years) {
    startDate = startDate.subtract({ years: range.years })
  }

  const selectedStart = toCalendarDate(selected.value.start)
  const selectedEnd = toCalendarDate(selected.value.end)

  return selectedStart.compare(startDate) === 0 && selectedEnd.compare(currentDate) === 0
}

const selectRange = (range: { days?: number, months?: number, years?: number }) => {
  const endDate = today(getLocalTimeZone())
  let startDate = endDate.copy()

  if (range.days) {
    startDate = startDate.subtract({ days: range.days })
  } else if (range.months) {
    startDate = startDate.subtract({ months: range.months })
  } else if (range.years) {
    startDate = startDate.subtract({ years: range.years })
  }

  selected.value = {
    start: startDate.toDate(getLocalTimeZone()),
    end: endDate.toDate(getLocalTimeZone())
  }
}
</script>

<template>
  <UPopover :content="{ align: 'start' }" :modal="true">
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-calendar"
      class="data-[state=open]:bg-elevated group"
    >
      <span class="truncate">
        <template v-if="selected.start">
          <template v-if="selected.end">
            {{ df.format(selected.start) }} - {{ df.format(selected.end) }}
          </template>
          <template v-else>
            {{ df.format(selected.start) }}
          </template>
        </template>
        <template v-else>
          Pick a date
        </template>
      </span>

      <template #trailing>
        <UIcon name="i-lucide-chevron-down" class="shrink-0 text-dimmed size-5 group-data-[state=open]:rotate-180 transition-transform duration-200" />
      </template>
    </UButton>

    <template #content>
      <div class="flex items-stretch sm:divide-x divide-default">
        <div class="hidden sm:flex flex-col justify-center">
          <UButton
            v-for="(range, index) in ranges"
            :key="index"
            :label="range.label"
            color="neutral"
            variant="ghost"
            class="rounded-none px-4"
            :class="[isRangeSelected(range) ? 'bg-elevated' : 'hover:bg-elevated/50']"
            truncate
            @click="selectRange(range)"
          />
        </div>

        <UCalendar
          v-model="calendarRange"
          class="p-2"
          :number-of-months="2"
          range
        />
      </div>
    </template>
  </UPopover>
</template>
```

:::
::

The model holds native `Date` objects, while `UCalendar` works with `CalendarDate` objects. The `calendarRange` computed converts between both. The presets are hidden on mobile to leave room for the calendar.

The period select only offers the periods that make sense for the selected range, and falls back to the first one when the selected period is no longer available:

::code-tree-intersection
```vue [app/components/home/HomePeriodSelect.vue]
<script setup lang="ts">
import { eachDayOfInterval } from 'date-fns'
import type { Period, Range } from '~/types'

const model = defineModel<Period>({ required: true })

const props = defineProps<{
  range: Range
}>()

const days = computed(() => eachDayOfInterval(props.range))

const periods = computed<Period[]>(() => {
  if (days.value.length <= 8) {
    return [
      'daily'
    ]
  }

  if (days.value.length <= 31) {
    return [
      'daily',
      'weekly'
    ]
  }

  return [
    'weekly',
    'monthly'
  ]
})

// Ensure the model value is always a valid period
watch(periods, () => {
  if (!periods.value.includes(model.value)) {
    model.value = periods.value[0]!
  }
})
</script>

<template>
  <USelect
    v-model="model"
    :items="periods"
    variant="ghost"
    class="data-[state=open]:bg-elevated"
    :ui="{ value: 'capitalize', itemLabel: 'capitalize', trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
  />
</template>
```
::

### Displaying the stats

The stats are four [`UPageCard`](/docs/components/page-card) components in a [`UPageGrid`](/docs/components/page-grid):

::code-tree-intersection
:::code-collapse

```vue [app/components/home/HomeStats.vue]
<script setup lang="ts">
import type { Period, Range, Stat } from '~/types'

const props = defineProps<{
  period: Period
  range: Range
}>()

function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  })
}

const baseStats = [{
  title: 'Customers',
  icon: 'i-lucide-users',
  minValue: 400,
  maxValue: 1000,
  minVariation: -15,
  maxVariation: 25
}, {
  title: 'Conversions',
  icon: 'i-lucide-chart-pie',
  minValue: 1000,
  maxValue: 2000,
  minVariation: -10,
  maxVariation: 20
}, {
  title: 'Revenue',
  icon: 'i-lucide-circle-dollar-sign',
  minValue: 200000,
  maxValue: 500000,
  minVariation: -20,
  maxVariation: 30,
  formatter: formatCurrency
}, {
  title: 'Orders',
  icon: 'i-lucide-shopping-cart',
  minValue: 100,
  maxValue: 300,
  minVariation: -5,
  maxVariation: 15
}]

const { data: stats } = await useAsyncData<Stat[]>('stats', async () => {
  return baseStats.map((stat) => {
    const value = randomInt(stat.minValue, stat.maxValue)
    const variation = randomInt(stat.minVariation, stat.maxVariation)

    return {
      title: stat.title,
      icon: stat.icon,
      value: stat.formatter ? stat.formatter(value) : value,
      variation
    }
  })
}, {
  watch: [() => props.period, () => props.range],
  default: () => []
})
</script>

<template>
  <UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
    <UPageCard
      v-for="(stat, index) in stats"
      :key="index"
      :icon="stat.icon"
      :title="stat.title"
      to="/customers"
      variant="subtle"
      :ui="{
        container: 'gap-y-1.5',
        wrapper: 'items-start',
        leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25 flex-col',
        title: 'font-normal text-muted text-xs uppercase'
      }"
      class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
    >
      <div class="flex items-center gap-2">
        <span class="text-2xl font-semibold text-highlighted">
          {{ stat.value }}
        </span>

        <UBadge
          :color="stat.variation > 0 ? 'success' : 'error'"
          variant="subtle"
          class="text-xs"
        >
          {{ stat.variation > 0 ? '+' : '' }}{{ stat.variation }}%
        </UBadge>
      </div>
    </UPageCard>
  </UPageGrid>
</template>
```

:::
::

The `watch` option of `useAsyncData` generates new numbers whenever the period or the range changes. In your own dashboard, this is where you would fetch them from an API.

### Displaying the revenue chart

The chart is an area [`UChart`](/docs/components/chart) inside a [`UCard`](/docs/components/card):

::code-tree-intersection
:::code-collapse

```vue [app/components/home/HomeChart.vue]
<script setup lang="ts">
import { eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, format } from 'date-fns'
import type { Period, Range } from '~/types'

const props = defineProps<{
  period: Period
  range: Range
}>()

type DataRecord = {
  date: string
  amount: number
}

const formatNumber = new Intl.NumberFormat('en', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format

const formatDate = (date: Date): string => {
  return ({
    daily: format(date, 'd MMM'),
    weekly: format(date, 'd MMM yyyy'),
    monthly: format(date, 'MMM yyy')
  })[props.period]
}

const { data } = await useAsyncData<DataRecord[]>('chart', async () => {
  const dates = ({
    daily: eachDayOfInterval,
    weekly: eachWeekOfInterval,
    monthly: eachMonthOfInterval
  } as Record<Period, typeof eachDayOfInterval>)[props.period](props.range)

  // The y axis rounds the highest amount up to its next step, so keeping it just above 7,000 leaves room above the peak
  const amounts = dates.map(() => randomInt(1000, 7000))
  amounts[randomInt(0, amounts.length - 1)] = randomInt(7100, 7200)

  return dates.map((date, i) => ({ date: formatDate(date), amount: amounts[i]! }))
}, {
  watch: [() => props.period, () => props.range],
  default: () => []
})

const total = computed(() => data.value.reduce((acc: number, { amount }) => acc + amount, 0))
</script>

<template>
  <UCard :ui="{ root: 'overflow-visible', body: 'p-0! overflow-hidden rounded-b-[inherit]' }">
    <template #header>
      <div>
        <p class="text-xs text-muted uppercase mb-1.5">
          Revenue
        </p>
        <p class="text-3xl text-highlighted font-semibold">
          {{ formatNumber(total) }}
        </p>
      </div>
    </template>

    <UChart
      type="area"
      curve="monotone"
      :data="data"
      index="date"
      :categories="[{ key: 'amount', label: 'Revenue' }]"
      :x-axis="false"
      :y-axis="false"
      :grid="true"
      :format="formatNumber"
      :aspect-ratio="3"
      :initial-width="1152"
      class="-my-px"
      aria-label="Revenue"
    />
  </UCard>
</template>
```

:::
::

The axes are hidden to only show the curve and the grid. The `format` prop formats the amounts in the tooltip. The chart is rendered as an SVG on the server, where its container can't be measured yet, so `initial-width` sets its width until it's mounted and `aspect-ratio` keeps its height in proportion.

::tip{to="/docs/components/chart#size"}
Use the `height` prop instead of `aspect-ratio` for a fixed height.
::

### Listing the latest sales

The last sales are displayed in a [`UTable`](/docs/components/table). The `cell` function of the `status` column renders a [`UBadge`](/docs/components/badge) with `h()`:

::code-tree-intersection
:::code-collapse

```vue [app/components/home/HomeSales.vue]
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Period, Range, Sale } from '~/types'

const props = defineProps<{
  period: Period
  range: Range
}>()

const UBadge = resolveComponent('UBadge')

const sampleEmails = [
  'james.anderson@example.com',
  'mia.white@example.com',
  'william.brown@example.com',
  'emma.davis@example.com',
  'ethan.harris@example.com'
]

const { data } = await useAsyncData('sales', async () => {
  const sales: Sale[] = []
  const currentDate = new Date()

  for (let i = 0; i < 5; i++) {
    const hoursAgo = randomInt(0, 48)
    const date = new Date(currentDate.getTime() - hoursAgo * 3600000)

    sales.push({
      id: (4600 - i).toString(),
      date: date.toISOString(),
      status: randomFrom(['paid', 'failed', 'refunded']),
      email: randomFrom(sampleEmails),
      amount: randomInt(100, 1000)
    })
  }

  return sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}, {
  watch: [() => props.period, () => props.range],
  default: () => []
})

const columns: TableColumn<Sale>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      return new Date(row.getValue('date')).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const color = {
        paid: 'success' as const,
        failed: 'error' as const,
        refunded: 'neutral' as const
      }[row.getValue('status') as string]

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        row.getValue('status')
      )
    }
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, 'Amount'),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'))

      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)

      return h('div', { class: 'text-right font-medium' }, formatted)
    }
  }
]
</script>

<template>
  <UTable
    :data="data"
    :columns="columns"
    class="shrink-0"
    :ui="{
      base: 'table-fixed border-separate border-spacing-0',
      thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
      tbody: '[&>tr]:last:[&>td]:border-b-0',
      th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
      td: 'border-b border-default'
    }"
  />
</template>
```

:::
::

Components rendered with `h()` need `resolveComponent`, since Nuxt only auto-imports the components used in templates. The `ui` prop rounds the header and only keeps the borders between rows.

### Assembling the page

Add the components to the home page. The [`UDashboardToolbar`](/docs/components/dashboard-toolbar) component displays the date range picker and the period select below the navbar:

::code-tree-intersection
:::code-collapse

```vue [app/pages/index.vue] {1-4,6-14,16-21,26,31-35,38-40,42-45,47-50}
<script setup lang="ts">
import { sub } from 'date-fns'
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Period, Range } from '~/types'

const items = [[{
  label: 'New mail',
  icon: 'i-lucide-send',
  to: '/inbox'
}, {
  label: 'New customer',
  icon: 'i-lucide-user-plus',
  to: '/customers'
}]] satisfies DropdownMenuItem[][]

const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})
const period = ref<Period>('daily')
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UDropdownMenu :items="items">
            <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <HomeDateRangePicker v-model="range" class="-ms-1" />

          <HomePeriodSelect v-model="period" :range="range" />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <HomeStats :period="period" :range="range" />
      <HomeChart :period="period" :range="range" />
      <HomeSales :period="period" :range="range" />
    </template>
  </UDashboardPanel>
</template>
```

:::
::

The range is a `shallowRef` since the date range picker always replaces it with a new object. The `+` button in the navbar opens a dropdown menu of links to the other pages.

## Building the customers page

The customers page lists the customers in a [`UTable`](/docs/components/table) with sorting, filtering, pagination and row selection, all handled by [TanStack Table](https://tanstack.com/table/v8).

### Installing the table dependencies

::code-group{sync="pm"}
```bash [pnpm]
pnpm add @tanstack/table-core scule zod
```

```bash [yarn]
yarn add @tanstack/table-core scule zod
```

```bash [npm]
npm install @tanstack/table-core scule zod
```

```bash [bun]
bun add @tanstack/table-core scule zod
```
::

`@tanstack/table-core` provides the pagination row model and the `Row` type, `scule` formats the column names and `zod` validates the form to add a customer.

### Creating the customers API route

Create a server route that returns the customers:

::code-tree-intersection
:::code-collapse

```ts [server/api/customers.ts]
import { defineEventHandler } from 'nuxt/server'
import type { User } from '~/types'

const customers: User[] = [{
  id: 1,
  name: 'Alex Smith',
  email: 'alex.smith@example.com',
  avatar: {
    src: 'https://i.pravatar.cc/128?u=1'
  },
  status: 'subscribed',
  location: 'New York, USA'
}, {
  id: 2,
  name: 'Jordan Brown',
  email: 'jordan.brown@example.com',
  avatar: {
    src: 'https://i.pravatar.cc/128?u=2'
  },
  status: 'unsubscribed',
  location: 'London, UK'
}, {
  id: 3,
  name: 'Taylor Green',
  email: 'taylor.green@example.com',
  avatar: {
    src: 'https://i.pravatar.cc/128?u=3'
  },
  status: 'bounced',
  location: 'Paris, France'
}, {
  id: 4,
  name: 'Morgan White',
  email: 'morgan.white@example.com',
  avatar: {
    src: 'https://i.pravatar.cc/128?u=4'
  },
  status: 'subscribed',
  location: 'Berlin, Germany'
}, {
  id: 5,
  name: 'Casey Gray',
  email: 'casey.gray@example.com',
  avatar: {
    src: 'https://i.pravatar.cc/128?u=5'
  },
  status: 'subscribed',
  location: 'Tokyo, Japan'
}, {
  id: 6,
  name: 'Jamie Johnson',
  email: 'jamie.johnson@example.com',
  avatar: {
    src: 'https://i.pravatar.cc/128?u=6'
  },
  status: 'subscribed',
  location: 'Sydney, Australia'
}, {
  id: 7,
  name: 'Riley Davis',
  email: 'riley.davis@example.com',
  avatar: {
    src: 'https://i.pravatar.cc/128?u=7'
  },
  status: 'subscribed',
  location: 'New York, USA'
}, {
  id: 8,
  name: 'Kelly Wilson',
  email: 'kelly.wilson@example.com',
  avatar: {
    src: 'https://i.pravatar.cc/128?u=8'
  },
  status: 'subscribed',
  location: 'London, UK'
}, {
  id: 9,
  name: 'Drew Moore',
  email: 'drew.moore@example.com',
  avatar: {
    src: 'https://i.pravatar.cc/128?u=9'
  },
  status: 'bounced',
  location: 'Paris, France'
}, {
  id: 10,
  name: 'Jordan Taylor',
  email: 'jordan.taylor@example.com',
  avatar: {
    src: 'https://i.pravatar.cc/128?u=10'
  },
  status: 'subscribed',
  location: 'Berlin, Germany'
}, {
  id: 11,
  name: 'Morgan Anderson',
  email: 'morgan.anderson@example.com',
  avatar: {
    src: 'https://i.pravatar.cc/128?u=11'
  },
  status: 'subscribed',
  location: 'Tokyo, Japan'
}, {
  id: 12,
  name: 'Casey Thomas',
  email: 'casey.thomas@example.com',
  avatar: {
    src: 'https://i.pravatar.cc/128?u=12'
  },
  status: 'unsubscribed',
  location: 'Sydney, Australia'
}]

export default defineEventHandler(async () => {
  return customers
})
```

:::
::

### Creating the modals

Create a [`UModal`](/docs/components/modal) with a [`UForm`](/docs/components/form) to add a customer. The button in the default slot opens the modal:

::code-tree-intersection
:::code-collapse

```vue [app/components/customers/AddModal.vue]
<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  name: z.string().min(2, 'Too short'),
  email: z.email('Invalid email')
})
const open = ref(false)

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: '',
  email: ''
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: `New customer ${event.data.name} added`, color: 'success' })
  open.value = false
}
</script>

<template>
  <UModal v-model:open="open" title="New customer" description="Add a new customer to the database">
    <UButton label="New customer" icon="i-lucide-plus" />

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Name" name="name">
          <UInput v-model="state.name" placeholder="John Doe" class="w-full" />
        </UFormField>
        <UFormField label="Email" name="email">
          <UInput v-model="state.email" placeholder="john.doe@example.com" class="w-full" />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />
          <UButton
            label="Create"
            color="primary"
            variant="solid"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
```

:::
::

The form validates the state against the Zod schema and only calls `onSubmit` when it's valid, with the parsed data in `event.data`.

Then a confirmation modal to delete the selected customers. Its default slot receives the button that opens it:

::code-tree-intersection
```vue [app/components/customers/DeleteModal.vue]
<script setup lang="ts">
withDefaults(defineProps<{
  count?: number
}>(), {
  count: 0
})

const open = ref(false)

async function onSubmit() {
  await new Promise(resolve => setTimeout(resolve, 1000))
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="`Delete ${count} customer${count > 1 ? 's' : ''}`"
    :description="`Are you sure, this action cannot be undone.`"
  >
    <slot />

    <template #body>
      <div class="flex justify-end gap-2">
        <UButton
          label="Cancel"
          color="neutral"
          variant="subtle"
          @click="open = false"
        />
        <UButton
          label="Delete"
          color="error"
          variant="solid"
          loading-auto
          @click="onSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
```
::

With `loading-auto`, the `Delete` button shows a loading icon until the promise returned by `onSubmit` resolves.

### Displaying the customers

Fetch the customers, define the columns of the table and add the filters, the pagination and the modals around it:

::code-tree-intersection
:::code-collapse

```vue [app/pages/customers.vue]
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { upperFirst } from 'scule'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { Row } from '@tanstack/table-core'
import type { User } from '~/types'

const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')

const toast = useToast()
const table = useTemplateRef('table')

const columnFilters = ref([{
  id: 'email',
  value: ''
}])
const columnVisibility = ref()
const rowSelection = ref({})

const { data, status } = await useFetch<User[]>('/api/customers', {
  lazy: true
})

function getRowItems(row: Row<User>) {
  return [
    {
      type: 'label',
      label: 'Actions'
    },
    {
      label: 'Copy customer ID',
      icon: 'i-lucide-copy',
      onSelect() {
        navigator.clipboard.writeText(row.original.id.toString())
        toast.add({
          title: 'Copied to clipboard',
          description: 'Customer ID copied to clipboard'
        })
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'View customer details',
      icon: 'i-lucide-list'
    },
    {
      label: 'View customer payments',
      icon: 'i-lucide-wallet'
    },
    {
      type: 'separator'
    },
    {
      label: 'Delete customer',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect() {
        toast.add({
          title: 'Customer deleted',
          description: 'The customer has been deleted.'
        })
      }
    }
  ]
}

const columns: TableColumn<User>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'ariaLabel': 'Select all'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'ariaLabel': 'Select row'
      })
  },
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          ...row.original.avatar,
          size: 'lg'
        }),
        h('div', undefined, [
          h('p', { class: 'font-medium text-highlighted' }, row.original.name),
          h('p', undefined, `@${row.original.name}`)
        ])
      ])
    }
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Email',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    }
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => row.original.location
  },
  {
    accessorKey: 'status',
    header: 'Status',
    filterFn: 'equals',
    cell: ({ row }) => {
      const color = {
        subscribed: 'success' as const,
        unsubscribed: 'error' as const,
        bounced: 'warning' as const
      }[row.original.status]

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        row.original.status
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: getRowItems(row)
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto'
            })
        )
      )
    }
  }
]

const statusFilter = ref('all')

watch(() => statusFilter.value, (newVal) => {
  if (!table?.value?.tableApi) return

  const statusColumn = table.value.tableApi.getColumn('status')
  if (!statusColumn) return

  if (newVal === 'all') {
    statusColumn.setFilterValue(undefined)
  } else {
    statusColumn.setFilterValue(newVal)
  }
})

const email = computed({
  get: (): string => {
    return (table.value?.tableApi?.getColumn('email')?.getFilterValue() as string) || ''
  },
  set: (value: string) => {
    table.value?.tableApi?.getColumn('email')?.setFilterValue(value || undefined)
  }
})

const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})
</script>

<template>
  <UDashboardPanel id="customers">
    <template #header>
      <UDashboardNavbar title="Customers">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <CustomersAddModal />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <UInput
          v-model="email"
          class="max-w-sm"
          icon="i-lucide-search"
          placeholder="Filter emails..."
        />

        <div class="flex flex-wrap items-center gap-1.5">
          <CustomersDeleteModal :count="table?.tableApi?.getFilteredSelectedRowModel().rows.length">
            <UButton
              v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length"
              label="Delete"
              color="error"
              variant="subtle"
              icon="i-lucide-trash"
            >
              <template #trailing>
                <UKbd>
                  {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length }}
                </UKbd>
              </template>
            </UButton>
          </CustomersDeleteModal>

          <USelect
            v-model="statusFilter"
            :items="[
              { label: 'All', value: 'all' },
              { label: 'Subscribed', value: 'subscribed' },
              { label: 'Unsubscribed', value: 'unsubscribed' },
              { label: 'Bounced', value: 'bounced' }
            ]"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            placeholder="Filter status"
            class="min-w-28"
          />
          <UDropdownMenu
            :items="
              table?.tableApi
                ?.getAllColumns()
                .filter((column: any) => column.getCanHide())
                .map((column: any) => ({
                  label: upperFirst(column.id),
                  type: 'checkbox' as const,
                  checked: column.getIsVisible(),
                  onUpdateChecked(checked: boolean) {
                    table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                  },
                  onSelect(e?: Event) {
                    e?.preventDefault()
                  }
                }))
            "
            :content="{ align: 'end' }"
          >
            <UButton
              label="Display"
              color="neutral"
              variant="outline"
              trailing-icon="i-lucide-settings-2"
            />
          </UDropdownMenu>
        </div>
      </div>

      <UTable
        ref="table"
        v-model:column-filters="columnFilters"
        v-model:column-visibility="columnVisibility"
        v-model:row-selection="rowSelection"
        v-model:pagination="pagination"
        :pagination-options="{
          getPaginationRowModel: getPaginationRowModel()
        }"
        class="shrink-0"
        :data="data"
        :columns="columns"
        :loading="status === 'pending'"
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
          td: 'border-b border-default',
          separator: 'h-0'
        }"
      />

      <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
        <div class="text-sm text-muted">
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
        </div>

        <div class="flex items-center gap-1.5">
          <UPagination
            :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
```

:::
::

Here's what each column does:

**The `select` column**

The [`UCheckbox`](/docs/components/checkbox) components select a row or all the rows of the page. The selection is bound to `rowSelection` with `v-model:row-selection`.

**The `email` column**

Its header is a button that toggles the sorting of the column, with an icon for each direction.

**The `status` column**

The `equals` filter function only keeps the rows with the exact status picked in the status filter.

**The `actions` column**

Each row gets a dropdown menu of actions, built by the `getRowItems` function. Copying the ID writes to the clipboard and shows a toast with [`useToast`](/docs/composables/use-toast).

The table exposes the TanStack Table instance as `tableApi`, read from the `table` template ref. The controls around the table use it:

**The filters**

The email input is bound to a computed that reads and writes the filter value of the `email` column. The status select sets the filter of the `status` column, or removes it for `All`.

**The column visibility**

The `Display` dropdown menu lists the columns that can be hidden as checkboxes. Calling `e.preventDefault()` keeps it open while you toggle them.

**The pagination**

Client side pagination needs the `getPaginationRowModel()` function in `pagination-options`. The [`UPagination`](/docs/components/pagination) component below the table changes the page through `tableApi`, which also gives the number of selected and filtered rows.

**The modals**

The add modal sits in the navbar. The delete modal wraps a `Delete` button that only shows up when some rows are selected, with their count in a [`UKbd`](/docs/components/kbd).

With `lazy: true`, `useFetch` doesn't block the navigation, and the table shows a loading state with the `loading` prop until the data arrives.

::note{to="/docs/components/table#with-row-actions"}
The Table documentation has an example for each of these features, like row actions, row selection, column sorting and pagination.
::

## Building the inbox

The inbox displays two panels side by side: a resizable list of mails, and the selected mail next to it. On mobile, the mail opens in a slideover instead.

### Installing VueUse

[VueUse](https://vueuse.org) provides the breakpoints of the inbox, and a few utilities used in the next section:

::code-group{sync="pm"}
```bash [pnpm]
pnpm add @vueuse/core @vueuse/nuxt
```

```bash [yarn]
yarn add @vueuse/core @vueuse/nuxt
```

```bash [npm]
npm install @vueuse/core @vueuse/nuxt
```

```bash [bun]
bun add @vueuse/core @vueuse/nuxt
```
::

Register its module to auto-import its composables:

::code-tree-intersection
```ts [nuxt.config.ts] {2-5}
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt'
  ],

  css: ['~/assets/css/main.css']
})
```
::

### Creating the mails API route

Create a server route that returns the mails:

::code-tree-intersection
:::code-collapse

```ts [server/api/mails.ts]
import { defineEventHandler } from 'nuxt/server'
import { sub } from 'date-fns'

const mails = [{
  id: 1,
  from: {
    name: 'Alex Smith',
    email: 'alex.smith@example.com',
    avatar: {
      src: 'https://i.pravatar.cc/128?u=1'
    }
  },
  subject: 'Meeting Schedule: Q1 Marketing Strategy Review',
  body: `Dear Team,

I hope this email finds you well. Just a quick reminder about our Q1 Marketing Strategy meeting scheduled for tomorrow at 10 AM EST in Conference Room A.

Agenda:
- Q4 Performance Review
- New Campaign Proposals
- Budget Allocation for Q2
- Team Resource Planning

Please come prepared with your department updates. I've attached the preliminary deck for your review.

Best regards,
Alex Smith
Senior Marketing Director
Tel: (555) 123-4567`,
  date: new Date().toISOString()
}, {
  id: 2,
  unread: true,
  from: {
    name: 'Jordan Brown',
    email: 'jordan.brown@example.com',
    avatar: {
      src: 'https://i.pravatar.cc/128?u=2'
    }
  },
  subject: 'RE: Project Phoenix - Sprint 3 Update',
  body: `Hi team,

Quick update on Sprint 3 deliverables:

✅ User authentication module completed
🏗️ Payment integration at 80%
⏳ API documentation pending review

Key metrics:
- Code coverage: 94%
- Sprint velocity: 45 points
- Bug resolution rate: 98%

Please review the attached report for detailed analysis. Let's discuss any blockers in tomorrow's stand-up.

Regards,
Jordan

--
Jordan Brown
Lead Developer | Tech Solutions
Mobile: +1 (555) 234-5678`,
  date: sub(new Date(), { minutes: 7 }).toISOString()
}, {
  id: 3,
  unread: true,
  from: {
    name: 'Taylor Green',
    email: 'taylor.green@example.com',
    avatar: {
      src: 'https://i.pravatar.cc/128?u=3'
    }
  },
  subject: 'Lunch Plans',
  body: `Hi there!

I was wondering if you'd like to grab lunch this Friday? There's this amazing new Mexican restaurant downtown called "La Casa" that I've been wanting to try. They're known for their authentic tacos and house-made guacamole.

Would 12:30 PM work for you? It would be great to catch up and discuss the upcoming team building event while we're there.

Let me know what you think!

Best,
Taylor`,
  date: sub(new Date(), { hours: 3 }).toISOString()
}, {
  id: 4,
  from: {
    name: 'Morgan White',
    email: 'morgan.white@example.com',
    avatar: {
      src: 'https://i.pravatar.cc/128?u=4'
    }
  },
  subject: 'New Proposal: Project Horizon',
  body: `Hi team,

I've just uploaded the comprehensive proposal for Project Horizon to our shared drive. The document includes:

• Detailed project objectives and success metrics
• Resource allocation and team structure
• Timeline with key milestones
• Budget breakdown
• Risk assessment and mitigation strategies

I'm particularly excited about our innovative approach to the user engagement component, which could set a new standard for our industry.

Could you please review and provide feedback by EOD Friday? I'd like to present this to the steering committee next week.

Thanks in advance,

Morgan White
Senior Project Manager
Tel: (555) 234-5678`,
  date: sub(new Date(), { days: 1 }).toISOString()
}]

export default defineEventHandler(async () => {
  return mails
})
```

:::
::

### Listing the mails

The list highlights the selected mail and makes the unread ones bold:

::code-tree-intersection
:::code-collapse

```vue [app/components/inbox/InboxList.vue]
<script setup lang="ts">
import { format, isToday } from 'date-fns'
import type { Mail } from '~/types'

const props = defineProps<{
  mails: Mail[]
}>()

const mailsRefs = ref<Record<number, Element | null>>({})

const selectedMail = defineModel<Mail | null>()

watch(selectedMail, () => {
  if (!selectedMail.value) {
    return
  }
  const ref = mailsRefs.value[selectedMail.value.id]
  if (ref) {
    ref.scrollIntoView({ block: 'nearest' })
  }
})

defineShortcuts({
  arrowdown: () => {
    const index = props.mails.findIndex((mail: Mail) => mail.id === selectedMail.value?.id)

    if (index === -1) {
      selectedMail.value = props.mails[0]
    } else if (index < props.mails.length - 1) {
      selectedMail.value = props.mails[index + 1]
    }
  },
  arrowup: () => {
    const index = props.mails.findIndex((mail: Mail) => mail.id === selectedMail.value?.id)

    if (index === -1) {
      selectedMail.value = props.mails[props.mails.length - 1]
    } else if (index > 0) {
      selectedMail.value = props.mails[index - 1]
    }
  }
})
</script>

<template>
  <div class="overflow-y-auto divide-y divide-default">
    <div
      v-for="(mail, index) in mails"
      :key="index"
      :ref="(el) => { mailsRefs[mail.id] = el as Element | null }"
    >
      <div
        class="p-4 sm:px-6 text-sm cursor-pointer border-l-2 transition-colors"
        :class="[
          mail.unread ? 'text-highlighted' : 'text-toned',
          selectedMail && selectedMail.id === mail.id
            ? 'border-primary bg-primary/10'
            : 'border-bg hover:border-primary hover:bg-primary/5'
        ]"
        @click="selectedMail = mail"
      >
        <div class="flex items-center justify-between" :class="[mail.unread && 'font-semibold']">
          <div class="flex items-center gap-3">
            {{ mail.from.name }}

            <UChip v-if="mail.unread" />
          </div>

          <span>{{ isToday(new Date(mail.date)) ? format(new Date(mail.date), 'HH:mm') : format(new Date(mail.date), 'dd MMM') }}</span>
        </div>
        <p class="truncate" :class="[mail.unread && 'font-semibold']">
          {{ mail.subject }}
        </p>
        <p class="text-dimmed line-clamp-1">
          {{ mail.body }}
        </p>
      </div>
    </div>
  </div>
</template>
```

:::
::

With [`defineShortcuts`](/docs/composables/define-shortcuts), the :kbd{value="arrowup"} and :kbd{value="arrowdown"} keys select the previous or next mail, which is scrolled into view.

### Displaying a mail

The selected mail renders in its own `UDashboardPanel`, with a reply form at the bottom:

::code-tree-intersection
:::code-collapse

```vue [app/components/inbox/InboxMail.vue]
<script setup lang="ts">
import { format } from 'date-fns'
import type { Mail } from '~/types'

defineProps<{
  mail: Mail
}>()

const emits = defineEmits(['close'])

const dropdownItems = [[{
  label: 'Mark as unread',
  icon: 'i-lucide-check-circle'
}, {
  label: 'Mark as important',
  icon: 'i-lucide-triangle-alert'
}], [{
  label: 'Star thread',
  icon: 'i-lucide-star'
}, {
  label: 'Mute thread',
  icon: 'i-lucide-circle-pause'
}]]

const toast = useToast()

const reply = ref('')
const loading = ref(false)

function onSubmit() {
  loading.value = true

  setTimeout(() => {
    reply.value = ''

    toast.add({
      title: 'Email sent',
      description: 'Your email has been sent successfully',
      icon: 'i-lucide-check-circle',
      color: 'success'
    })

    loading.value = false
  }, 1000)
}
</script>

<template>
  <UDashboardPanel id="inbox-2">
    <UDashboardNavbar :title="mail.subject" :toggle="false">
      <template #leading>
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          class="-ms-1.5"
          @click="emits('close')"
        />
      </template>

      <template #right>
        <UTooltip text="Archive">
          <UButton
            icon="i-lucide-inbox"
            color="neutral"
            variant="ghost"
          />
        </UTooltip>

        <UTooltip text="Reply">
          <UButton icon="i-lucide-reply" color="neutral" variant="ghost" />
        </UTooltip>

        <UDropdownMenu :items="dropdownItems">
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
          />
        </UDropdownMenu>
      </template>
    </UDashboardNavbar>

    <div class="flex flex-col sm:flex-row justify-between gap-1 p-4 sm:px-6 border-b border-default">
      <div class="flex items-start gap-4 sm:my-1.5">
        <UAvatar
          v-bind="mail.from.avatar"
          :alt="mail.from.name"
          size="3xl"
        />

        <div class="min-w-0">
          <p class="font-semibold text-highlighted">
            {{ mail.from.name }}
          </p>
          <p class="text-muted">
            {{ mail.from.email }}
          </p>
        </div>
      </div>

      <p class="max-sm:pl-16 text-muted text-sm sm:mt-2">
        {{ format(new Date(mail.date), 'dd MMM HH:mm') }}
      </p>
    </div>

    <div class="flex-1 p-4 sm:p-6 overflow-y-auto">
      <p class="whitespace-pre-wrap">
        {{ mail.body }}
      </p>
    </div>

    <div class="pb-4 px-4 sm:px-6 shrink-0">
      <UCard variant="subtle" class="mt-auto" :ui="{ header: 'flex items-center gap-1.5 text-dimmed' }">
        <template #header>
          <UIcon name="i-lucide-reply" class="size-5" />

          <span class="text-sm truncate">
            Reply to {{ mail.from.name }} ({{ mail.from.email }})
          </span>
        </template>

        <form @submit.prevent="onSubmit">
          <UTextarea
            v-model="reply"
            color="neutral"
            variant="none"
            required
            autoresize
            placeholder="Write your reply..."
            :rows="4"
            :disabled="loading"
            class="w-full"
            :ui="{ base: 'p-0 resize-none' }"
          />

          <div class="flex items-center justify-between">
            <UTooltip text="Attach file">
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-paperclip"
              />
            </UTooltip>

            <div class="flex items-center justify-end gap-2">
              <UButton
                color="neutral"
                variant="ghost"
                label="Save draft"
              />
              <UButton
                type="submit"
                color="neutral"
                :loading="loading"
                label="Send"
                icon="i-lucide-send"
              />
            </div>
          </div>
        </form>
      </UCard>
    </div>
  </UDashboardPanel>
</template>
```

:::
::

This panel uses the default slot instead of `header` and `body`, so it lays out its content itself. Setting `toggle` to `false` on the navbar removes the button that opens the sidebar on mobile, since the close button takes its place.

### Creating the inbox page

Put both panels side by side in the inbox page:

::code-tree-intersection
:::code-collapse

```vue [app/pages/inbox.vue]
<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'
import type { Mail } from '~/types'

const tabItems = [{
  label: 'All',
  value: 'all'
}, {
  label: 'Unread',
  value: 'unread'
}]
const selectedTab = ref('all')

const { data: mails } = await useFetch<Mail[]>('/api/mails', { default: () => [] })

// Filter mails based on the selected tab
const filteredMails = computed(() => {
  if (selectedTab.value === 'unread') {
    return mails.value.filter(mail => !!mail.unread)
  }

  return mails.value
})

const selectedMail = ref<Mail | null>()

const isMailPanelOpen = computed({
  get() {
    return !!selectedMail.value
  },
  set(value: boolean) {
    if (!value) {
      selectedMail.value = null
    }
  }
})

// Reset selected mail if it's not in the filtered mails
watch(filteredMails, () => {
  if (!filteredMails.value.find(mail => mail.id === selectedMail.value?.id)) {
    selectedMail.value = null
  }
})

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('lg')
</script>

<template>
  <UDashboardPanel
    id="inbox-1"
    :default-size="25"
    :min-size="20"
    :max-size="30"
    resizable
  >
    <UDashboardNavbar title="Inbox">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
      <template #trailing>
        <UBadge :label="filteredMails.length" variant="subtle" />
      </template>

      <template #right>
        <UTabs
          v-model="selectedTab"
          :items="tabItems"
          :content="false"
          size="xs"
        />
      </template>
    </UDashboardNavbar>
    <InboxList v-model="selectedMail" :mails="filteredMails" />
  </UDashboardPanel>

  <InboxMail v-if="selectedMail" :mail="selectedMail" @close="selectedMail = null" />
  <div v-else class="hidden lg:flex flex-1 items-center justify-center">
    <UIcon name="i-lucide-inbox" class="size-32 text-dimmed" />
  </div>

  <ClientOnly>
    <USlideover v-if="isMobile" v-model:open="isMailPanelOpen">
      <template #content>
        <InboxMail v-if="selectedMail" :mail="selectedMail" @close="selectedMail = null" />
      </template>
    </USlideover>
  </ClientOnly>
</template>
```

:::
::

Here's how the page works:

**The resizable panel**

The first panel is [`resizable`](/docs/components/dashboard-panel#resizable) between its `min-size` and `max-size`, in the `rem` unit of the group. The second one takes the remaining space, or shows an inbox icon when no mail is selected.

**The tabs**

The [`UTabs`](/docs/components/tabs) component in the navbar switches between all the mails and the unread ones. With `:content="false"`, it only renders the tabs.

**On mobile**

Below the `lg` breakpoint, the mail opens in a [`USlideover`](/docs/components/slideover) instead. Closing it through `isMailPanelOpen` clears the selection. The slideover is wrapped in `ClientOnly` since the breakpoints aren't known on the server.

## Adding notifications and shortcuts

The notifications open in a slideover from a bell button on the home page, or with the :kbd{value="n"} key. A few more shortcuts navigate between the pages.

### Creating the notifications API route

Create a server route that returns the notifications:

::code-tree-intersection
:::code-collapse

```ts [server/api/notifications.ts]
import { defineEventHandler } from 'nuxt/server'
import { sub } from 'date-fns'

const notifications = [{
  id: 1,
  unread: true,
  sender: {
    name: 'Jordan Brown',
    email: 'jordan.brown@example.com',
    avatar: {
      src: 'https://i.pravatar.cc/128?u=2'
    }
  },
  body: 'sent you a message',
  date: sub(new Date(), { minutes: 7 }).toISOString()
}, {
  id: 2,
  sender: {
    name: 'Lindsay Walton'
  },
  body: 'subscribed to your email list',
  date: sub(new Date(), { hours: 1 }).toISOString()
}, {
  id: 3,
  unread: true,
  sender: {
    name: 'Taylor Green',
    email: 'taylor.green@example.com',
    avatar: {
      src: 'https://i.pravatar.cc/128?u=3'
    }
  },
  body: 'sent you a message',
  date: sub(new Date(), { hours: 3 }).toISOString()
}, {
  id: 4,
  sender: {
    name: 'Courtney Henry',
    avatar: {
      src: 'https://i.pravatar.cc/128?u=4'
    }
  },
  body: 'added you to a project',
  date: sub(new Date(), { hours: 3 }).toISOString()
}, {
  id: 5,
  sender: {
    name: 'Tom Cook',
    avatar: {
      src: 'https://i.pravatar.cc/128?u=5'
    }
  },
  body: 'abandoned cart',
  date: sub(new Date(), { hours: 7 }).toISOString()
}, {
  id: 6,
  sender: {
    name: 'Casey Thomas',
    avatar: {
      src: 'https://i.pravatar.cc/128?u=6'
    }
  },
  body: 'purchased your product',
  date: sub(new Date(), { days: 1, hours: 3 }).toISOString()
}, {
  id: 7,
  unread: true,
  sender: {
    name: 'Kelly Wilson',
    email: 'kelly.wilson@example.com',
    avatar: {
      src: 'https://i.pravatar.cc/128?u=8'
    }
  },
  body: 'sent you a message',
  date: sub(new Date(), { days: 2 }).toISOString()
}, {
  id: 8,
  sender: {
    name: 'Jamie Johnson',
    email: 'jamie.johnson@example.com',
    avatar: {
      src: 'https://i.pravatar.cc/128?u=9'
    }
  },
  body: 'requested a refund',
  date: sub(new Date(), { days: 5, hours: 4 }).toISOString()
}]

export default defineEventHandler(async () => {
  return notifications
})
```

:::
::

### Sharing the state

The open state of the slideover is needed by the slideover itself and by the button that opens it. Keep it in a composable shared with `createSharedComposable`, which also registers the shortcuts once for the whole app:

::code-tree-intersection
```ts [app/composables/useDashboard.ts]
import { createSharedComposable } from '@vueuse/core'

const _useDashboard = () => {
  const route = useRoute()
  const router = useRouter()
  const isNotificationsSlideoverOpen = ref(false)

  defineShortcuts({
    'g-h': () => router.push('/'),
    'g-i': () => router.push('/inbox'),
    'g-c': () => router.push('/customers'),
    'g-s': () => router.push('/settings'),
    'n': () => isNotificationsSlideoverOpen.value = !isNotificationsSlideoverOpen.value
  })

  watch(() => route.fullPath, () => {
    isNotificationsSlideoverOpen.value = false
  })

  return {
    isNotificationsSlideoverOpen
  }
}

export const useDashboard = createSharedComposable(_useDashboard)
```
::

The `g-h` syntax defines a sequence: press :kbd{value="g"} then :kbd{value="h"} to go home. In the same way, :kbd{value="g"} followed by :kbd{value="i"}, :kbd{value="c"} or :kbd{value="s"} opens the inbox, the customers or the settings. The slideover closes when the route changes.

### Displaying the notifications

Create the slideover, with a [`UChip`](/docs/components/chip) on the avatar of each unread notification:

::code-tree-intersection
:::code-collapse

```vue [app/components/NotificationsSlideover.vue]
<script setup lang="ts">
import { formatTimeAgo } from '@vueuse/core'
import type { Notification } from '~/types'

const { isNotificationsSlideoverOpen } = useDashboard()

const { data: notifications } = await useFetch<Notification[]>('/api/notifications')
</script>

<template>
  <USlideover
    v-model:open="isNotificationsSlideoverOpen"
    title="Notifications"
  >
    <template #body>
      <NuxtLink
        v-for="notification in notifications"
        :key="notification.id"
        to="/inbox"
        @click="isNotificationsSlideoverOpen = false"
        class="px-3 py-2.5 rounded-md hover:bg-elevated/50 flex items-center gap-3 relative -mx-3 first:-mt-3 last:-mb-3"
      >
        <UChip
          color="error"
          :show="!!notification.unread"
          inset
        >
          <UAvatar
            v-bind="notification.sender.avatar"
            :alt="notification.sender.name"
            size="md"
          />
        </UChip>

        <div class="text-sm flex-1">
          <p class="flex items-center justify-between">
            <span class="text-highlighted font-medium">{{ notification.sender.name }}</span>

            <time
              :datetime="notification.date"
              class="text-muted text-xs"
              v-text="formatTimeAgo(new Date(notification.date))"
            />
          </p>

          <p class="text-dimmed">
            {{ notification.body }}
          </p>
        </div>
      </NuxtLink>
    </template>
  </USlideover>
</template>
```

:::
::

Add it at the end of the `UDashboardGroup` in `app/layouts/default.vue`, so it's available on every page:

```vue
    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
```

Then add the bell button to the navbar of the home page. The `kbds` prop of [`UTooltip`](/docs/components/tooltip) displays the key next to its text:

::code-tree-intersection
:::code-collapse

```vue [app/pages/index.vue] {6,34-45}
<script setup lang="ts">
import { sub } from 'date-fns'
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Period, Range } from '~/types'

const { isNotificationsSlideoverOpen } = useDashboard()

const items = [[{
  label: 'New mail',
  icon: 'i-lucide-send',
  to: '/inbox'
}, {
  label: 'New customer',
  icon: 'i-lucide-user-plus',
  to: '/customers'
}]] satisfies DropdownMenuItem[][]

const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})
const period = ref<Period>('daily')
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UTooltip text="Notifications" :kbds="['n']">
            <UButton
              color="neutral"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip color="error" inset>
                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>

          <UDropdownMenu :items="items">
            <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <HomeDateRangePicker v-model="range" class="-ms-1" />

          <HomePeriodSelect v-model="period" :range="range" />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <HomeStats :period="period" :range="range" />
      <HomeChart :period="period" :range="range" />
      <HomeSales :period="period" :range="range" />
    </template>
  </UDashboardPanel>
</template>
```

:::
::

## Building the settings pages

The settings are split into four pages, displayed in a single panel with a horizontal navigation in its toolbar.

### Creating the settings layout

A `settings.vue` page next to a `settings` directory becomes the parent of the pages in that directory, which render in its `NuxtPage`:

::code-tree-intersection
```vue [app/pages/settings.vue]
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const links = [[{
  label: 'General',
  icon: 'i-lucide-user',
  to: '/settings',
  exact: true
}, {
  label: 'Members',
  icon: 'i-lucide-users',
  to: '/settings/members'
}, {
  label: 'Notifications',
  icon: 'i-lucide-bell',
  to: '/settings/notifications'
}, {
  label: 'Security',
  icon: 'i-lucide-shield',
  to: '/settings/security'
}], [{
  label: 'Documentation',
  icon: 'i-lucide-book-open',
  to: 'https://ui.nuxt.com/docs/getting-started/installation/nuxt',
  target: '_blank'
}]] satisfies NavigationMenuItem[][]
</script>

<template>
  <UDashboardPanel id="settings" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar title="Settings">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UNavigationMenu :items="links" highlight class="-mx-1 flex-1" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
        <NuxtPage />
      </div>
    </template>
  </UDashboardPanel>
</template>
```
::

The [`UNavigationMenu`](/docs/components/navigation-menu) is horizontal by default, and `highlight` underlines the active link. The `exact` option keeps `General` from being active on the other settings pages.

### Editing the profile

The general settings page is a profile form. Each [`UFormField`](/docs/components/form-field) is laid out as a row, with its label and description next to the input:

::code-tree-intersection
:::code-collapse

```vue [app/pages/settings/index.vue]
<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const fileRef = ref<HTMLInputElement>()

const profileSchema = z.object({
  name: z.string().min(2, 'Too short'),
  email: z.email('Invalid email'),
  username: z.string().min(2, 'Too short'),
  avatar: z.string().optional(),
  bio: z.string().optional()
})

type ProfileSchema = z.output<typeof profileSchema>

const profile = reactive<Partial<ProfileSchema>>({
  name: 'Benjamin Canac',
  email: 'ben@nuxtlabs.com',
  username: 'benjamincanac',
  avatar: undefined,
  bio: undefined
})
const toast = useToast()
async function onSubmit(event: FormSubmitEvent<ProfileSchema>) {
  toast.add({
    title: 'Success',
    description: 'Your settings have been updated.',
    icon: 'i-lucide-check',
    color: 'success'
  })
  console.log(event.data)
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement

  if (!input.files?.length) {
    return
  }

  profile.avatar = URL.createObjectURL(input.files[0]!)
}

function onFileClick() {
  fileRef.value?.click()
}
</script>

<template>
  <UForm
    id="settings"
    :schema="profileSchema"
    :state="profile"
    @submit="onSubmit"
  >
    <UPageCard
      title="Profile"
      description="This information will be displayed publicly."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        form="settings"
        label="Save changes"
        color="neutral"
        type="submit"
        class="w-fit lg:ms-auto"
      />
    </UPageCard>

    <UPageCard variant="subtle">
      <UFormField
        name="name"
        label="Name"
        description="Will appear on receipts, invoices, and other communication."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="profile.name"
          autocomplete="off"
        />
      </UFormField>
      <USeparator />
      <UFormField
        name="email"
        label="Email"
        description="Used to sign in, for email receipts and product updates."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="profile.email"
          type="email"
          autocomplete="off"
        />
      </UFormField>
      <USeparator />
      <UFormField
        name="username"
        label="Username"
        description="Your unique username for logging in and your profile URL."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="profile.username"
          autocomplete="off"
        />
      </UFormField>
      <USeparator />
      <UFormField
        name="avatar"
        label="Avatar"
        description="JPG, GIF or PNG. 1MB Max."
        class="flex max-sm:flex-col justify-between sm:items-center gap-4"
      >
        <div class="flex flex-wrap items-center gap-3">
          <UAvatar
            :src="profile.avatar"
            :alt="profile.name"
            size="lg"
          />
          <UButton
            label="Choose"
            color="neutral"
            @click="onFileClick"
          />
          <input
            ref="fileRef"
            type="file"
            class="hidden"
            accept=".jpg, .jpeg, .png, .gif"
            @change="onFileChange"
          >
        </div>
      </UFormField>
      <USeparator />
      <UFormField
        name="bio"
        label="Bio"
        description="Brief description for your profile. URLs are hyperlinked."
        class="flex max-sm:flex-col justify-between items-start gap-4"
        :ui="{ container: 'w-full' }"
      >
        <UTextarea
          v-model="profile.bio"
          :rows="5"
          autoresize
          class="w-full"
        />
      </UFormField>
    </UPageCard>
  </UForm>
</template>
```

:::
::

The [`UPageCard`](/docs/components/page-card) with `variant="naked"` and `orientation="horizontal"` serves as a section header, with the save button on the right. The avatar uses a hidden file input, and `URL.createObjectURL` previews the picked image.

### Listing the members

Create a server route that returns the members:

::code-tree-intersection
:::code-collapse

```ts [server/api/members.ts]
import { defineEventHandler } from 'nuxt/server'

const members = [{
  name: 'Anthony Fu',
  username: 'antfu',
  role: 'member',
  avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/antfu' }
}, {
  name: 'Baptiste Leproux',
  username: 'larbish',
  role: 'member',
  avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/larbish' }
}, {
  name: 'Benjamin Canac',
  username: 'benjamincanac',
  role: 'owner',
  avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/benjamincanac' }
}, {
  name: 'Céline Dumerc',
  username: 'celinedumerc',
  role: 'member',
  avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/celinedumerc' }
}, {
  name: 'Daniel Roe',
  username: 'danielroe',
  role: 'member',
  avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/danielroe' }
}, {
  name: 'Farnabaz',
  username: 'farnabaz',
  role: 'member',
  avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/farnabaz' }
}, {
  name: 'Ferdinand Coumau',
  username: 'FerdinandCoumau',
  role: 'member',
  avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/FerdinandCoumau' }
}, {
  name: 'Hugo Richard',
  username: 'hugorcd',
  role: 'owner',
  avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/hugorcd' }
}, {
  name: 'Pooya Parsa',
  username: 'pi0',
  role: 'member',
  avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/pi0' }
}, {
  name: 'Sarah Moriceau',
  username: 'SarahM19',
  role: 'member',
  avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/SarahM19' }
}, {
  name: 'Sébastien Chopin',
  username: 'Atinux',
  role: 'owner',
  avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/atinux' }
}]

export default defineEventHandler(async () => {
  return members
})
```

:::
::

Each member is displayed with a [`USelect`](/docs/components/select) for their role and a dropdown menu of actions:

::code-tree-intersection
:::code-collapse

```vue [app/components/settings/MembersList.vue]
<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Member } from '~/types'

defineProps<{
  members: Member[]
}>()

const items = [{
  label: 'Edit member',
  onSelect: () => console.log('Edit member')
}, {
  label: 'Remove member',
  color: 'error' as const,
  onSelect: () => console.log('Remove member')
}] satisfies DropdownMenuItem[]
</script>

<template>
  <ul role="list" class="divide-y divide-default">
    <li
      v-for="(member, index) in members"
      :key="index"
      class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6"
    >
      <div class="flex items-center gap-3 min-w-0">
        <UAvatar
          v-bind="member.avatar"
          size="md"
        />

        <div class="text-sm min-w-0">
          <p class="text-highlighted font-medium truncate">
            {{ member.name }}
          </p>
          <p class="text-muted truncate">
            {{ member.username }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <USelect
          :model-value="member.role"
          :items="['member', 'owner']"
          color="neutral"
          :ui="{ value: 'capitalize', item: 'capitalize' }"
        />

        <UDropdownMenu :items="items" :content="{ align: 'end' }">
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
          />
        </UDropdownMenu>
      </div>
    </li>
  </ul>
</template>
```

:::
::

The members page filters the list with a search input in the header of the card:

::code-tree-intersection
```vue [app/pages/settings/members.vue]
<script setup lang="ts">
import type { Member } from '~/types'

const { data: members } = await useFetch<Member[]>('/api/members', { default: () => [] })

const q = ref('')

const filteredMembers = computed(() => {
  const search = q.value.toLowerCase()

  return members.value.filter(member => member.name.toLowerCase().includes(search) || member.username.toLowerCase().includes(search))
})
</script>

<template>
  <div>
    <UPageCard
      title="Members"
      description="Invite new members by email address."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        label="Invite people"
        color="neutral"
        class="w-fit lg:ms-auto"
      />
    </UPageCard>

    <UPageCard variant="subtle" :ui="{ container: 'p-0 sm:p-0 gap-y-0', wrapper: 'items-stretch', header: 'p-4 mb-0 border-b border-default' }">
      <template #header>
        <UInput
          v-model="q"
          icon="i-lucide-search"
          placeholder="Search members"
          autofocus
          class="w-full"
        />
      </template>

      <SettingsMembersList :members="filteredMembers" />
    </UPageCard>
  </div>
</template>
```
::

### Setting the notification preferences

The notifications page renders a [`USwitch`](/docs/components/switch) for each preference, grouped in sections:

::code-tree-intersection
:::code-collapse

```vue [app/pages/settings/notifications.vue]
<script setup lang="ts">
const state = reactive<{ [key: string]: boolean }>({
  email: true,
  desktop: false,
  product_updates: true,
  weekly_digest: false,
  important_updates: true
})

const sections = [{
  title: 'Notification channels',
  description: 'Where can we notify you?',
  fields: [{
    name: 'email',
    label: 'Email',
    description: 'Receive a daily email digest.'
  }, {
    name: 'desktop',
    label: 'Desktop',
    description: 'Receive desktop notifications.'
  }]
}, {
  title: 'Account updates',
  description: 'Receive updates about Nuxt UI.',
  fields: [{
    name: 'weekly_digest',
    label: 'Weekly digest',
    description: 'Receive a weekly digest of news.'
  }, {
    name: 'product_updates',
    label: 'Product updates',
    description: 'Receive a monthly email with all new features and updates.'
  }, {
    name: 'important_updates',
    label: 'Important updates',
    description: 'Receive emails about important updates like security fixes, maintenance, etc.'
  }]
}]

async function onChange() {
  // Do something with data
  console.log(state)
}
</script>

<template>
  <div v-for="(section, index) in sections" :key="index">
    <UPageCard
      :title="section.title"
      :description="section.description"
      variant="naked"
      class="mb-4"
    />

    <UPageCard variant="subtle" :ui="{ container: 'divide-y divide-default' }">
      <UFormField
        v-for="field in section.fields"
        :key="field.name"
        :name="field.name"
        :label="field.label"
        :description="field.description"
        class="flex items-center justify-between not-last:pb-4 gap-2"
      >
        <USwitch
          v-model="state[field.name]"
          @update:model-value="onChange"
        />
      </UFormField>
    </UPageCard>
  </div>
</template>
```

:::
::

### Changing the password

The security page validates the new password with both a Zod schema and the `validate` prop, which checks that it's different from the current one:

::code-tree-intersection
:::code-collapse

```vue [app/pages/settings/security.vue]
<script setup lang="ts">
import * as z from 'zod'
import type { FormError } from '@nuxt/ui'

const passwordSchema = z.object({
  current: z.string().min(8, 'Must be at least 8 characters'),
  new: z.string().min(8, 'Must be at least 8 characters')
})

type PasswordSchema = z.output<typeof passwordSchema>

const password = reactive<Partial<PasswordSchema>>({
  current: '',
  new: ''
})

const validate = (state: Partial<PasswordSchema>): FormError[] => {
  const errors: FormError[] = []
  if (state.current && state.new && state.current === state.new) {
    errors.push({ name: 'new', message: 'Passwords must be different' })
  }
  return errors
}
</script>

<template>
  <UPageCard
    title="Password"
    description="Confirm your current password before setting a new one."
    variant="subtle"
  >
    <UForm
      :schema="passwordSchema"
      :state="password"
      :validate="validate"
      class="flex flex-col gap-4 max-w-xs"
    >
      <UFormField name="current">
        <UInput
          v-model="password.current"
          type="password"
          placeholder="Current password"
          class="w-full"
        />
      </UFormField>

      <UFormField name="new">
        <UInput
          v-model="password.new"
          type="password"
          placeholder="New password"
          class="w-full"
        />
      </UFormField>

      <UButton label="Update" class="w-fit" type="submit" />
    </UForm>
  </UPageCard>

  <UPageCard
    title="Account"
    description="No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently."
    class="bg-linear-to-tl from-error/10 from-5% to-default"
  >
    <template #footer>
      <UButton label="Delete account" color="error" />
    </template>
  </UPageCard>
</template>
```

:::
::

::tip{to="/docs/components/form#custom-validation"}
The `validate` prop works alongside the `schema` prop, for checks that depend on several fields.
::

## Going further

You now have a working admin dashboard. To take it further, consider adding:

**A real backend**

The server routes return fixed data and the home page generates random numbers. Store your data in a database with [NuxtHub](https://hub.nuxt.com/docs/database) and add authentication with [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils).

**Your own theme**

The [Dashboard template](https://github.com/nuxt-ui-templates/dashboard) uses its own green palette and the Public Sans font. Its user menu also has a theme picker that changes the primary and neutral colors at runtime through `useAppConfig`. Learn more about [theming](/docs/getting-started/theme/design-system) in the documentation.

**The finishing touches**

The template also sets its SEO meta tags in `app.vue`, displays errors with the [`UError`](/docs/components/error) component in `error.vue`, and shows a cookie consent toast.

## Deploying to Vercel

Deploy your dashboard to Vercel with zero configuration:

```bash
npx vercel deploy
```

The server routes are deployed as Vercel Functions. No environment variable is needed.

## Conclusion

You've built an admin dashboard with:

- **A resizable and collapsible layout** with Nuxt UI's dashboard components
- **A command palette and keyboard shortcuts** to move around
- **Charts and tables** with `UChart` and `UTable`, built on TanStack
- **Forms, modals and slideovers** to add, edit and delete data

**Resources:**

- [Nuxt UI Dashboard Components](/docs/components/dashboard-group)
- [Nuxt UI Table Component](/docs/components/table)
- [Nuxt UI Chart Component](/docs/components/chart)
- [TanStack Table Documentation](https://tanstack.com/table/v8/docs)
- [Nuxt Dashboard Template](https://github.com/nuxt-ui-templates/dashboard)
- [Vue Dashboard Template](https://github.com/nuxt-ui-templates/dashboard-vue)
