---
description: A drawer that smoothly slides in & out of the screen.
category: overlay
links:
  - label: Drawer
    icon: i-custom-reka-ui
    to: https://github.com/unovue/vaul-vue
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Drawer.vue
---

## Usage

Use a [Button](/components/button) or any other component in the default slot of the Drawer.

Then, use the `#content` slot to add the content displayed when the Drawer is open.

::component-code
---
prettier: true
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />

  content: |

    <Placeholder class="h-48 m-4" />
---

:u-button{label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up"}

#content
:placeholder{class="h-48 m-4"}
::

You can also use the `#header`{lang="ts-type"}, `#body`{lang="ts-type"} and `#footer`{lang="ts-type"} slots to customize the Drawer's content.

### Title

Use the `title` prop to set the title of the Drawer's header.

::component-code
---
prettier: true
props:
  title: 'Drawer with title'
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />

  body: |

    <Placeholder class="h-48" />
---

:u-button{label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up"}

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

    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />

  body: |

    <Placeholder class="h-48" />
---

:u-button{label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up"}

#body
:placeholder{class="h-48"}
::

### Direction

Use the `direction` prop to control the direction of the Drawer. Defaults to `bottom`.

::component-code
---
prettier: true
props:
  direction: 'right'
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />

  content: |

    <Placeholder class="min-w-96 min-h-96 size-full m-4" />
---

:u-button{label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up"}

#content
:placeholder{class="min-w-96 min-h-96 size-full m-4"}
::

### Inset

Use the `inset` prop to inset the Drawer from the edges.

::component-code
---
prettier: true
props:
  direction: 'right'
  inset: true
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />

  content: |

    <Placeholder class="min-w-96 min-h-96 size-full m-4" />
---

:u-button{label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up"}

#content
:placeholder{class="min-w-96 min-h-96 size-full m-4"}
::

### Handle

Use the `handle` prop to control whether the Drawer has a handle or not. Defaults to `true`.

::component-code
---
prettier: true
props:
  handle: false
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />

  content: |

    <Placeholder class="h-48 m-4" />
---

:u-button{label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up"}

#content
:placeholder{class="h-48 m-4"}
::

### Handle Only

Use the `handle-only` prop to only allow the Drawer to be dragged by the handle.

::component-code
---
prettier: true
props:
  handleOnly: true
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />

  content: |

    <Placeholder class="h-48 m-4" />
---

:u-button{label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up"}

#content
:placeholder{class="h-48 m-4"}
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

    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />

  content: |

    <Placeholder class="h-48 m-4" />
---

:u-button{label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up"}

#content
:placeholder{class="h-48 m-4"}
::

### Scale background

Use the `should-scale-background` prop to scale the background when the Drawer is open, creating a visual depth effect. You can set the `set-background-color-on-scale` prop to `false` to prevent changing the background color.

::component-code
---
prettier: true
props:
  shouldScaleBackground: true
  setBackgroundColorOnScale: true
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />

  content: |

    <Placeholder class="h-48 m-4" />
---

:u-button{label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up"}

#content
:placeholder{class="h-screen m-4"}
::

::warning
Make sure to add the `data-vaul-drawer-wrapper` directive to a parent element of your app to make this work.

```vue [app.vue]
<template>
  <UApp>
    <div class="bg-default" data-vaul-drawer-wrapper>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </UApp>
</template>
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  app: {
    rootAttrs: {
      'data-vaul-drawer-wrapper': '',
      'class': 'bg-default'
    }
  }
})
```

::

## Examples

### Control open state

You can control the open state by using the `default-open` prop or the `v-model:open` directive.

::component-example
---
prettier: true
name: 'drawer-open-example'
---
::

::note
In this example, leveraging [`defineShortcuts`](/composables/define-shortcuts), you can toggle the Drawer by pressing :kbd{value="O"}.
::

::tip
This allows you to move the trigger outside of the Drawer or remove it entirely.
::

### Disable dismissal

Set the `dismissible` prop to `false` to prevent the Drawer from being closed when clicking outside of it or pressing escape.

::component-example
---
prettier: true
name: 'drawer-dismissible-example'
---
::

::note
In this example, the `header` slot is used to add a close button which is not done by default.
::

### With interactive background

Set the `overlay` and `modal` props to `false` alongside the `dismissible` prop to make the Drawer's background interactive without closing the Drawer.

::component-example
---
prettier: true
name: 'drawer-modal-example'
---
::

### Responsive drawer

You can render a [Modal](/components/modal) component on desktop and a Drawer on mobile for example.

::component-example
---
prettier: true
name: 'drawer-responsive-example'
---
::

### Nested drawers :badge{label="New" class="align-text-top"}

You can nest drawers within each other by using the `nested` prop.

::component-example
---
prettier: true
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

You can use a [CommandPalette](/components/command-palette) component inside the Drawer's content.

::component-example
---
collapse: true
name: 'drawer-command-palette-example'
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
