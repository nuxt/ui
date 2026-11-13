---
description: A drawer that smoothly slides in and out of the screen.
category: overlay
keywords:
  - bottom sheet
  - action sheet
  - mobile sheet
links:
  - label: Drawer
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/drawer
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v5/src/runtime/components/Drawer.vue
---

## Usage

Use a [Button](/docs/components/button) or any other component in the default slot of the Drawer.

Then, use the `#body` slot to add the content displayed when the Drawer is open.

::component-example
---
prettier: true
collapse: true
name: 'drawer-example'
---
::

::tip
You can use the `#header` and `#footer` slots to customize the Drawer's content, or the `#content` slot to replace it entirely.
::

### Title

Use the `title` prop to set the title of the Drawer's header.

::component-code
---
prettier: true
props:
  title: 'Drawer with title'
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" />

  body: |

    <Placeholder class="h-48" />
---

:u-button{label="Open" color="neutral" variant="subtle"}

#body
:placeholder{class="h-48"}
::

### Description

Use the `description` prop to set the description of the Drawer's header.

::component-code
---
prettier: true
ignore:
  - title
props:
  title: 'Drawer with description'
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" />

  body: |

    <Placeholder class="h-48" />
---

:u-button{label="Open" color="neutral" variant="subtle"}

#body
:placeholder{class="h-48"}
::

### Close :badge{label="4.10+" class="align-text-top"}

Use the `close` prop to display a close button in the Drawer. Defaults to `false`.

You can pass any property from the [Button](/docs/components/button) component to customize it.

::component-code
---
prettier: true
ignore:
  - title
  - close.color
  - close.variant
props:
  title: 'Drawer with close button'
  close:
    color: primary
    variant: outline
    class: 'rounded-full'
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" />

  body: |

    <Placeholder class="h-48" />
---

:u-button{label="Open" color="neutral" variant="subtle"}

#body
:placeholder{class="h-48"}
::

### Close Icon :badge{label="4.10+" class="align-text-top"}

Use the `close-icon` prop to customize the close button [Icon](/docs/components/icon). Defaults to `i-lucide-x`.

::component-code
---
prettier: true
ignore:
  - title
props:
  title: 'Drawer with close button'
  close: true
  closeIcon: 'i-lucide-arrow-right'
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" />

  body: |

    <Placeholder class="h-48" />
---

:u-button{label="Open" color="neutral" variant="subtle"}

#body
:placeholder{class="h-48"}
::

### Side

Use the `side` prop to set the side of the screen where the Drawer will slide in from. Defaults to `bottom`.

::component-code
---
prettier: true
props:
  side: 'right'
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" />

  body: |

    <Placeholder class="min-w-96 min-h-96 size-full" />
---

:u-button{label="Open" color="neutral" variant="subtle"}

#body
:placeholder{class="min-w-96 min-h-96 size-full"}
::

### Inset

Use the `inset` prop to control whether the Drawer floats away from the edges. Defaults to `true`.

::component-code
---
prettier: true
props:
  side: 'right'
  inset: false
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" />

  body: |

    <Placeholder class="min-w-96 min-h-96 size-full" />
---

:u-button{label="Open" color="neutral" variant="subtle"}

#body
:placeholder{class="min-w-96 min-h-96 size-full"}
::

### Handle

Use the `handle` prop to render a grab handle on the Drawer. Defaults to `false`.

::note
The handle is decorative, the whole content is draggable without it, so it's most useful as a hint on touch devices.
::

::component-code
---
prettier: true
props:
  handle: true
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" />

  body: |

    <Placeholder class="h-48" />
---

:u-button{label="Open" color="neutral" variant="subtle"}

#body
:placeholder{class="h-48"}
::

### Snap points

Use the `snap-points` prop to let the Drawer rest at several heights, as fractions of the viewport, pixels or `rem` strings. Bind `v-model:snap-point` to control the current one.

::component-example
---
prettier: true
collapse: true
name: 'drawer-snap-points-example'
options:
  - name: 'inset'
    label: 'inset'
    default: true
    items:
      - true
      - false
---
::

::note
Snap points apply to top and bottom drawers.
::

### Overlay

Use the `overlay` prop to control whether the Drawer has an overlay or not. Defaults to `true`.

::component-code
---
prettier: true
props:
  overlay: false
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" />

  body: |

    <Placeholder class="h-48" />
---

:u-button{label="Open" color="neutral" variant="subtle"}

#body
:placeholder{class="h-48"}
::

### Modal

Use the `modal` prop to control whether the Drawer blocks interaction with outside content. Defaults to `true`.

::note
When `modal` is set to `false`, the overlay is automatically disabled and outside content becomes interactive. Set it to `trap-focus` with `overlay: false` to keep the focus inside the Drawer while outside content stays clickable.
::

::component-code
---
prettier: true
props:
  modal: false
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" />

  body: |

    <Placeholder class="h-48" />
---

:u-button{label="Open" color="neutral" variant="subtle"}

#body
:placeholder{class="h-48"}
::

### Dismissible

Use the `dismissible` prop to control whether the Drawer can be dismissed by clicking outside of it, pressing escape or swiping it away. Defaults to `true`.

::note
A `close:prevent` event will be emitted when a click outside, the escape key or a swipe is blocked. The close button still closes the Drawer, and the trigger only can when `modal` is `false`, so give a modal Drawer a close button.
::

::tip
You can combine `modal: false` with `dismissible: false` to make the Drawer's background interactive without closing it.
::

::component-example
---
prettier: true
collapse: true
name: 'drawer-dismissible-example'
---
::

## Examples

### Control open state

You can control the open state by using the `default-open` prop or the `v-model:open` directive.

::component-example
---
prettier: true
collapse: true
name: 'drawer-open-example'
---
::

::note
In this example, leveraging [`defineShortcuts`](/docs/composables/define-shortcuts), you can toggle the Drawer by pressing :kbd{value="O"}.
::

::tip
This lets you move the trigger outside of the Drawer or remove it entirely.
::

### Responsive drawer

You can render a [Modal](/docs/components/modal) component on desktop and a Drawer on mobile for example.

::component-example
---
prettier: true
collapse: true
name: 'drawer-responsive-example'
---
::

### Nested drawers

You can nest drawers within each other. The ones behind recede and match the size of the frontmost one.

::component-example
---
prettier: true
collapse: true
name: 'drawer-nested-example'
---
::

### With footer slot

Use the `#footer` slot to add content after the Drawer's body.

::component-example
---
prettier: true
collapse: true
name: 'drawer-footer-slot-example'
---
::

### With command palette

You can use a [CommandPalette](/docs/components/command-palette) component inside the Drawer's content.

::component-example
---
collapse: true
name: 'drawer-command-palette-example'
---
::

::note
This example uses `useLazyFetch` with `immediate: false` to only fetch data when the Drawer opens.
::

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

## Theme

:component-theme

## Changelog

:component-changelog
