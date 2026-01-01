---
title: DashboardSidebarCollapse
description: 'A Button to collapse the sidebar on desktop.'
category: dashboard
links:
  - label: Button
    to: /docs/components/button
    icon: i-simple-icons-nuxtdotjs
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/DashboardSidebarCollapse.vue
---

## Usage

The DashboardSidebarCollapse component is used to collapse/expand the [DashboardSidebar](/docs/components/dashboard-sidebar) component **when its `collapsible` prop is set**.

:component-code

It extends the [Button](/docs/components/button) component, so you can pass any property such as `color`, `variant`, `size`, etc.

::component-code
---
ignore:
  - variant
props:
  variant: 'subtle'
---
::

::note
The button defaults to `color="neutral"` and `variant="ghost"`.
::

## Examples

### Within `header` slot

You can put this component in the `header` slot of the [DashboardSidebar](/docs/components/dashboard-sidebar) component and use the `collapsed` prop to hide the left part of the header for example:

```vue [layouts/dashboard.vue]{4-8}
<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible>
      <template #header="{ collapsed }">
        <Logo v-if="!collapsed" />

        <UDashboardSidebarCollapse variant="subtle" />
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
```

### Within `leading` slot

You can put this component in the `leading` slot of the [DashboardNavbar](/docs/components/dashboard-navbar) component to display it before the title for example:

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
        <template #leading>
          <UDashboardSidebarCollapse variant="subtle" />
        </template>
      </UDashboardNavbar>
    </template>
  </UDashboardPanel>
</template>
```

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
