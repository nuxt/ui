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

### Groups

Use the `groups` prop as an array of objects with the following properties:

- `id: string`{lang="ts-type"}
- `label?: string`{lang="ts-type"}
- `slot?: string`{lang="ts-type"}
- [`items?: CommandPaletteItem[]`{lang="ts-type"}](#items)
- `filter?: boolean`{lang="ts-type"}
- `postFilter?: (searchTerm: string, items: T[]) => T[]`{lang="ts-type"}
- `highlightedIcon?: string`{lang="ts-type"}

::caution
You must provide an `id` for each group otherwise the group will be ignored.
::

### Items

Each group takes some `items` as an array of objects with the following properties:

- `prefix?: string`{lang="ts-type"}
- `label?: string`{lang="ts-type"}
- `suffix?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `avatar?: AvatarProps`{lang="ts-type"}
- `chip?: ChipProps`{lang="ts-type"}
- `kbds?: string[] | KbdProps[]`{lang="ts-type"}
- `disabled?: boolean`{lang="ts-type"}
- [`slot?: string`{lang="ts-type"}](#with-custom-slot)
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
  multiple: true
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

Use the `placeholder` prop to change the placeholder text.

::component-code
---
ignore:
  - class
class: '!p-0'
props:
  placeholder: 'Search a user...'
  class: 'flex-1'
---
::

### Icon

Use the `icon` prop to customize the input [Icon](/components/icon). Defaults to `i-heroicons-magnifying-glass-20-solid`.

::component-code
---
ignore:
  - class
class: '!p-0'
props:
  icon: 'i-heroicons-user'
  class: 'flex-1'
---
::

::tip{to="/getting-started/icons#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.search` key.
::

### Loading

Use the `loading` prop to show a loading icon on the CommandPalette.

Use the `loading-icon` prop to customize this icon. Defaults to `i-heroicons-arrow-path-20-solid`.

::component-code
---
ignore:
  - class
class: '!p-0'
props:
  loading: true
  loadingIcon: ''
  class: 'flex-1'
---
::

::tip{to="/getting-started/icons#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.loading` key.
::

### Disabled

Use the `disabled` prop to disable the CommandPalette.

::component-code
---
ignore:
  - class
class: '!p-0'
props:
  disabled: true
  class: 'flex-1'
---
::

### Close

Use the `close` prop to display a [Button](/components/button) to dismiss the CommandPalette.

::tip
An `update:open` event will be emitted when the close button is clicked.
::

Use the `close-icon` prop to customize the button [Icon](/components/icon). Defaults to `i-heroicons-x-mark-20-solid`.

::component-code
---
ignore:
  - class
  - close
class: '!p-0'
props:
  close: true
  closeIcon: ''
  class: 'flex-1'
---
::

::tip{to="/getting-started/icons#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.close` key.
::

You can pass all the props of the [Button](/components/button) component to customize it.

::component-code
---
prettier: true
ignore:
  - close.color
  - close.variant
  - class
class: '!p-0'
props:
  close:
    color: primary
    variant: outline
    class: 'rounded-full'
  class: 'flex-1'
---
::

## Examples

### Control active item(s)

You can control the active item(s) by using the `default-value` prop or the `v-model` directive with the index of the item.

::note
You can also use it without any of these and either use the `select` field on each item and/or the `@update:model-value` event.
::

### Control selected item(s)

### Control search term

### With fetched items

### With filtered items

### Within a modal

You can use the CommandPalette component inside a [Modal](/components/modal)'s content.

::component-example
---
collapse: true
name: 'modal-command-palette-example'
class: 'justify-center'
---
::

### Within a drawer

You can use the CommandPalette component inside a [Drawer](/components/drawer)'s content.

::component-example
---
collapse: true
name: 'drawer-command-palette-example'
class: 'justify-center'
---
::

### Within a popover

You can use the CommandPalette component inside a [Popover](/components/popover)'s content.

::component-example
---
collapse: true
name: 'popover-command-palette-example'
class: 'justify-center'
---
::

### Listen open state

### With custom search

### With highlighted search

### With custom slot

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
