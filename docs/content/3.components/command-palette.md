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
---

## Usage

The CommandPalette component leverages [Fuse.js](https://fusejs.io/) to provide robust and efficient fuzzy search functionality.

### Groups

When searching for a command, the groups are filtered and the matching commands are presented in order of relevance. Use the `groups` prop as an array of objects with the following properties:

- `id: string`{lang="ts-type"}
- `label?: string`{lang="ts-type"}
- `slot?: string`{lang="ts-type"}
- `items?: CommandPaletteItem[]`{lang="ts-type"}
- [`filter?: boolean`{lang="ts-type"}](#without-internal-search)
- [`postFilter?: (searchTerm: string, items: T[]) => T[]`{lang="ts-type"}](#with-post-filtered-items)
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
    - id: 'suggestions'
      label: 'Suggestions'
      items:
        - label: 'Calendar'
          icon: 'i-heroicons-calendar'
        - label: 'Music'
          icon: 'i-heroicons-musical-note'
        - label: 'Maps'
          icon: 'i-heroicons-map'
    - id: 'actions'
      items:
        - label: 'Add new file'
          suffix: 'Create a new file in the current directory or workspace.'
          icon: 'i-heroicons-document-plus'
          kbds:
            - meta
            - N
        - label: 'Add new folder'
          suffix: 'Create a new folder in the current directory or workspace.'
          icon: 'i-heroicons-folder-plus'
          kbds:
            - meta
            - F
        - label: 'Add hashtag'
          suffix: 'Add a hashtag to the current item.'
          icon: 'i-heroicons-hashtag'
          kbds:
            - meta
            - H
        - label: 'Add label'
          suffix: 'Add a label to the current item.'
          icon: 'i-heroicons-tag'
          kbds:
            - meta
            - L
  class: 'flex-1 max-h-80'
---
::

::caution
You must provide an `id` for each group otherwise the group will be ignored.
::

### Placeholder

Use the `placeholder` prop to change the placeholder text.

::component-code
---
collapse: true
ignore:
  - class
  - groups
external:
  - groups
class: '!p-0'
props:
  placeholder: 'Search an app...'
  groups:
    - id: 'apps'
      items:
        - label: 'Calendar'
          icon: 'i-heroicons-calendar'
        - label: 'Music'
          icon: 'i-heroicons-musical-note'
        - label: 'Maps'
          icon: 'i-heroicons-map'
  class: 'flex-1'
---
::

### Icon

Use the `icon` prop to customize the input [Icon](/components/icon). Defaults to `i-heroicons-magnifying-glass-20-solid`.

::component-code
---
collapse: true
ignore:
  - class
  - groups
external:
  - groups
class: '!p-0'
props:
  icon: 'i-heroicons-cube'
  groups:
    - id: 'apps'
      items:
        - label: 'Calendar'
          icon: 'i-heroicons-calendar'
        - label: 'Music'
          icon: 'i-heroicons-musical-note'
        - label: 'Maps'
          icon: 'i-heroicons-map'
  class: 'flex-1'
---
::

::tip{to="/getting-started/icons#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.search` key.
::

### Loading

Use the `loading` prop to show a loading icon on the CommandPalette.

::component-code
---
collapse: true
ignore:
  - class
  - groups
external:
  - groups
class: '!p-0'
props:
  loading: true
  groups:
    - id: 'apps'
      items:
        - label: 'Calendar'
          icon: 'i-heroicons-calendar'
        - label: 'Music'
          icon: 'i-heroicons-musical-note'
        - label: 'Maps'
          icon: 'i-heroicons-map'
  class: 'flex-1'
---
::

### Loading Icon

Use the `loading-icon` prop to customize the loading icon. Defaults to `i-heroicons-arrow-path-20-solid`.

::component-code
---
collapse: true
ignore:
  - class
  - groups
external:
  - groups
class: '!p-0'
props:
  loading: true
  loadingIcon: 'i-heroicons-arrow-path-rounded-square'
  groups:
    - id: 'apps'
      items:
        - label: 'Calendar'
          icon: 'i-heroicons-calendar'
        - label: 'Music'
          icon: 'i-heroicons-musical-note'
        - label: 'Maps'
          icon: 'i-heroicons-map'
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
collapse: true
ignore:
  - groups
  - class
external:
  - groups
class: '!p-0'
props:
  disabled: true
  groups:
    - id: 'apps'
      items:
        - label: 'Calendar'
          icon: 'i-heroicons-calendar'
        - label: 'Music'
          icon: 'i-heroicons-musical-note'
        - label: 'Maps'
          icon: 'i-heroicons-map'
  class: 'flex-1'
---
::

### Close

Use the `close` prop to display a [Button](/components/button) to dismiss the CommandPalette.

::tip
An `update:open` event will be emitted when the close button is clicked.
::

::component-code
---
collapse: true
ignore:
  - class
  - groups
  - close
external:
  - groups
class: '!p-0'
props:
  close: true
  groups:
    - id: 'apps'
      items:
        - label: 'Calendar'
          icon: 'i-heroicons-calendar'
        - label: 'Music'
          icon: 'i-heroicons-musical-note'
        - label: 'Maps'
          icon: 'i-heroicons-map'
  class: 'flex-1'
---
::

You can also pass all the props of the [Button](/components/button) component to customize it.

::component-code
---
collapse: true
prettier: true
ignore:
  - close.color
  - close.variant
  - groups
  - class
external:
  - groups
class: '!p-0'
props:
  close:
    color: primary
    variant: outline
    class: 'rounded-full'
  groups:
    - id: 'apps'
      items:
        - label: 'Calendar'
          icon: 'i-heroicons-calendar'
        - label: 'Music'
          icon: 'i-heroicons-musical-note'
        - label: 'Maps'
          icon: 'i-heroicons-map'
  class: 'flex-1'
---
::

### Close Icon

Use the `close-icon` prop to customize the close button [Icon](/components/icon). Defaults to `i-heroicons-x-mark-20-solid`.

::component-code
---
collapse: true
ignore:
  - class
  - groups
  - close
external:
  - groups
class: '!p-0'
props:
  close: true
  closeIcon: 'i-heroicons-arrow-right'
  groups:
    - id: 'apps'
      items:
        - label: 'Calendar'
          icon: 'i-heroicons-calendar'
        - label: 'Music'
          icon: 'i-heroicons-musical-note'
        - label: 'Maps'
          icon: 'i-heroicons-map'
  class: 'flex-1'
---
::

::tip{to="/getting-started/icons#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.close` key.
::

## Examples

### Control selected item(s)

You can control the selected item by using the `default-value` prop or the `v-model` directive.

::component-example
---
collapse: true
name: 'command-palette-model-value-example'
class: '!p-0'
---
::

::tip
You can also use the `select` field on each item and/or the `@update:model-value` event.
::

Use the `multiple` prop to allow multiple selections.

::component-example
---
collapse: true
name: 'command-palette-model-value-multiple-example'
class: '!p-0'
---
::

::caution
Ensure to pass an array to the `default-value` prop or the `v-model` directive.
::

### Control search term

Use the `v-model:search-term` directive to control the search term.

::component-example
---
collapse: true
name: 'command-palette-search-term-example'
class: '!p-0'
---
::

### With fetched items

You can fetch items from an API and use them in the CommandPalette.

::component-example
---
collapse: true
name: 'command-palette-fetch-example'
class: '!p-0'
---
::

### Without internal search

You can set the `filter` field to `false` on a group to disable the internal search and use your own search logic.

::component-example
---
collapse: true
name: 'command-palette-filter-example'
class: '!p-0'
---
::

::note
This example uses [refDebounced](https://vueuse.org/shared/refDebounced/#refdebounced) to debounce the API calls.
::

### With post-filtered items

You can use the `postFilter` field on a group to filter items after the search happened.

::component-example
---
collapse: true
name: 'command-palette-post-filter-example'
class: '!p-0'
---
::

::note
Start typing to see items with higher level appear.
::

### With custom fuse search

You can use the `fuse` prop to override the options of [useFuse](https://vueuse.org/integrations/useFuse) which defaults to:

```ts
{
  fuseOptions: {
    ignoreLocation: true,
    threshold: 0.1,
    keys: ['label', 'suffix']
  },
  resultLimit: 12,
  matchAllWhenSearchEmpty: true
}
```

::tip
The `fuseOptions` are the options of [Fuse.js](https://www.fusejs.io/api/options.html), the `resultLimit` is the maximum number of results to return and the `matchAllWhenSearchEmpty` is a boolean to match all items when the search term is empty.
::

You can for example set `{ fuseOptions: { includeMatches: true } }`{lang="ts-type"} to highlight the search term in the items.

::component-example
---
collapse: true
name: 'command-palette-fuse-example'
class: '!p-0'
---
::

### Within a popover

You can use the CommandPalette component inside a [Popover](/components/popover)'s content.

::component-example
---
collapse: true
name: 'popover-command-palette-example'
---
::

### Within a modal

You can use the CommandPalette component inside a [Modal](/components/modal)'s content.

::component-example
---
collapse: true
name: 'modal-command-palette-example'
---
::

### Within a drawer

You can use the CommandPalette component inside a [Drawer](/components/drawer)'s content.

::component-example
---
collapse: true
name: 'drawer-command-palette-example'
---
::

### Listen open state

When using the `close` prop, you can listen to the `update:open` event when the button is clicked.

::component-example
---
collapse: true
name: 'command-palette-open-example'
---
::

::note
This can be useful when using the CommandPalette inside a [Modal](/components/modal) for example.
::

### With custom slot

Use the `slot` property to customize a specific item or group.

You will have access to the following slots:

- `#{{ item.slot }}`{lang="ts-type"}
- `#{{ item.slot }}-leading`{lang="ts-type"}
- `#{{ item.slot }}-label`{lang="ts-type"}
- `#{{ item.slot }}-trailing`{lang="ts-type"}

- `#{{ group.slot }}`{lang="ts-type"}
- `#{{ group.slot }}-leading`{lang="ts-type"}
- `#{{ group.slot }}-label`{lang="ts-type"}
- `#{{ group.slot }}-trailing`{lang="ts-type"}

::component-example
---
name: 'command-palette-custom-slot-example'
class: '!p-0'
---
::

::tip{to="#slots"}
You can also use the `#item`, `#item-leading`, `#item-label` and `#item-trailing` slots to customize all items.
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
