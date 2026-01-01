---
title: DashboardSidebar
description: 'A resizable and collapsible sidebar to display in a dashboard.'
category: dashboard
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/DashboardSidebar.vue
---

## Usage

The DashboardSidebar component is used to display a sidebar. Its state (size, collapsed, etc.) will be saved based on the `storage` and `storage-key` props you provide to the [DashboardGroup](/docs/components/dashboard-group#props) component.

Use it inside the default slot of the [DashboardGroup](/docs/components/dashboard-group) component:

```vue [layouts/dashboard.vue]{3}
<template>
  <UDashboardGroup>
    <UDashboardSidebar />

    <slot />
  </UDashboardGroup>
</template>
```

::warning
This component does not have a single root element when using the `resizable` prop, so wrap it in a container (e.g., `<div class="flex flex-1">`) if you use page transitions or require a single root for layout.
::

Use the `header`, `default` and `footer` slots to customize the sidebar and the `body` or `content` slots to customize the sidebar menu.

::component-example
---
collapse: true
name: 'dashboard-sidebar-example'
class: '!p-0 !justify-start'
props:
  minSize: 22
  defaultSize: 35
  maxSize: 40
  class: '!min-h-96 h-136'
---
::

::note
Drag the sidebar near the left edge of the screen to collapse it.
::

### Resizable

Use the `resizable` prop to make the sidebar resizable.

::component-code
---
prettier: true
hide:
  - minSize
  - defaultSize
  - maxSize
  - class
props:
  resizable: true
  minSize: 22
  defaultSize: 35
  maxSize: 40
  class: '!min-h-96'
slots:
  default: |

    <Placeholder class="h-96" />
class: '!p-0 !justify-start'
---

:placeholder{class="h-96"}
::

### Collapsible

Use the `collapsible` prop to make the sidebar collapsible when dragging near the edge of the screen.

::warning
The [`DashboardSidebarCollapse`](/docs/components/dashboard-sidebar-collapse) component will have no effect if the sidebar is not **collapsible**.
::

::component-code
---
prettier: true
ignore:
  - resizable
hide:
  - minSize
  - defaultSize
  - maxSize
  - class
props:
  resizable: true
  collapsible: true
  minSize: 22
  defaultSize: 35
  maxSize: 40
  class: '!min-h-96'
slots:
  default: |

    <Placeholder class="h-96" />
class: '!p-0 !justify-start'
---

:placeholder{class="h-96"}
::

::tip{to="#slots"}
You can access the `collapsed` state in the slot props to customize the content of the sidebar when it is collapsed.
::

### Size

Use the `min-size`,  `max-size`, `default-size` and `collapsed-size` props to customize the size of the sidebar.

::component-code
---
prettier: true
ignore:
  - resizable
  - collapsible
hide:
  - class
props:
  resizable: true
  collapsible: true
  minSize: 22
  defaultSize: 35
  maxSize: 40
  collapsedSize: 0
  class: '!min-h-96'
slots:
  default: |

    <Placeholder class="h-96" />
class: '!p-0 !justify-start'
---

:placeholder{class="h-96"}
::

::tip{to="/docs/components/dashboard-group#props"}
Sizes are calculated as percentages by default. You can change this using the `unit` prop on the `DashboardGroup` component.
::

::note
The `collapsed-size` prop is set to `0` by default but the sidebar has a `min-w-16` to make sure it is visible.
::

### Side

Use the `side` prop to change the side of the sidebar. Defaults to `left`.

::component-code
---
prettier: true
ignore:
  - resizable
  - collapsible
hide:
  - minSize
  - defaultSize
  - maxSize
  - class
props:
  side: 'right'
  resizable: true
  collapsible: true
  minSize: 22
  defaultSize: 35
  maxSize: 40
  class: '!min-h-96'
slots:
  default: |

    <Placeholder class="h-96" />
class: '!p-0 !justify-end'
---

:placeholder{class="h-96"}
::

### Mode

Use the `mode` prop to change the mode of the sidebar menu. Defaults to `slideover`.

Use the `body` slot to fill the menu body (under the header) or the `content` slot to fill the entire menu.

::tip{to="#props"}
You can use the `menu` prop to customize the menu of the sidebar, it will adapt depending on the mode you choose.
::

::component-example
---
collapse: true
iframe:
  height: 500px;
iframeMobile: true
overflowHidden: true
name: 'dashboard-sidebar-mode-example'
options:
  - name: 'mode'
    label: 'mode'
    default: 'drawer'
    items:
      - modal
      - slideover
      - drawer
props:
  class: 'w-full'
---
::

::note
These examples contain the [`DashboardGroup`](/docs/components/dashboard-group), [`DashboardPanel`](/docs/components/dashboard-panel) and [`DashboardNavbar`](/docs/components/dashboard-navbar) components as they are required to demonstrate the sidebar on mobile.
::

### Toggle

Use the `toggle` prop to customize the [DashboardSidebarToggle](/docs/components/dashboard-sidebar-toggle) component displayed on mobile.

You can pass any property from the [Button](/docs/components/button) component to customize it.

::component-example
---
collapse: true
iframe:
  height: 500px;
iframeMobile: true
overflowHidden: true
name: 'dashboard-sidebar-toggle-example'
props:
  class: 'w-full'
---
::

### Toggle Side

Use the `toggle-side` prop to change the side of the toggle button. Defaults to `left`.

::component-example
---
collapse: true
iframe:
  height: 500px;
iframeMobile: true
overflowHidden: true
name: 'dashboard-sidebar-toggle-side-example'
props:
  class: 'w-full'
---
::

## Examples

### Control open state

You can control the open state by using the `open` prop or the `v-model:open` directive.

::component-example
---
iframe:
  height: 500px;
iframeMobile: true
overflowHidden: true
name: 'dashboard-sidebar-open-example'
class: '!p-0 !justify-start'
---
::

::note
In this example, leveraging [`defineShortcuts`](/docs/composables/define-shortcuts), you can toggle the open state of the DashboardSidebar by pressing :kbd{value="O"}.
::

### Control collapsed state

You can control the collapsed state by using the `collapsed` prop or the `v-model:collapsed` directive.

::component-example
---
name: 'dashboard-sidebar-collapsed-example'
class: '!p-0 !justify-start'
props:
  minSize: 22
  defaultSize: 35
  maxSize: 40
  class: '!min-h-96 h-136'
---
::

::note
In this example, leveraging [`defineShortcuts`](/docs/composables/define-shortcuts), you can toggle the collapsed state of the DashboardSidebar by pressing :kbd{value="C"}.
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
