---
title: DashboardResizeHandle
description: 'A handle to resize a sidebar or panel.'
category: dashboard
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/DashboardResizeHandle.vue
---

## Usage

The DashboardResizeHandle component is used by the [DashboardSidebar](/docs/components/dashboard-sidebar) and [DashboardPanel](/docs/components/dashboard-panel) components.

It is automatically displayed when the `resizable` prop is set, **you don't have to add it manually**.

## Examples

### Within `resize-handle` slot

Even though this component is automatically displayed when the `resizable` prop is set, you can use the `resize-handle` slot of the [DashboardSidebar](/docs/components/dashboard-sidebar) and [DashboardPanel](/docs/components/dashboard-panel) components to customize the handle.

::code-group

```vue [layouts/dashboard.vue]{4-10}
<template>
  <UDashboardGroup>
    <UDashboardSidebar resizable>
      <template #resize-handle="{ onMouseDown, onTouchStart, onDoubleClick }">
        <UDashboardResizeHandle
          class="after:absolute after:inset-y-0 after:right-0 after:w-px hover:after:bg-(--ui-border-accented) after:transition"
          @mousedown="onMouseDown"
          @touchstart="onTouchStart"
          @dblclick="onDoubleClick"
        />
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
```

```vue [pages/index.vue]{9-15}
<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})
</script>

<template>
  <UDashboardPanel resizable>
    <template #resize-handle="{ onMouseDown, onTouchStart, onDoubleClick }">
      <UDashboardResizeHandle
        class="after:absolute after:inset-y-0 after:right-0 after:w-px hover:after:bg-(--ui-border-accented) after:transition"
        @mousedown="onMouseDown"
        @touchstart="onTouchStart"
        @dblclick="onDoubleClick"
      />
    </template>
  </UDashboardPanel>
</template>
```

::

::note
In this example, we add an `after` pseudo-element to display a vertical line on hover.
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
