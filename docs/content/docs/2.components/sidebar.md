---
title: Sidebar
description: 'A collapsible sidebar with multiple visual variants.'
category: layout
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Sidebar.vue
---

## Usage

The Sidebar component is a standalone, fixed sidebar that pushes the page content. On desktop, it renders inline and can be collapsed; on mobile, it opens as a sheet (Modal, Slideover or Drawer).

::tip{to="/docs/components/dashboard-sidebar"}
If you're building a dashboard layout with drag-to-resize, state persistence and integration with `DashboardGroup`, `DashboardPanel` and `DashboardNavbar`, use the [DashboardSidebar](/docs/components/dashboard-sidebar) instead. The **Sidebar** component is designed for standalone use cases like a chat panel or a settings panel on any page.
::

Use the `title`, `description` and `close` props to customize the sidebar header just like the [Modal](/docs/components/modal), [Slideover](/docs/components/slideover) and [Drawer](/docs/components/drawer) components.

Use the `body`, `default` and `footer` slots to customize the sidebar content. The `v-model:open` directive is viewport-aware: on desktop it controls the expanded/collapsed state, on mobile it controls the sheet menu.

::component-example
---
collapse: true
name: 'sidebar-example'
class: '!p-0 !justify-start'
iframe:
  height: 500px;
iframeMobile: true
overflowHidden: true
---
::

### Variant

Use the `variant` prop to change the visual style of the sidebar. Defaults to `sidebar`.

::component-example
---
collapse: true
name: 'sidebar-example'
class: '!p-0 !justify-start'
iframe:
  height: 500px;
iframeMobile: true
overflowHidden: true
options:
  - name: 'variant'
    label: 'variant'
    default: 'sidebar'
    items:
      - sidebar
      - floating
      - inset
---
::

### Collapsible

Use the `collapsible` prop to change the collapse behavior of the sidebar. Defaults to `none`.

- `offcanvas`: The sidebar slides out of view completely.
- `icon`: The sidebar shrinks to icon-only width.
- `none`: The sidebar is not collapsible.

::component-example
---
collapse: true
name: 'sidebar-example'
class: '!p-0 !justify-start'
iframe:
  height: 500px;
iframeMobile: true
overflowHidden: true
options:
  - name: 'collapsible'
    label: 'collapsible'
    default: 'icon'
    items:
      - offcanvas
      - icon
      - none
---
::

::tip{to="#slots"}
You can access the `state` in the slot props to customize the content of the sidebar when it is collapsed.
::

### Side

Use the `side` prop to change the side of the sidebar. Defaults to `left`.

::component-example
---
collapse: true
name: 'sidebar-example'
class: '!p-0 !justify-start'
iframe:
  height: 500px;
iframeMobile: true
overflowHidden: true
options:
  - name: 'side'
    label: 'side'
    default: 'left'
    items:
      - left
      - right
---
::

### Title / Description / Close

Use the `title`, `description` and `close` props to customize the sidebar header.

::tip
You can use the `#title`, `#description` and `#close` slots to customize them.
::

### Width

Use the `width` prop to change the width of the sidebar. Defaults to `16rem`.

Use the `icon-width` prop to change the width of the sidebar when collapsed to icon mode. Defaults to `3rem`.

### Mode

Use the `mode` prop to change the mode of the sidebar menu on mobile. Defaults to `slideover`.

::tip{to="#props"}
You can use the `menu` prop to customize the menu of the sidebar, it will adapt depending on the mode you choose.
::

## Examples

### Control open state

You can control the open state by using the `open` prop or the `v-model:open` directive. On desktop it controls the expanded/collapsed state, on mobile it opens/closes the sheet menu.

::component-example
---
name: 'sidebar-open-example'
class: '!p-0 !justify-start'
iframe:
  height: 500px;
iframeMobile: true
overflowHidden: true
---
::

::note
In this example, leveraging [`defineShortcuts`](/docs/composables/define-shortcuts), you can toggle the open state of the Sidebar by pressing :kbd{value="O"}.
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
