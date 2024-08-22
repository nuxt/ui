---
description: A drawer that slides in from the bottom of the screen.
links:
  - label: Drawer
    icon: i-custom-radix-vue
    to: https://github.com/radix-vue/vaul-vue
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/benjamincanac/ui3/tree/dev/src/runtime/components/Drawer.vue
---

## Usage

Use a [Button](/components/button) or any other component in the default slot of the Drawer.

Then, use the `#content` slot to add the content displayed when the Drawer is open.

::component-code
---
prettier: true
class: 'justify-center'
slots:
  default: |

    <UButton label="Open" color="gray" variant="subtle" trailing-icon="i-heroicons-chevron-up-20-solid" />

  content: |

    <Placeholder class="h-48" />
---

:u-button{label="Open" color="gray" variant="subtle" trailing-icon="i-heroicons-chevron-up-20-solid"}

#content
:placeholder{class="h-48 m-4"}
::

You can also use the `#header`, `#body` and `#footer` slots to customize the Drawer's content.

### Title

Use the `title` prop to set the title of the Drawer's header.

::component-code
---
prettier: true
class: 'justify-center'
props:
  title: 'Title'
slots:
  default: |

    <UButton label="Open" color="gray" variant="subtle" trailing-icon="i-heroicons-chevron-up-20-solid" />

  body: |

    <Placeholder class="h-48" />
---

:u-button{label="Open" color="gray" variant="subtle" trailing-icon="i-heroicons-chevron-up-20-solid"}

#body
:placeholder{class="h-48"}
::

### Description

Use the `description` prop to set the description of the Drawer's header.

::component-code
---
prettier: true
class: 'justify-center'
ignore:
  - title
props:
  title: 'Title'
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
slots:
  default: |

    <UButton label="Open" color="gray" variant="subtle" trailing-icon="i-heroicons-chevron-up-20-solid" />

  body: |

    <Placeholder class="h-48" />
---

:u-button{label="Open" color="gray" variant="subtle" trailing-icon="i-heroicons-chevron-up-20-solid"}

#body
:placeholder{class="h-48"}
::

### Scale background

Use the `should-scale-background` prop to scale the background when the Drawer is open, creating a visual depth effect.

::component-code
---
prettier: true
class: 'justify-center'
props:
  shouldScaleBackground: true
slots:
  default: |

    <UButton label="Open with scale" color="gray" variant="subtle" trailing-icon="i-heroicons-chevron-up-20-solid" />

  content: |

    <Placeholder class="h-48" />
---

:u-button{label="Open with scale" color="gray" variant="subtle" trailing-icon="i-heroicons-chevron-up-20-solid"}

#content
:placeholder{class="h-screen m-4"}
::

::important
Make sure to add the `vaul-drawer-wrapper` directive to a parent element of your app to make this work.

```vue [app.vue]
<template>
  <UApp>
    <div class="bg-white dark:bg-gray-900" vaul-drawer-wrapper>
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
      'class': 'bg-white dark:bg-gray-900'
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
name: 'drawer-open-example'
class: 'justify-center'
---
::

::note
In this example, press :kbd{value="O"} to toggle the Drawer.
::

### With footer slot

Use the `#footer` slot to add content after the Drawer's body.

::component-example
---
name: 'drawer-footer-slot-example'
class: 'justify-center'
---
::

### With command palette

You can use the [CommandPalette](/components/command-palette) component inside the Drawer.

::component-example
---
collapse: true
name: 'drawer-command-palette-example'
class: 'justify-center'
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
