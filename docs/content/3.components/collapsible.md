---
description: A collapsible element to toggle visibility of its content.
links:
  - label: Collapsible
    icon: i-custom-radix-vue
    to: https://www.radix-vue.com/components/collapsible.html
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/benjamincanac/ui3/tree/dev/src/runtime/components/Container.vue
---

## Usage

Use a [Button](/components/button) or any other component in the default slot of the Collapsible.

Then, use the `#content` slot to add the content displayed when the Collapsible is open.

::component-example
---
name: 'collapsible-example'
---
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
In this example, press :kbd{value="O" color="blue"} to toggle the Collapsible.
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
