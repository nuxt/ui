---
description: A dialog that slides in from any side of the screen.
links:
  - label: Dialog
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/dialog
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Slideover.vue
---

## Usage

Use a [Button](/components/button) or any other component in the default slot of the Slideover.

Then, use the `#content` slot to add the content displayed when the Slideover is open.

::component-code
---
prettier: true
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" />

  content: |

    <Placeholder class="h-full m-4" />
---

:u-button{label="Open" color="neutral" variant="subtle"}

#content
:placeholder{class="h-full m-4"}
::

You can also use the `#header`{lang="ts-type"}, `#body`{lang="ts-type"} and `#footer`{lang="ts-type"} slots to customize the Slideover's content.

### Title

Use the `title` prop to set the title of the Slideover's header.

::component-code
---
prettier: true
props:
  title: 'Slideover with title'
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

### Description

Use the `description` prop to set the description of the Slideover's header.

::component-code
---
prettier: true
ignore:
  - title
props:
  title: 'Slideover with description'
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
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

### Close

Use the `close` prop to customize or hide the close button (with `false` value) displayed in the Slideover's header.

You can pass all the props of the [Button](/components/button) component to customize it.

::component-code
---
prettier: true
ignore:
  - title
  - close.color
  - close.variant
props:
  title: 'Slideover with close button'
  close:
    color: primary
    variant: outline
    class: 'rounded-full'
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

::note
The close button is not displayed if the `#content` slot is used as it's a part of the header.
::

### Close Icon

Use the `close-icon` prop to customize the close button [Icon](/components/icon). Defaults to `i-lucide-x`.

::component-code
---
prettier: true
ignore:
  - title
props:
  title: 'Slideover with close button'
  closeIcon: 'i-lucide-arrow-right'
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

::framework-only
#nuxt
:::tip{to="/getting-started/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.close` key.
:::

#vue
:::tip{to="/getting-started/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.close` key.
:::
::

### Side

Use the `side` prop to set the side of the screen where the Slideover will slide in from. Defaults to `right`.

::component-code
---
prettier: true
ignore:
  - title
props:
  side: 'left'
  title: 'Slideover with side'
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" />

  body: |

    <Placeholder class="h-full min-h-48" />
---

:u-button{label="Open" color="neutral" variant="subtle"}

#body
:placeholder{class="h-full min-h-48"}
::

### Overlay

Use the `overlay` prop to control whether the Slideover has an overlay or not. Defaults to `true`.

::component-code
---
prettier: true
ignore:
  - title
props:
  overlay: false
  title: 'Slideover without overlay'
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

### Transition

Use the `transition` prop to control whether the Slideover is animated or not. Defaults to `true`.

::component-code
---
prettier: true
ignore:
  - title
props:
  transition: false
  title: 'Slideover without transition'
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

### Prevent close

Use the `prevent-close` prop to prevent the Slideover from being closed when clicking outside of it.

::component-code
---
prettier: true
ignore:
  - title
  - preventClose
props:
  preventClose: true
  title: 'Slideover prevent close'
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
name: 'slideover-open-example'
---
::

::note
In this example, leveraging [`defineShortcuts`](/composables/define-shortcuts), you can toggle the Slideover by pressing :kbd{value="O"}.
::

::tip
This allows you to move the trigger outside of the Slideover or remove it entirely.
::

### Programmatic usage

You can use the [`useSlideover`](/composables/use-slideover) composable to open a Slideover programatically.

::warning
Make sure to wrap your app with the [`App`](/components/app) component which uses the [`SlideoverProvider`](https://github.com/nuxt/ui/blob/v3/src/runtime/components/SlideoverProvider.vue) component.
::

First, create a slideover component that will be opened programatically:

::component-example
---
name: 'slideover-example'
preview: false
---
::

Then, use it in your app:

::component-example
---
name: 'slideover-programmatic-example'
---
::

::tip
You can close the slideover within the slideover component by calling `slideover.close()`.
::

### Nested slideovers

You can nest slideovers within each other.

::component-example
---
name: 'slideover-nested-example'
---
::

### With footer slot

Use the `#footer` slot to add content after the Slideover's body.

::component-example
---
name: 'slideover-footer-slot-example'
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
