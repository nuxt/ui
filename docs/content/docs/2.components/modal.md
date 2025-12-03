---
description: A dialog window that can be used to display a message or request user input.
category: overlay
links:
  - label: Dialog
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/dialog
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Modal.vue
---

## Usage

Use a [Button](/docs/components/button) or any other component in the default slot of the Modal.

Then, use the `#content` slot to add the content displayed when the Modal is open.

::component-code
---
prettier: true
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" />

  content: |

    <Placeholder class="h-48 m-4" />
---

:u-button{label="Open" color="neutral" variant="subtle"}

#content
:placeholder{class="h-48 m-4"}
::

You can also use the `#header`{lang="ts-type"}, `#body`{lang="ts-type"} and `#footer`{lang="ts-type"} slots to customize the Modal's content.

### Title

Use the `title` prop to set the title of the Modal's header.

::component-code
---
prettier: true
props:
  title: 'Modal with title'
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

Use the `description` prop to set the description of the Modal's header.

::component-code
---
prettier: true
ignore:
  - title
props:
  title: 'Modal with description'
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

### Close

Use the `close` prop to customize or hide the close button (with `false` value) displayed in the Modal's header.

You can pass any property from the [Button](/docs/components/button) component to customize it.

::component-code
---
prettier: true
ignore:
  - title
  - close.color
  - close.variant
props:
  title: 'Modal with close button'
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

::tip
The close button is not displayed if the `#content` slot is used as it's a part of the header.
::

### Close Icon

Use the `close-icon` prop to customize the close button [Icon](/docs/components/icon). Defaults to `i-lucide-x`.

::component-code
---
prettier: true
ignore:
  - title
props:
  title: 'Modal with close button'
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

### Transition

Use the `transition` prop to control whether the Modal is animated or not. Defaults to `true`.

::component-code
---
prettier: true
ignore:
  - title
props:
  transition: false
  title: 'Modal without transition'
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

### Overlay

Use the `overlay` prop to control whether the Modal has an overlay or not. Defaults to `true`.

::component-code
---
prettier: true
ignore:
  - title
props:
  overlay: false
  title: 'Modal without overlay'
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

Use the `modal` prop to control whether the Modal blocks interaction with outside content. Defaults to `true`.

::note
When `modal` is set to `false`, the overlay is automatically disabled and outside content becomes interactive.
::

::component-code
---
prettier: true
ignore:
  - title
props:
  modal: false
  title: 'Modal interactive'
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

Use the `dismissible` prop to control whether the Modal is dismissible when clicking outside of it or pressing escape. Defaults to `true`.

::note
A `close:prevent` event will be emitted when the user tries to close it.
::

::tip
You can combine `modal: false` with `dismissible: false` to make the Modal's background interactive without closing it.
::

::component-code
---
prettier: true
ignore:
  - title
props:
  dismissible: false
  modal: true
  title: 'Modal non-dismissible'
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

### Scrollable :badge{label="4.2+" class="align-text-top"}

Use the `scrollable` prop to make the Modal's content scrollable within the overlay.

::warning
As the overlay is needed for scrolling, `modal: false` is not compatible and `overlay: false` only removes the background.
::

::component-code
---
prettier: true
ignore:
  - title
props:
  scrollable: true
  overlay: true
  title: 'Modal scrollable'
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" />

  body: |

    <Placeholder class="h-full" />
---

:u-button{label="Open" color="neutral" variant="subtle"}

#body
:placeholder{class="h-screen"}
::

::caution
There's a [known issue](https://reka-ui.com/docs/components/dialog#scrollable-overlay) where clicking on the scrollbar may unintentionally close the dialog on some operating systems.
::

### Fullscreen

Use the `fullscreen` prop to make the Modal fullscreen.

::component-code
---
prettier: true
ignore:
  - title
  - fullscreen
props:
  fullscreen: true
  title: 'Modal fullscreen'
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" />

  body: |

    <Placeholder class="h-full" />
---

:u-button{label="Open" color="neutral" variant="subtle"}

#body
:placeholder{class="h-full"}
::

## Examples

### Control open state

You can control the open state by using the `default-open` prop or the `v-model:open` directive.

::component-example
---
name: 'modal-open-example'
---
::

::note
In this example, leveraging [`defineShortcuts`](/docs/composables/define-shortcuts), you can toggle the Modal by pressing :kbd{value="O"}.
::

::tip
This allows you to move the trigger outside of the Modal or remove it entirely.
::

### Programmatic usage

You can use the [`useOverlay`](/docs/composables/use-overlay) composable to open a Modal programmatically.

::warning
Make sure to wrap your app with the [`App`](/docs/components/app) component which uses the [`OverlayProvider`](https://github.com/nuxt/ui/blob/v4/src/runtime/components/OverlayProvider.vue) component.
::

First, create a modal component that will be opened programmatically:

::component-example
---
prettier: true
name: 'modal-example'
preview: false
---
::

::note
We are emitting a `close` event when the modal is closed or dismissed here. You can emit any data through the `close` event, however, the event must be emitted in order to capture the return value.
::

Then, use it in your app:

::component-example
---
name: 'modal-programmatic-example'
---
::

::tip
You can close the modal within the modal component by emitting `emit('close')`.
::

### Nested modals

You can nest modals within each other.

::component-example
---
name: 'modal-nested-example'
---
::

### With footer slot

Use the `#footer` slot to add content after the Modal's body.

::component-example
---
name: 'modal-footer-slot-example'
---
::

### With command palette

You can use a [CommandPalette](/docs/components/command-palette) component inside the Modal's content.

::component-example
---
collapse: true
name: 'modal-command-palette-example'
---
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
