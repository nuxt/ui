---
title: SelectMenu
description: Display a select menu with advanced features.
links:
  - label: 'Listbox'
    icon: i-simple-icons-headlessui
    to: 'https://headlessui.com/v1/vue/listbox'
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/forms/SelectMenu.vue
---

## Usage

The `SelectMenu` component renders by default a [Select](/components/select) component and is based on the `ui.select` preset. You can use most of the `Select` props to configure the display if you don't want to override the default slot such as [color](/components/select#style), [variant](/components/select#style), [size](/components/select#size), [placeholder](/components/select#placeholder), [icon](/components/select#icon), [disabled](/components/select#disabled), etc.

You can use the `ui` prop like the `Select` component to override the default config. The `uiMenu` prop can be used to override the default menu config.

Like the `Select` component, you can use the `options` prop to pass an array of strings or objects.

::component-example
---
component: 'select-menu-example-basic'
componentProps:
  class: 'w-full lg:w-48'
---
::

### Multiple

You can use the `multiple` prop to select multiple values.

::component-example
---
component: 'select-menu-example-multiple'
componentProps:
  class: 'w-full lg:w-48'
---
::

### Objects

You can pass an array of objects to `options` and either compare on the whole object or use the `by` prop to compare on a specific key. You can configure which field will be used to display the label through the `option-attribute` prop that defaults to `label`. Additionally, you can use dot notation (e.g., `user.name`) to access nested object properties.

::component-example
---
component: 'select-menu-example-objects'
componentProps:
  class: 'w-full lg:w-48'
---
::

If you only want to select a single object property rather than the whole object as value, you can set the `value-attribute` property. This prop defaults to `null`.The value of the `value-attribute` field in options must be unique.

::component-example
---
component: 'select-menu-example-objects-value-attribute'
componentProps:
  class: 'w-full lg:w-48'
---
::

### Icon

Use the `selected-icon` prop to set a different icon or change it globally in `ui.selectMenu.default.selectedIcon`. Defaults to `i-heroicons-check-20-solid`.

::component-card
---
baseProps:
  class: 'w-full lg:w-48'
  placeholder: 'Select a person'
  options: ['Wade Cooper', 'Arlene Mccoy', 'Devon Webb', 'Tom Cook', 'Tanya Fox', 'Hellen Schmidt', 'Caroline Schultz', 'Mason Heaney', 'Claudie Smitham', 'Emil Schaefer']
props:
  selectedIcon: 'i-heroicons-hand-thumb-up-solid'
excludedProps:
  - selectedIcon
---
::

