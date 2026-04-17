---
title: Sidebar
description: 'A collapsible sidebar with multiple visual variants.'
category: layout
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Sidebar.vue
navigation.badge: New
---

## Usage

The Sidebar component is a standalone, fixed sidebar that pushes the page content. On desktop, it renders inline and can be collapsed; on mobile, it opens a [Modal](/docs/components/modal), [Slideover](/docs/components/slideover) or [Drawer](/docs/components/drawer) component.

::tip{to="/docs/components/dashboard-sidebar"}
**Sidebar vs DashboardSidebar**: This component is a simple, standalone sidebar you can drop anywhere (chat panel, settings, navigation). If you need drag-to-resize, state persistence and integration with [DashboardGroup](/docs/components/dashboard-group), use [DashboardSidebar](/docs/components/dashboard-sidebar) instead.
::

Use the `header`, `default` and `footer` slots to customize the sidebar content. The `v-model:open` directive is viewport-aware: on desktop it controls the expanded/collapsed state, on mobile it controls the menu.

::component-example
---
collapse: true
prettier: true
name: 'sidebar-example'
overflowHidden: true
class: '!p-0 !justify-start h-[500px] contain-[paint]'
---
::

### Variant

Use the `variant` prop to change the visual style of the sidebar. Defaults to `sidebar`.

::component-example
---
collapse: true
prettier: true
name: 'sidebar-props-example'
overflowHidden: true
options:
  - name: 'variant'
    label: 'variant'
    items:
      - sidebar
      - floating
      - inset
    default: 'inset'
class: '!p-0 !justify-start h-[500px] contain-[paint]'
---
::

### Collapsible

Use the `collapsible` prop to change the collapse behavior of the sidebar. Defaults to `offcanvas`.

- `offcanvas`: The sidebar slides out of view completely.
- `icon`: The sidebar shrinks to icon-only width.
- `none`: The sidebar is not collapsible.

::component-example
---
collapse: true
prettier: true
name: 'sidebar-props-example'
overflowHidden: true
options:
  - name: 'collapsible'
    label: 'collapsible'
    items:
      - offcanvas
      - icon
      - none
    default: 'icon'
  - name: 'variant'
    label: 'variant'
    items:
      - sidebar
      - floating
      - inset
    default: 'sidebar'
class: '!p-0 !justify-start h-[500px] contain-[paint]'
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
prettier: true
name: 'sidebar-props-example'
overflowHidden: true
options:
  - name: 'side'
    label: 'side'
    items:
      - left
      - right
    default: 'right'
class: '!p-0 !justify-start h-[500px] contain-[paint]'
---
::

### Title

Use the `title` prop to set the title of the sidebar header.

::component-code
---
prettier: true
hide:
  - class
  - ui
ignore:
  - ui.container
props:
  title: Navigation
  ui:
    container: h-full
slots:
  default: |

    <Placeholder class="h-full" />
class: '!p-0 !justify-start h-[500px] contain-[paint]'
---

:placeholder{class="h-full"}
::

### Description

Use the `description` prop to set the description of the sidebar header.

::component-code
---
prettier: true
hide:
  - class
  - ui
ignore:
  - title
  - ui.container
props:
  title: Navigation
  description: Browse your workspace
  ui:
    container: h-full
slots:
  default: |

    <Placeholder class="h-full" />
class: '!p-0 !justify-start h-[500px] contain-[paint]'
---

:placeholder{class="h-full"}
::

### Rail

Use the `rail` prop to display a thin interactive edge on the sidebar that toggles the collapsed state on click. The rail is only rendered when `collapsible` is not `none`.

::component-code
---
prettier: true
ignore:
  - title
  - ui.container
hide:
  - ui
  - class
props:
  rail: true
  collapsible: icon
  title: Navigation
  ui.container: h-full
slots:
  default: |

    <Placeholder class="h-full" />
class: '!p-0 !justify-start h-[500px] contain-[paint]'
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
  - title
  - rail
  - ui.container
hide:
  - ui
  - class
