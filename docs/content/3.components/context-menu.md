---
title: ContextMenu
description: A menu to display actions when right-clicking on an element.
links:
  - label: ContextMenu
    icon: i-custom-radix-vue
    to: https://www.radix-vue.com/components/context-menu.html
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/ContextMenu.vue
---

## Usage

Use anything you like in the default slot of the ContextMenu, and right-click on it to display the menu.

### Items

Use the `items` prop as an array of objects with the following properties:

- `label?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `avatar?: AvatarProps`{lang="ts-type"}
- `kbds?: string[] | KbdProps[]`{lang="ts-type"}
- `type?: "link" | "label" | "separator"`{lang="ts-type"}
- `disabled?: boolean`{lang="ts-type"}
- `class?: any`{lang="ts-type"}
- [`slot?: string`{lang="ts-type"}](#with-custom-slot)
- `select?(e: Event): void`{lang="ts-type"}

You can also pass any property from the [Link](/components/link#props) component such as `to`, `target`, etc.

::component-code
---
prettier: true
collapse: true
ignore:
  - items
  - class
external:
  - items
class: 'justify-center'
props:
  items:
    - - label: Appearance
        children:
          - label: System
            icon: i-heroicons-computer-desktop
          - label: Light
            icon: i-heroicons-sun
          - label: Dark
            icon: i-heroicons-moon
    - - label: Show Sidebar
        kbds:
          - meta
          - s
      - label: Show Toolbar
        kbds:
          - shift
          - meta
          - d
      - label: Collapse Pinned Tabs
        disabled: true
    - - label: Refresh the Page
      - label: Clear Cookies and Refresh
      - label: Clear Cache and Refresh
      - type: separator
      - label: Developer
        children:
          - - label: View Source
              kbds:
                - meta
                - shift
                - u
            - label: Developer Tools
              kbds:
                - option
                - meta
                - i
            - label: Inspect Elements
              kbds:
                - option
                - meta
                - c
          - - label: JavaScript Console
              kbds:
                - option
                - meta
                - j
  class: 'w-48'
slots:
  default: |

    <div class="flex items-center justify-center rounded-md border border-dashed border-gray-300 dark:border-gray-700 text-sm aspect-video w-72">
      Right click here
    </div>
---

:div{class="flex items-center justify-center rounded-md border border-dashed border-gray-300 dark:border-gray-700 text-sm aspect-video w-72"}[Right click here]
::

::note
You can pass an array of arrays to the `items` prop to create separated groups of items.
::

::tip
Each item can take a `children` array of objects with the same properties as the `items` prop to create a nested menu which can be controlled using the `open`, `defaultOpen` and `content` properties.
::

### Size

Use the `size` prop to change the size of the ContextMenu.

::component-code
---
prettier: true
ignore:
  - items
  - class
external:
  - items
class: 'justify-center'
props:
  size: xl
  items:
    - label: System
      icon: i-heroicons-computer-desktop
    - label: Light
      icon: i-heroicons-sun
    - label: Dark
      icon: i-heroicons-moon
  class: 'w-48'
slots:
  default: |

    <div class="flex items-center justify-center rounded-md border border-dashed border-gray-300 dark:border-gray-700 text-sm aspect-video w-72">
      Right click here
    </div>
---

:div{class="flex items-center justify-center rounded-md border border-dashed border-gray-300 dark:border-gray-700 text-sm aspect-video w-72"}[Right click here]
::

### Disabled

Use the `disabled` prop to disable the ContextMenu.

::component-code
---
prettier: true
ignore:
  - items
  - class
external:
  - items
class: 'justify-center'
props:
  disabled: true
  items:
    - label: System
      icon: i-heroicons-computer-desktop
    - label: Light
      icon: i-heroicons-sun
    - label: Dark
      icon: i-heroicons-moon
  class: 'w-48'
slots:
  default: |

    <div class="flex items-center justify-center rounded-md border border-dashed border-gray-300 dark:border-gray-700 text-sm aspect-video w-72">
      Right click here
    </div>
---

:div{class="flex items-center justify-center rounded-md border border-dashed border-gray-300 dark:border-gray-700 text-sm aspect-video w-72"}[Right click here]
::

## Examples

### With custom slot

Use the `slot` property to customize a specific item.

You will have access to the following slots:

- `#{{ item.slot }}`{lang="ts-type"}
- `#{{ item.slot }}-leading`{lang="ts-type"}
- `#{{ item.slot }}-label`{lang="ts-type"}
- `#{{ item.slot }}-trailing`{lang="ts-type"}

::component-example
---
name: 'context-menu-custom-slot-example'
class: 'justify-center'
---
::

::tip{to="#slots"}
You can also use the `#item`, `#item-leading`, `#item-label` and `#item-trailing` slots to customize all items.
::

### Extract shortcuts

When you have some items with `kbds` property (displaying some [Kbd](/components/kbd)), you can easily make them work with the [defineShortcuts](/composables/define-shortcuts) composable.

Inside the `defineShortcuts` composable, there is an `extractShortcuts` utility that will extract the shortcuts recursively from the items and return an object that you can pass to `defineShortcuts`. It will automatically call the `select` function of the item when the shortcut is pressed.

```vue
<script setup lang="ts">
const items = [
  [{
    label: 'Show Sidebar',
    kbds: ['meta', 'S'],
    select() {
      console.log('Show Sidebar clicked')
    }
  }, {
    label: 'Show Toolbar',
    kbds: ['shift', 'meta', 'D'],
    select() {
      console.log('Show Toolbar clicked')
    }
  }, {
    label: 'Collapse Pinned Tabs',
    disabled: true
  }], [{
    label: 'Refresh the Page'
  }, {
    label: 'Clear Cookies and Refresh'
  }, {
    label: 'Clear Cache and Refresh'
  }, {
    type: 'separator' as const
  }, {
    label: 'Developer',
    children: [[{
      label: 'View Source',
      kbds: ['option', 'meta', 'U'],
      select() {
        console.log('View Source clicked')
      }
    }, {
      label: 'Developer Tools',
      kbds: ['option', 'meta', 'I'],
      select() {
        console.log('Developer Tools clicked')
      }
    }], [{
      label: 'Inspect Elements',
      kbds: ['option', 'meta', 'C'],
      select() {
        console.log('Inspect Elements clicked')
      }
    }], [{
      label: 'JavaScript Console',
      kbds: ['option', 'meta', 'J'],
      select() {
        console.log('JavaScript Console clicked')
      }
    }]]
  }]
]

defineShortcuts(extractShortcuts(items))
</script>
```

::note
In this example, :kbd{value="meta"} :kbd{value="S"}, :kbd{value="shift"} :kbd{value="meta"} :kbd{value="D"}, :kbd{value="option"} :kbd{value="meta"} :kbd{value="U"}, :kbd{value="option"} :kbd{value="meta"} :kbd{value="I"}, :kbd{value="option"} :kbd{value="meta"} :kbd{value="C"} and :kbd{value="option"} :kbd{value="meta"} :kbd{value="J"} would trigger the `select` function of the corresponding item.
::

## API

### Props

::component-props
---
ignore:
  - as
  - to
  - target
  - active
  - activeClass
  - inactiveClass
  - exactActiveClass
  - ariaCurrentValue
  - href
  - rel
  - noRel
  - prefetch
  - prefetchOn
  - noPrefetch
  - prefetchedClass
  - replace
  - exact
  - exactQuery
  - exactHash
  - external
---
::

### Slots

:component-slots

### Emits

:component-emits

## Theme

:component-theme
