---
description: A drawer that smoothly slides in & out of the screen.
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
items:
  direction:
    - top
    - bottom
props:
  direction: 'top'
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />

  content: |

    <Placeholder class="h-96 m-4" />
---

:u-button{label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up"}

#content
:placeholder{class="h-96 m-4"}
::

::component-code
---
prettier: true
items:
  direction:
    - right
    - left
props:
  direction: 'right'
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />

  content: |

    <Placeholder class="w-96 m-4" />
---

:u-button{label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up"}

#content
:placeholder{class="w-96 m-4"}
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

Use the `should-scale-background` prop to scale the background when the Drawer is open, creating a visual depth effect.

::component-code
---
prettier: true
props:
  shouldScaleBackground: true
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
Make sure to add the `vaul-drawer-wrapper` directive to a parent element of your app to make this work.

```vue [app.vue]
<template>
  <UApp>
    <div class="bg-[var(--ui-bg)]" vaul-drawer-wrapper>
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
      'vaul-drawer-wrapper': '',
      'class': 'bg-[var(--ui-bg)]'
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
