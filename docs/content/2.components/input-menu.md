---
title: InputMenu
description: Display an autocomplete input with real-time suggestions.
links:
  - label: 'Combobox'
    icon: i-simple-icons-headlessui
    to: 'https://headlessui.com/v1/vue/combobox'
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/forms/InputMenu.vue
---

## Usage

The `InputMenu` component renders by default an [Input](/components/input) component and is based on the `ui.input` preset. You can use most of the `Input` props to configure the display such as [color](/components/input#style), [variant](/components/input#style), [size](/components/input#size), [placeholder](/components/input#placeholder), [icon](/components/input#icon), [disabled](/components/input#disabled), etc.

You can use the `ui` prop like the `Input` component to override the default config. The `uiMenu` prop can be used to override the default menu config.

Pass an array of strings or objects to the `options` prop to display in the menu.

::component-example
---
component: 'input-menu-example-basic'
componentProps:
  class: 'w-full lg:w-48'
---
::

::callout{icon="i-heroicons-exclamation-triangle"}
This component does not support multiple values. Use the [SelectMenu](/components/select-menu#multiple) component instead.
::

### Objects

You can pass an array of objects to `options` and either compare on the whole object or use the `by` prop to compare on a specific key. You can configure which field will be used to display the label through the `option-attribute` prop that defaults to `label`. Additionally, you can use dot notation (e.g., `user.name`) to access nested object properties.

::component-example
---
component: 'input-menu-example-objects'
componentProps:
  class: 'w-full lg:w-48'
---
::

Use the `search-attributes` prop with an array of property names to search on each option object. Nested attributes can be accessed using `dot.notation`. When the property value is an array or object, these are cast to string so these can be searched within.

::component-example
---
component: 'input-menu-example-search-attributes'
componentProps:
  class: 'w-full lg:w-48'
---
::

If you only want to select a single object property rather than the whole object as value, you can set the `value-attribute` property. This prop defaults to `null`.

::component-example
---
component: 'input-menu-example-objects-value-attribute'
componentProps:
  class: 'w-full lg:w-48'
---
::

### Icon

The `InputMenu` has a button on the right to toggle the menu. Use the `trailing-icon` prop to set a different icon or change it globally in `ui.inputMenu.default.trailingIcon`. Defaults to `i-heroicons-chevron-down-20-solid`.

::component-card
---
baseProps:
  class: 'w-full lg:w-48'
  placeholder: 'Select a person'
  options: ['Wade Cooper', 'Arlene Mccoy', 'Devon Webb', 'Tom Cook', 'Tanya Fox', 'Hellen Schmidt', 'Caroline Schultz', 'Mason Heaney', 'Claudie Smitham', 'Emil Schaefer']
props:
  trailingIcon: 'i-heroicons-chevron-up-down-20-solid'
excludedProps:
  - trailingIcon
---
::

Use the `selected-icon` prop to set a different icon or change it globally in `ui.inputMenu.default.selectedIcon`. Defaults to `i-heroicons-check-20-solid`.

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
Learn how to customize icons from the [Input](/components/input#icon) component.
::

## Searchable

### Attributes

Use the `search-attributes` prop with an array of property names to search on each option object. Nested attributes can be accessed using `dot.notation`. When the property value is an array or object, these are cast to string so these can be searched within.

::component-example
---
component: 'input-menu-example-search-attributes'
componentProps:
  class: 'w-full lg:w-48'
---
::

### Control the query

Use a `v-model:query` to control the search query.

::component-example
---
component: 'input-menu-example-search-query'
componentProps:
  class: 'w-full lg:w-48'
---
::

### Async search

Pass a function to the `search` prop to customize the search behavior and filter options according to your needs. The function will receive the query as its first argument and should return an array.

Use the `debounce` prop to adjust the delay of the function.

Use the `searchLazy` prop to control the immediacy of data requests.

::component-example
---
component: 'input-menu-example-search-async'
componentProps:
  class: 'w-full lg:w-48'
---
::

## Popper

Use the `popper` prop to customize the popper instance.

### Arrow

:component-example{component="input-menu-example-popper-arrow"}

### Placement

:component-example{component="input-menu-example-popper-placement"}

### Offset

:component-example{component="input-menu-example-popper-offset"}

## Slots

### `option`

Use the `#option` slot to customize the option content. You will have access to the `option`, `active` and `selected` properties in the slot scope.

::component-example
---
component: 'input-menu-example-option-slot'
componentProps:
  class: 'w-full lg:w-48'
---
::

### `option-empty`

Use the `#option-empty` slot to customize the content displayed when the `searchable` prop is `true` and there is no options. You will have access to the `query` property in the slot scope.

You can also configure this globally through the `ui.inputMenu.default.optionEmpty.label` config. The token `{query}` will be replaced by `query` property. Defaults to `No results for "{query}".`.

::component-example
---
component: 'input-menu-example-option-empty-slot'
componentProps:
  class: 'w-full lg:w-48'
---
::

### `empty`

Use the `#empty` slot to customize the content displayed when there is no options. Defaults to `No options.`.

You can also configure this globally through the `ui.inputMenu.default.empty.label` config. Defaults to `No options.`.

::component-example
---
component: 'input-menu-example-empty-slot'
componentProps:
  class: 'w-full lg:w-48'
---
::

## Props

:component-props

## Config

::callout{icon="i-heroicons-light-bulb"}
Use the `ui` prop to override the input config and the `uiMenu` prop to override the menu config.
::

::tabs{:selectedIndex="1"}
  :component-preset{label="Input (ui)" slug="Input"}
  :component-preset{label="InputMenu (uiMenu)"}
::
