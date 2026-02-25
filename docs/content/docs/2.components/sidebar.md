---
title: Sidebar
description: 'A collapsible sidebar with multiple visual variants.'
category: layout
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Sidebar.vue
navigation.badge: Soon
---

## Usage

The Sidebar component is a standalone, fixed sidebar that pushes the page content. On desktop, it renders inline and can be collapsed; on mobile, it opens as a sheet (Modal, Slideover or Drawer).

::tip{to="/docs/components/dashboard-sidebar"}
**Sidebar vs DashboardSidebar**: This component is a simple, standalone sidebar you can drop anywhere (chat panel, settings, navigation). If you need drag-to-resize, state persistence and integration with [DashboardGroup](/docs/components/dashboard-group), use [DashboardSidebar](/docs/components/dashboard-sidebar) instead.
::

Use the `title`, `description` and `close` props to customize the sidebar header just like the [Modal](/docs/components/modal), [Slideover](/docs/components/slideover) and [Drawer](/docs/components/drawer) components.

Use the `body`, `default` and `footer` slots to customize the sidebar content. The `v-model:open` directive is viewport-aware: on desktop it controls the expanded/collapsed state, on mobile it controls the sheet menu.

::component-example
---
collapse: true
name: 'sidebar-example'
class: '!p-0 !justify-start h-[500px]'
---
::

### Variant

Use the `variant` prop to change the visual style of the sidebar. Defaults to `sidebar`.

::component-code
---
items:
  variant:
    - sidebar
    - floating
    - inset
hide:
  - class
props:
  variant: sidebar
  class: 'h-72'
slots:
  default: |

    <Placeholder class="h-full" />
class: '!p-0 !justify-start'
---

:placeholder{class="h-full"}
::

### Collapsible

Use the `collapsible` prop to change the collapse behavior of the sidebar. Defaults to `none`.

- `offcanvas`: The sidebar slides out of view completely.
- `icon`: The sidebar shrinks to icon-only width.
- `none`: The sidebar is not collapsible.

::component-code
---
items:
  collapsible:
    - offcanvas
    - icon
    - none
hide:
  - ui
  - class
props:
  collapsible: icon
  class: 'h-72'
  ui:
    root: 'block h-72 w-(--sidebar-width) border-e border-default'
    gap: 'hidden'
    container: 'relative flex h-full w-(--sidebar-width) border-0'
slots:
  default: |

    <Placeholder class="h-full" />
class: '!p-0 !justify-start'
---

:placeholder{class="h-full"}
::

::tip{to="#slots"}
You can access the `state` in the slot props to customize the content of the sidebar when it is collapsed.
::

### Side

Use the `side` prop to change the side of the sidebar. Defaults to `left`.

::component-code
---
items:
  side:
    - left
    - right
hide:
  - class
props:
  side: left
  class: 'h-72'
slots:
  default: |

    <Placeholder class="h-full" />
class: '!p-0 !justify-start'
---

:placeholder{class="h-full"}
::

### Title

Use the `title` prop to set the title of the sidebar header.

::component-code
---
hide:
  - class
props:
  title: Navigation
  class: 'h-72'
slots:
  default: |

    <Placeholder class="h-full" />
class: '!p-0 !justify-start'
---

:placeholder{class="h-full"}
::

### Description

Use the `description` prop to set the description of the sidebar header.

::component-code
---
hide:
  - class
props:
  title: Navigation
  description: Browse your workspace
  class: 'h-72'
slots:
  default: |

    <Placeholder class="h-full" />
class: '!p-0 !justify-start'
---

:placeholder{class="h-full"}
::

### Close

Use the `close` prop to display a close button in the sidebar header. The close button is only rendered when `collapsible` is not `none`.

You can pass any property from the [Button](/docs/components/button) component to customize it.

::component-code
---
prettier: true
ignore:
  - collapsible
hide:
  - ui
  - class
props:
  close: true
  title: Navigation
  collapsible: offcanvas
  class: 'h-72'
  ui:
    root: 'block h-72 w-(--sidebar-width) border-e border-default'
    gap: 'hidden'
    container: 'relative flex h-full w-(--sidebar-width) border-0'
