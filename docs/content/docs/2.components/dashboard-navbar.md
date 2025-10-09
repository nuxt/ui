---
title: DashboardNavbar
description: 'A responsive navbar to display in a dashboard.'
category: dashboard
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/DashboardNavbar.vue
---

## Usage

The DashboardNavbar component is a responsive navigation bar that integrates with the [DashboardSidebar](/docs/components/dashboard-sidebar) component. It includes a mobile toggle button to enable responsive navigation in dashboard layouts.

Use it inside the `header` slot of the [DashboardPanel](/docs/components/dashboard-panel) component:

```vue [pages/index.vue]{9-11}
<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar />
    </template>
  </UDashboardPanel>
</template>
```

Use the `left`, `default` and `right` slots to customize the navbar.

::component-example
---
prettier: true
name: 'dashboard-navbar-example'
class: '!px-0 !pt-0'
props:
  class: 'w-full'
---
::

::note
In this example, we use the [Tabs](/docs/components/tabs) component in the right slot to display some tabs.
::

### Title

Use the `title` prop to set the title of the navbar.

::component-code
---
hide:
  - class
props:
  title: 'Dashboard'
  class: 'w-full'
class: '!px-0 !pt-0'
---
::

### Icon

Use the `icon` prop to set the icon of the navbar.

::component-code
---
hide:
  - class
ignore:
  - title
props:
  title: 'Dashboard'
  icon: 'i-lucide-house'
  class: 'w-full'
class: '!px-0 !pt-0'
---
::

### Toggle

Use the `toggle` prop to customize the toggle button displayed on mobile that opens the [DashboardSidebar](/docs/components/dashboard-sidebar) component.

You can pass any property from the [Button](/docs/components/button) component to customize it.

::component-example
---
iframe: true
iframeMobile: true
overflowHidden: true
name: 'dashboard-navbar-toggle-example'
props:
  class: 'w-full'
---
::

### Toggle Side

Use the `toggle-side` prop to change the side of the toggle button. Defaults to `right`.

::component-example
---
iframe: true
iframeMobile: true
overflowHidden: true
name: 'dashboard-navbar-toggle-side-example'
props:
  class: 'w-full'
---
::

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme

## Changelog

:component-changelog
