---
title: ButtonGroup
description: Group multiple button-like elements together.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/ButtonGroup.vue
---

## Usage

Wrap multiple [Button](/components/button) within a ButtonGroup to group them together.

::component-code
---
prettier: true
slots:
  default: |

    <UButton color="neutral" variant="subtle" label="Button" />
    <UButton color="neutral" variant="outline" icon="i-lucide-chevron-down" />
---
:u-button{color="neutral" variant="subtle" label="Button"}
:u-button{color="neutral" variant="outline" icon="i-lucide-chevron-down"}
::

### Size

Use the `size` prop to change the size of all the buttons.

::component-code
---
prettier: true
props:
  size: xl
slots:
  default: |

    <UButton color="neutral" variant="subtle" label="Button" />
    <UButton color="neutral" variant="outline" icon="i-lucide-chevron-down" />
---
:u-button{color="neutral" variant="subtle" label="Button"}
:u-button{color="neutral" variant="outline" icon="i-lucide-chevron-down"}
::

### Orientation

Use the `orientation` prop to change the orientation of the buttons. Defaults to `horizontal`.

::component-code
---
prettier: true
props:
  orientation: vertical
slots:
  default: |

    <UButton color="neutral" variant="subtle" label="Submit" />
    <UButton color="neutral" variant="outline" label="Cancel" />
---
:u-button{color="neutral" variant="subtle" label="Submit"}
:u-button{color="neutral" variant="outline" label="Cancel"}
::

## Examples

### With input

You can use components like [Input](/components/input), [InputMenu](/components/input-menu), [Select](/components/select) [SelectMenu](/components/select-menu), etc. within a button group.

::component-code
---
prettier: true
slots:
  default: |

    <UInput color="neutral" variant="outline" placeholder="Enter token" />

    <UButton color="neutral" variant="subtle" icon="i-lucide-clipboard" />
---
:u-input{color="neutral" variant="outline" placeholder="Enter token"}
:u-button{color="neutral" variant="subtle" icon="i-lucide-clipboard"}
::

### With tooltip

You can use a tooltip within a button group.

:component-example{name="button-group-tooltip-example"}

### With dropdown

You can use a dropdown menu within a button group.

:component-example{name="button-group-dropdown-example"}

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme
