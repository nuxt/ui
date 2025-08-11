---
description: Display content in a card with a header, body and footer.
category: layout
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Card.vue
---

## Usage

::component-example
---
name: 'card-example'
props:
  class: 'w-full'
---
::

### Variant

Use the `variant` prop to change the variant of the Card.

::component-code
---
prettier: true
hide:
  - class
props:
  variant: subtle
  class: 'w-full'
slots:
  header: |

    <Placeholder class="h-8" />

  default: |

    <Placeholder class="h-32" />

  footer: |

    <Placeholder class="h-8" />
---

#header
:placeholder{class="h-8"}

#default
:placeholder{class="h-32"}

#footer
:placeholder{class="h-8"}
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