slots:
  default: |

    <Placeholder class="h-full" />
class: '!p-0 !justify-start'
---

:placeholder{class="h-full"}
::

### Close Icon

Use the `close-icon` prop to customize the close button [Icon](/docs/components/icon). Defaults to `i-lucide-x`.

::component-code
---
prettier: true
ignore:
  - collapsible
  - close
hide:
  - ui
  - class
props:
  close: true
  closeIcon: i-lucide-arrow-left
  title: Navigation
  collapsible: offcanvas
  class: 'h-72'
  ui:
    root: 'block h-72 w-(--sidebar-width) border-e border-default'
    gap: 'hidden'
    container: 'relative flex h-full w-(--sidebar-width) border-0'
slots:
  default: |

    <Placeholder class="h-full" />
class: '!p-0 !justify-start'
---

:placeholder{class="h-full"}
::

::tip
You can use the `#title`, `#description` and `#close` slots to customize them.
::

### Mode

Use the `mode` prop to change the mode of the sidebar menu on mobile. Defaults to `slideover`.

::component-code
---
items:
  mode:
    - modal
    - slideover
    - drawer
hide:
  - class
props:
  mode: slideover
  class: 'h-72'
slots:
  default: |

    <Placeholder class="h-full" />
class: '!p-0 !justify-start'
---

:placeholder{class="h-full"}
::

::tip{to="#props"}
You can use the `menu` prop to customize the menu of the sidebar, it will adapt depending on the mode you choose.
::

## Examples

### With inset variant

Use the `inset` variant with `peer` data-attribute classes on the content panel to create a visually inset layout where the content area adapts to the sidebar variant.

::component-example
---
collapse: true
name: 'sidebar-inset-example'
class: '!p-0 !justify-start h-[500px]'
---
::

### With chat

Use the sidebar on the right side with [ChatMessages](/docs/components/chat-messages) and [ChatPrompt](/docs/components/chat-prompt) to create an AI chat panel.

::component-example
---
collapse: true
name: 'sidebar-chat-example'
class: '!p-0 !justify-start h-[500px]'
---
::

### With custom width

The sidebar width is controlled by the `--sidebar-width` CSS variable (defaults to `16rem`). The collapsed icon width is controlled by `--sidebar-width-icon` (defaults to `4rem`).

Override them globally in your CSS or per-instance with the `style` attribute.

::component-example
---
name: 'sidebar-width-example'
class: '!p-0 !justify-start h-[500px]'
---
::

### With Navbar

To position the sidebar below a fixed navbar, customize the `gap` and `container` using the `ui` prop.

::component-example
---
name: 'sidebar-navbar-example'
class: '!p-0 !justify-start h-[500px]'
---
::

::note
The `--ui-header-height` variable defaults to `4rem` and is used by the [Header](/docs/components/header) and [DashboardNavbar](/docs/components/dashboard-navbar) components. Adjust it if your navbar uses a different height.
::

### Control open state

You can control the open state by using the `open` prop or the `v-model:open` directive. On desktop it controls the expanded/collapsed state, on mobile it opens/closes the sheet menu.

::component-example
---
name: 'sidebar-open-example'
class: '!p-0 !justify-start h-[500px]'
---
::

::note
In this example, leveraging [`defineShortcuts`](/docs/composables/define-shortcuts), you can toggle the open state of the Sidebar by pressing :kbd{value="O"}.
::

### Persist open state

Use [`useLocalStorage`](https://vueuse.org/core/useLocalStorage/) from VueUse or [`useCookie`](https://nuxt.com/docs/4.x/api/composables/use-cookie) instead of `ref` to persist the sidebar state across page reloads.

::component-example
---
name: 'sidebar-persist-example'
class: '!p-0 !justify-start h-[500px]'
---
::

::note
The only difference with the previous example is replacing `ref(true)` with `useLocalStorage('sidebar-open', true)`.
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
