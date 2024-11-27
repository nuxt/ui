---
description: A popup that reveals information when hovering over an element.
links:
  - label: Tooltip
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/tooltip
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Tooltip.vue
---

## Usage

Use a [Button](/components/button) or any other component in the default slot of the Tooltip.

::warning
Make sure to wrap your app with the [`App`](/components/app) component which uses the [`TooltipProvider`](https://reka-ui.com/docs/components/tooltip#provider) component from Reka UI.
::

::tip{to="/components/app#props"}
You can check the `App` component `tooltip` prop to see how to configure the Tooltip globally.
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

    <UButton label="Open" color="neutral" variant="subtle" />
---

:u-button{label="Open" color="neutral" variant="subtle"}
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

    <UButton label="Open" color="neutral" variant="subtle" />
---

:u-button{label="Open" color="neutral" variant="subtle"}
::

::tip
You can use special keys like `meta` that displays as `⌘` on macOS and `Ctrl` on other platforms.
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

    <UButton label="Open" color="neutral" variant="subtle" />
---

:u-button{label="Open" color="neutral" variant="subtle"}
::

::tip
This can be configured globally through the `tooltip.delayDuration` option in the [`App`](/components/app) component.
::

### Content

Use the `content` prop to control how the Tooltip content is rendered, like its `align` or `side` for example.

::component-code
---
prettier: true
ignore:
  - text
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
  text: 'Open on GitHub'
slots:
  default: |

    <UButton label="Open" color="neutral" variant="subtle" />
---

:u-button{label="Open" color="neutral" variant="subtle"}
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

    <UButton label="Open" color="neutral" variant="subtle" />
---

:u-button{label="Open" color="neutral" variant="subtle"}
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

    <UButton label="Open" color="neutral" variant="subtle" />
---

:u-button{label="Open" color="neutral" variant="subtle"}
::

## Examples

### Control open state

You can control the open state by using the `default-open` prop or the `v-model:open` directive.

::component-example
---
name: 'tooltip-open-example'
---
::

::note
In this example, leveraging [`defineShortcuts`](/composables/define-shortcuts), you can toggle the Tooltip by pressing :kbd{value="O"}.
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
