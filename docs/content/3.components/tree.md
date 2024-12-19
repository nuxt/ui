---
description:
links: 
  - label: Tree
    icon: i-custom-radix-vue
    to: https://www.radix-vue.com/components/tree.html
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Tree.vue
---

## Usage

### Items

::component-code
---
ignore:
  - items
external:
  - items
props:
  items:
    - label: Node 1
      children:
        - label: Node 1.1
        - label: Node 1.2
        - label: Node 1.3
          children:
            - label: Node 1.3.1
            - label: Node 1.3.2
    - label: Node 2
      children:
        - label: Node 2.1
        - label: Node 2.2
    - label: Node 3
---
::

## Examples

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

## Theme

:component-theme
