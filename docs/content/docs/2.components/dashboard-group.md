---
title: DashboardGroup
description: 'A fixed layout component that provides context for dashboard components with sidebar state management and persistence.'
category: dashboard
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/DashboardGroup.vue
---

## Usage

The DashboardGroup component is the main layout that wraps the [DashboardSidebar](/docs/components/dashboard-sidebar) and [DashboardPanel](/docs/components/dashboard-panel) components to create a responsive dashboard interface.

Use it in a layout or in your `app.vue`:

```vue [layouts/dashboard.vue]{2,6}
<template>
  <UDashboardGroup>
    <UDashboardSidebar />

    <slot />
  </UDashboardGroup>
</template>
```

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme

## Changelog

:component-changelog
