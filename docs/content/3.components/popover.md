---
description: A non-modal dialog that floats around a trigger element.
links:
  - label: Popover
    icon: i-custom-radix-vue
    to: https://www.radix-vue.com/components/popover.html
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Popover.vue
---

## Usage

Use a [Button](/components/button) or any other component in the default slot of the Popover.

Then, use the `#content` slot to add the content displayed when the Popover is open.

::component-code
---
prettier: true
class: 'justify-center'
slots:
  default: |

    <UButton label="Open" color="gray" variant="subtle" />

  content: |

    <Placeholder class="size-48 m-4 inline-flex" />
---

:u-button{label="Open" color="gray" variant="subtle"}

#content
:placeholder{class="size-48 m-4 inline-flex"}
::

### Mode

Use the `mode` prop to change the mode of the Popover. Defaults to `click`.

::component-code
---
prettier: true
class: 'justify-center'
items:
  mode:
    - click
    - hover
props:
  mode: 'hover'
slots:
  default: |

    <UButton label="Open" color="gray" variant="subtle" />

  content: |

    <Placeholder class="size-48 m-4 inline-flex" />
---

:u-button{label="Open" color="gray" variant="subtle"}

#content
:placeholder{class="size-48 m-4 inline-flex"}
::

::note
When using the `hover` mode, the Radix Vue [HoverCard](https://www.radix-vue.com/components/hover-card.html) component is used instead of the [Popover](https://www.radix-vue.com/components/popover.html).
::

### Delay

When using the `hover` mode, you can use the `open-delay` and `close-delay` props to control the delay before the Popover is opened or closed.

::component-code
---
prettier: true
class: 'justify-center'
ignore:
  - mode
props:
  mode: 'hover'
  openDelay: 500
  closeDelay: 300
slots:
  default: |

    <UButton label="Open" color="gray" variant="subtle" />

  content: |

    <Placeholder class="size-48 m-4 inline-flex" />
---

:u-button{label="Open" color="gray" variant="subtle"}

#content
:placeholder{class="size-48 m-4 inline-flex"}
::

### Content

Use the `content` prop to control how the Popover content is rendered, like its `align` or `side` for example.

::component-code
---
prettier: true
class: 'justify-center'
items:
  content.align:
    - start
    - center
    - end
  content.side:
    - right
    - left
    - top
    - bottom
props:
  content:
    align: center
    side: bottom
    sideOffset: 8
slots:
  default: |

    <UButton label="Open" color="gray" variant="subtle" />

  content: |

    <Placeholder class="size-48 m-4 inline-flex" />
---

:u-button{label="Open" color="gray" variant="subtle"}

#content
:placeholder{class="size-48 m-4 inline-flex"}
::

### Arrow

Use the `arrow` prop to display an arrow on the Popover.

::component-code
---
prettier: true
class: 'justify-center'
ignore:
  - arrow
props:
  arrow: true
slots:
  default: |

    <UButton label="Open" color="gray" variant="subtle" />

  content: |

    <Placeholder class="size-48 m-4 inline-flex" />
---

:u-button{label="Open" color="gray" variant="subtle"}

#content
:placeholder{class="size-48 m-4 inline-flex"}
::

## Examples

### Control open state

You can control the open state by using the `default-open` prop or the `v-model:open` directive.

::component-example
---
name: 'popover-open-example'
class: 'justify-center'
---
::

::note
In this example, press :kbd{value="O"} to toggle the Popover.
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
