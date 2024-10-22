---
description: A collapsible element to toggle visibility of its content.
links:
  - label: Collapsible
    icon: i-custom-radix-vue
    to: https://www.radix-vue.com/components/collapsible.html
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Collapsible.vue
---

## Usage

Use a [Button](/components/button) or any other component in the default slot of the Collapsible.

Then, use the `#content` slot to add the content displayed when the Collapsible is open.

::component-code
---
prettier: true
ignore:
  - class
props:
  class: 'flex flex-col gap-2 w-48'
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-heroicons-chevron-down-20-solid" block />

  content: |

    <Placeholder class="h-48" />
---

:u-button{label="Open" color="neutral" variant="subtle" trailing-icon="i-heroicons-chevron-down-20-solid" block}

#content
:placeholder{class="h-48"}
::

### Disabled

Use the `disabled` prop to disable the Collapsible.

::component-code
---
prettier: true
ignore:
  - class
props:
  class: 'flex flex-col gap-2 w-48'
  disabled: true
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-heroicons-chevron-down-20-solid" block />

  content: |

    <Placeholder class="h-48" />
---

:u-button{label="Open" color="neutral" variant="subtle" trailing-icon="i-heroicons-chevron-down-20-solid" block}

#content
:placeholder{class="h-48"}
::

## Examples

### Control open state

You can control the open state by using the `default-open` prop or the `v-model:open` directive.

::component-example
---
name: 'collapsible-open-example'
---
::

::note
In this example, leveraging [defineShortcuts](/composables/define-shortcuts), you can toggle the Collapsible by pressing :kbd{value="O"}.
::

::tip
This allows you to move the trigger outside of the Collapsible or remove it entirely.
::

### With rotating icon

Here is an example with a rotating icon in the Button that indicates the open state of the Collapsible.

::component-example
---
name: 'collapsible-icon-example'
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