::callout{icon="i-heroicons-light-bulb"}
Learn how to customize icons from the [Select](/components/select#icon) component.
::

## Searchable

Use the `searchable` prop to enable search.

Use the `searchable-placeholder` prop to set a different placeholder or globally through the `ui.selectMenu.default.searchablePlaceholder.label` config. Defaults to `Search...`.

This will use Headless UI [Combobox](https://headlessui.com/v1/vue/combobox) component instead of [Listbox](https://headlessui.com/v1/vue/listbox).

::component-card
---
baseProps:
  class: 'w-full lg:w-48'
  placeholder: 'Select a person'
  options: ['Wade Cooper', 'Arlene Mccoy', 'Devon Webb', 'Tom Cook', 'Tanya Fox', 'Hellen Schmidt', 'Caroline Schultz', 'Mason Heaney', 'Claudie Smitham', 'Emil Schaefer']
props:
  searchable: true
  searchablePlaceholder: 'Search a person...'
---
::

### Attributes

Use the `search-attributes` prop with an array of property names to search on each option object. Nested attributes can be accessed using `dot.notation`. When the property value is an array or object, these are cast to string so these can be searched within.

::component-example
---
component: 'select-menu-example-search-attributes'
componentProps:
  class: 'w-full lg:w-48'
---
::

### Clear on close

By default, the search query will be kept after the menu is closed. To clear it on close, set the `clear-search-on-close` prop.

You can also configure this globally through the `ui.selectMenu.default.clearSearchOnClose` config. Defaults to `false`.

::component-card
---
baseProps:
  class: 'w-full lg:w-48'
  placeholder: 'Select a person'
  searchable: true
  searchablePlaceholder: 'Search a person...'
  options: ['Wade Cooper', 'Arlene Mccoy', 'Devon Webb', 'Tom Cook', 'Tanya Fox', 'Hellen Schmidt', 'Caroline Schultz', 'Mason Heaney', 'Claudie Smitham', 'Emil Schaefer']
props:
  clearSearchOnClose: true
---
::

### Control the query

Use a `v-model:query` to control the search query.

::component-example
---
component: 'select-menu-example-search-query'
componentProps:
  class: 'w-full lg:w-48'
---
::

### Async search

Pass a function to the `searchable` prop to customize the search behavior and filter options according to your needs. The function will receive the query as its first argument and should return an array.

Use the `debounce` prop to adjust the delay of the function.

Use the `searchableLazy` prop to control the immediacy of data requests.

::component-example
---
component: 'select-menu-example-search-async'
componentProps:
  class: 'w-full lg:w-48'
---
::

## Creatable

Use the `creatable` prop to enable the creation of new options when the search doesn't return any results (only works with `searchable`).

Try to search for something that doesn't exist in the example below.

::component-example
---
component: 'select-menu-example-creatable'
componentProps:
  class: 'w-full lg:w-48'
---
::

However, if you want to create options despite search query (apart from exact match), you can set the `show-create-option-when` prop to `'always'`.

You can also configure this globally through the `ui.selectMenu.default.showCreateOptionWhen` config. Defaults to `empty`.

Try to search for something that exists in the example below, but not an exact match.

::component-example
---
component: 'select-menu-example-creatable-always'
componentProps:
  class: 'w-full lg:w-48'
---
::

Pass a function to the `show-create-option-when` prop to control wether or not to show the create option. This function takes two arguments: the query (as the first argument) and an array of current results (as the second argument). It should return true to display the create option.

The example below shows how to make the create option visible when the query is at least three characters long and does not exactly match any of the current results (case insensitive).

::component-example
---
component: 'select-menu-example-creatable-function'
componentProps:
  class: 'w-full lg:w-48'
---
::

## Popper

Use the `popper` prop to customize the popper instance.

### Arrow

:component-example{component="select-menu-example-arrow"}

### Placement

:component-example{component="select-menu-example-placement"}

### Offset

:component-example{component="select-menu-example-offset"}

## Slots

### `label`

You can override the `#label` slot and handle the display yourself.

::component-example
---
component: 'select-menu-example-multiple-slot'
componentProps:
  class: 'w-full lg:w-48'
---
::

### `default`

You can also override the `#default` slot entirely.

::component-example
---
component: 'select-menu-example-button'
componentProps:
  class: 'w-full lg:w-48'
---
::

### `option`

Use the `#option` slot to customize the option content. You will have access to the `option`, `active` and `selected` properties in the slot scope.

::component-example
---
component: 'select-menu-example-option-slot'
componentProps:
  class: 'w-full lg:w-48'
---
::

### `option-empty`

Use the `#option-empty` slot to customize the content displayed when the `searchable` prop is `true` and there is no options. You will have access to the `query` property in the slot scope.

You can also configure this globally through the `ui.selectMenu.default.optionEmpty.label` config. The token `{query}` will be replaced by `query` property. Defaults to `No results for "{query}".`.

::component-example
---
component: 'select-menu-example-option-empty-slot'
componentProps:
  class: 'w-full lg:w-48'
---
::

### `option-create`

Use the `#option-create` slot to customize the content displayed when the `creatable` prop is `true` and there is no options. You will have access to the `query` property in the slot scope.

::callout{icon="i-heroicons-light-bulb"}
An example is available in the [Creatable](#creatable) section.
::

### `empty`

Use the `#empty` slot to customize the content displayed when there is no options.

You can also configure this globally through the `ui.selectMenu.default.empty.label` config. Defaults to `No options.`.

::component-example
---
component: 'select-menu-example-empty-slot'
componentProps:
  class: 'w-full lg:w-48'
---
::

## Props

:component-props

## Config

::callout{icon="i-heroicons-light-bulb"}
Use the `ui` prop to override the select config and the `uiMenu` prop to override the menu config.
::

::tabs{:selectedIndex="1"}
  :component-preset{label="Select (ui)" slug="Select"}
  :component-preset{label="SelectMenu (uiMenu)"}
::