props:
  close: true
  rail: true
  collapsible: icon
  title: Navigation
  ui:
    container: h-full
items:
  close:
    - true
    - false
slots:
  default: |

    <Placeholder class="h-full" />
class: '!p-0 !justify-start h-[500px] contain-[paint]'
---

:placeholder{class="h-full"}
::

### Close Icon

Use the `close-icon` prop to customize the close button [Icon](/docs/components/icon). Defaults to `i-lucide-x`.

::component-code
---
prettier: true
ignore:
  - title
  - rail
  - side
  - close
  - ui.container
hide:
  - ui
  - class
props:
  close: true
  closeIcon: i-lucide-panel-right-close
  rail: true
  collapsible: icon
  side: right
  title: Navigation
  ui:
    container: h-full
items:
  close:
    - true
    - false
slots:
  default: |

    <Placeholder class="h-full" />
class: '!p-0 !justify-start h-[500px] contain-[paint]'
---

:placeholder{class="h-full"}
::

::framework-only
#nuxt
:::tip{to="/docs/getting-started/integrations/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.close` key.
:::

#vue
:::tip{to="/docs/getting-started/integrations/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.close` key.
:::
::

### Mode

Use the `mode` prop to change the mode of the sidebar menu on mobile. Defaults to `slideover`.

::component-example
---
collapse: true
iframe:
  height: 500px;
iframeMobile: true
overflowHidden: true
name: 'sidebar-mode-example'
options:
  - name: 'mode'
    label: 'mode'
    default: 'slideover'
    items:
      - modal
      - slideover
      - drawer
props:
  class: 'w-full'
---
::

::tip{to="#props"}
You can use the `menu` prop to customize the menu of the sidebar, it will adapt depending on the mode you choose.
::

## Examples

### Control open state

You can control the open state by using the `open` prop or the `v-model:open` directive. On desktop it controls the expanded/collapsed state, on mobile it opens/closes the sheet menu.

::component-example
---
collapse: true
prettier: true
name: 'sidebar-open-example'
overflowHidden: true
class: '!p-0 !justify-start h-[500px] contain-[paint]'
---
::

::note
In this example, leveraging [`defineShortcuts`](/docs/composables/define-shortcuts), you can toggle the open state of the Sidebar by pressing :kbd{value="O"}.
::

### Persist open state

Use [`useLocalStorage`](https://vueuse.org/core/useLocalStorage/) from VueUse or [`useCookie`](https://nuxt.com/docs/4.x/api/composables/use-cookie) instead of `ref` to persist the sidebar state across page reloads.

::component-example
---
collapse: true
prettier: true
name: 'sidebar-persist-example'
overflowHidden: true
class: '!p-0 !justify-start h-[500px] contain-[paint]'
---
::

::note
The only difference with the previous example is replacing `ref(true)` with `useLocalStorage('sidebar-open', true)`.
::

### With custom width

The sidebar width is controlled by the `--sidebar-width` CSS variable (defaults to `16rem`). The collapsed icon width is controlled by `--sidebar-width-icon` (defaults to `4rem`).

Override them globally in your CSS or per-instance with the `style` attribute.

::component-example
---
collapse: true
prettier: true
name: 'sidebar-width-example'
overflowHidden: true
class: '!p-0 !justify-start h-[500px] contain-[paint]'
---
::

### With header

To position the sidebar below a [Header](/docs/components/header), customize the `gap` and `container` using the `ui` prop.

::component-example
---
collapse: true
prettier: true
name: 'sidebar-header-example'
overflowHidden: true
class: '!p-0 !justify-start h-[500px] contain-[paint]'
---
::

::note
The `--ui-header-height` variable defaults to `4rem` and is used by the Header. Adjust it if your navbar uses a different height.
::

### With AI chat

Use the sidebar on the right side with [ChatMessages](/docs/components/chat-messages) and [ChatPrompt](/docs/components/chat-prompt) to create an AI chat panel.

::component-example
---
collapse: true
prettier: true
name: 'sidebar-chat-example'
overflowHidden: true
class: '!p-0 !justify-start h-[500px] contain-[paint]'
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
