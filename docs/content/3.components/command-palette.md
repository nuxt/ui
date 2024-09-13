---
title: CommandPalette
description: A command palette to search and execute commands with full-text search.
links:
  - label: Combobox
    icon: i-custom-radix-vue
    to: https://www.radix-vue.com/components/combobox.html
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/CommandPalette.vue
navigation:
  badge:
    label: Todo
---

## Usage

Use the `v-model` directive to control the value of the CommandPalette or the `default-value` prop to set the initial value when you do not need to control its state.

::note
You can also use it without any of these and either use the `select` field on each item and/or the `@update:model-value` event to handle the selection.
::

### Groups

Use the `groups` prop as an array of objects with the following properties:

- `id: string`{lang="ts-type"}
- `label?: string`{lang="ts-type"}
- `slot?: string`{lang="ts-type"}
- `items?: CommandPaletteItem[]`{lang="ts-type"}
- `filter?: boolean`{lang="ts-type"}
- `postFilter?: (searchTerm: string, items: T[]) => T[]`{lang="ts-type"}
- `highlightedIcon?: string`{lang="ts-type"}

Each group takes some `items` as an array of objects with the following properties:

- `prefix?: string`{lang="ts-type"}
- `label?: string`{lang="ts-type"}
- `suffix?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `avatar?: AvatarProps`{lang="ts-type"}
- `chip?: ChipProps`{lang="ts-type"}
- `kbds?: string[] | KbdProps[]`{lang="ts-type"}
- `disabled?: boolean`{lang="ts-type"}
- `slot?: string`{lang="ts-type"}
- `select?(e?: Event): void`{lang="ts-type"}

::component-code
---
collapse: true
ignore:
  - groups
  - class
external:
  - groups
class: '!p-0'
props:
  groups:
    - id: 'users'
      label: 'Users'
      items:
        - label: 'John Doe'
          suffix: 'john.doe@example.com'
          icon: 'i-heroicons-user'
        - label: 'Jane Doe'
          suffix: 'jane.doe@example.com'
          icon: 'i-heroicons-user'
        - label: 'John Smith'
          suffix: 'john.smith@example.com'
          icon: 'i-heroicons-user'
  class: 'flex-1'
---
::

### Multiple

Use the `multiple` prop to allow multiple selections.

::component-code
---
collapse: true
ignore:
  - groups
  - class
external:
  - groups
class: '!p-0'
props:
  groups:
    - id: 'actions'
      label: 'Actions'
      items:
        - label: 'Add new file'
          suffix: 'Create a new file in the current directory or workspace.'
          icon: 'i-heroicons-document-plus'
          kbds:
            - 'meta'
            - 'N'
        - label: 'Add new folder'
          suffix: 'Create a new folder in the current directory or workspace.'
          icon: 'i-heroicons-folder-plus'
          kbds:
            - 'meta'
            - 'F'
        - label: 'Add hashtag'
          suffix: 'Add a hashtag to the current item.'
          icon: 'i-heroicons-hashtag'
          kbds:
            - 'meta'
            - 'H'
        - label: 'Add label'
          suffix: 'Add a label to the current item.'
          icon: 'i-heroicons-tag'
          kbds:
            - 'meta'
            - 'L'
  class: 'flex-1'
---
::

### Placeholder

### Icon

### Loading

### Disabled

### Close

## Examples

### Control search term

### Control selected value

### With fetched items

### With filtered items

### Within a modal

### Within a drawer

### Within a popover

### Listen open state

### With custom search

### With highlighted search

### With custom slot

### With empty slot

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
