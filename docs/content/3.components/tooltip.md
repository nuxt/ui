---
description: A popup that reveals information when hovering over an element.
links:
  - label: Tooltip
    icon: i-custom-radix-vue
    to: https://www.radix-vue.com/components/tooltip.html
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/benjamincanac/ui3/tree/dev/src/runtime/components/Tooltip.vue
---

## Usage

Use a [Button](/components/button) or any other component in the default slot of the Tooltip.

::important
Make sure to wrap your app with the [`App`](/components/app) component to make the Tooltip work properly.
::

### Text

Use the `text` prop to set the content of the Tooltip.

::component-code
---
prettier: true
props:
  text: 'Open on GitHub'
slots:
  default: |

    <UButton icon="i-simple-icons-github" />
---

:u-button{icon="i-simple-icons-github"}
::

### Kbds

Use the `kbds` prop to render [Kbd](/components/kbd) components in the Tooltip.

::component-code
---
prettier: true
ignore:
  - text
  - kbds
props:
  text: 'Open on GitHub'
  kbds:
    - meta
    - G
slots:
  default: |

    <UButton icon="i-simple-icons-github" />
---

:u-button{icon="i-simple-icons-github"}
::

::tip
You can use special keys there like `meta` that will display as `⌘` on macOS and `Ctrl` on other platforms.
::

### Delay

Use the `delay-duration` prop to change the delay before the Tooltip appears. For example, you can make it appear instantly by setting it to `0`.

::component-code
---
prettier: true
ignore:
  - text
props:
  delayDuration: 0
  text: 'Open on GitHub'
slots:
  default: |

    <UButton icon="i-simple-icons-github" />
---

:u-button{icon="i-simple-icons-github"}
::

::tip
This can be configured globally through the `tooltip.delayDuration` option in the [`App`](/components/app) component.
::

### Arrow

Use the `arrow` prop to display an arrow on the Tooltip.

::component-code
---
prettier: true
ignore:
  - text
  - arrow
props:
  arrow: true
  text: 'Open on GitHub'
slots:
  default: |

    <UButton icon="i-simple-icons-github" />
---

:u-button{icon="i-simple-icons-github"}
::

### Content

Use the `content` prop to control how the Tooltip content is rendered, like its side for example.

::component-code
---
prettier: true
ignore:
  - text
items:
  content.side:
    - right
    - left
    - top
    - bottom
props:
  content:
    side: right
    sideOffset: 8
  text: 'Open on GitHub'
slots:
  default: |

    <UButton icon="i-simple-icons-github" />
---

:u-button{icon="i-simple-icons-github"}
::

### Disabled

Use the `disabled` prop to disable the Tooltip.

::component-code
---
prettier: true
ignore:
  - text
props:
  disabled: true
  text: 'Open on GitHub'
slots:
  default: |

    <UButton icon="i-simple-icons-github" />
---

:u-button{icon="i-simple-icons-github"}
::

## Examples

### Control open state

You can control the open state by using the `default-open` prop or the `v-model:open` directive.

::component-example
---
name: 'tooltip-open-example'
props:
  class: 'w-full'
---
::

::note
In this example, press :kbd{value="O"} to toggle the Tooltip.
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
