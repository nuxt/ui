---
title: DashboardSidebarToggle
description: 'A Button to toggle the sidebar on mobile.'
category: dashboard
links:
  - label: Button
    to: /docs/components/button
    icon: i-simple-icons-nuxtdotjs
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/DashboardSidebarToggle.vue
---

## Usage

The DashboardSidebarToggle component is used by the [DashboardNavbar](/docs/components/dashboard-navbar) and [DashboardSidebar](/docs/components/dashboard-sidebar) components.

It is automatically displayed on mobile to toggle the sidebar, **you don't have to add it manually**.

::component-code
---
hide:
  - class
props:
  class: 'lg:flex'
---
::

It extends the [Button](/docs/components/button) component, so you can pass any property such as `color`, `variant`, `size`, etc.

::component-code
---
hide:
  - class
ignore:
  - variant
props:
  variant: 'subtle'
  class: 'lg:flex'
---
::

::note
The button defaults to `color="neutral"` and `variant="ghost"`.
::

## Examples

### Within `toggle` slot

Even though this component is automatically displayed on mobile, you can use the `toggle` slot of the [DashboardNavbar](/docs/components/dashboard-navbar) and [DashboardSidebar](/docs/components/dashboard-sidebar) components to customize the button.

::code-group

```vue [layouts/dashboard.vue]{4-6}
<template>
  <UDashboardGroup>
    <UDashboardSidebar>
      <template #toggle>
        <UDashboardSidebarToggle variant="subtle" />
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
```

```vue [pages/index.vue]{11-13}
<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Home">
        <template #toggle>
          <UDashboardSidebarToggle variant="subtle" />
        </template>
      </UDashboardNavbar>
    </template>
  </UDashboardPanel>
</template>
```

::

::tip
When using the `toggle-side` prop of the `DashboardSidebar` and `DashboardNavbar` components, the button will be displayed on the specified side.
::

## API

### Props

:component-props

::callout{icon="i-simple-icons-mdnwebdocs" to="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attributes" target="_blank"}
This component also supports all native `<button>` HTML attributes.
::

## Theme

:component-theme

## Changelog

:component-changelog
