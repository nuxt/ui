---
title: CommandPalette
description: A command palette with full-text search powered by Fuse.js for efficient fuzzy matching.
category: navigation
links:
  - label: Fuse.js
    icon: i-custom-fuse-js
    to: https://fusejs.io/
    target: _blank
  - label: Listbox
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/listbox
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/CommandPalette.vue
---

## Usage

Use the `v-model` directive to control the value of the CommandPalette or the `default-value` prop to set the initial value when you do not need to control its state.

::tip{to="#control-selected-items"}
You can also use the `@update:model-value` event to listen to the selected item(s).
::

### Groups

The CommandPalette component filters groups and ranks matching commands by relevance as users type. It provides dynamic, instant search results for efficient command discovery. Use the `groups` prop as an array of objects with the following properties:

- `id: string`{lang="ts-type"}
- `label?: string`{lang="ts-type"}
- `slot?: string`{lang="ts-type"}
- `items?: CommandPaletteItem[]`{lang="ts-type"}
- [`ignoreFilter?: boolean`{lang="ts-type"}](#with-ignore-filter)
- [`postFilter?: (searchTerm: string, items: T[]) => T[]`{lang="ts-type"}](#with-post-filtered-items)
- `highlightedIcon?: string`{lang="ts-type"}

::caution
You must provide an `id` for each group otherwise the group will be ignored.
::

Each group contains an `items` array of objects that define the commands. Each item can have the following properties:

- `prefix?: string`{lang="ts-type"}
- `label?: string`{lang="ts-type"}
- `suffix?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `avatar?: AvatarProps`{lang="ts-type"}
- `chip?: ChipProps`{lang="ts-type"}
- `kbds?: string[] | KbdProps[]`{lang="ts-type"}
- `active?: boolean`{lang="ts-type"}
- `loading?: boolean`{lang="ts-type"}
- `disabled?: boolean`{lang="ts-type"}
- [`slot?: string`{lang="ts-type"}](#with-custom-slot)
- `placeholder?: string`{lang="ts-type"}
- `children?: CommandPaletteItem[]`{lang="ts-type"}
- `onSelect?(e?: Event): void`{lang="ts-type"}
- `class?: any`{lang="ts-type"}
- `ui?: { item?: ClassNameValue, itemLeadingIcon?: ClassNameValue, itemLeadingAvatarSize?: ClassNameValue, itemLeadingAvatar?: ClassNameValue, itemLeadingChipSize?: ClassNameValue, itemLeadingChip?: ClassNameValue, itemLabel?: ClassNameValue, itemLabelPrefix?: ClassNameValue, itemLabelBase?: ClassNameValue, itemLabelSuffix?: ClassNameValue, itemTrailing?: ClassNameValue, itemTrailingKbds?: ClassNameValue, itemTrailingKbdsSize?: ClassNameValue, itemTrailingHighlightedIcon?: ClassNameValue, itemTrailingIcon?: ClassNameValue }`{lang="ts-type"}

You can pass any property from the [Link](/components/link#props) component such as `to`, `target`, etc.

::component-code
---
collapse: true
hide:
  - autofocus
ignore:
  - groups
  - modelValue
  - class
external:
  - groups
  - modelValue
class: '!p-0'
props:
  modelValue: {}
  autofocus: false
  groups:
    - id: 'users'
      label: 'Users'
      items:
        - label: 'Benjamin Canac'
          suffix: 'benjamincanac'
          avatar:
            src: 'https://github.com/benjamincanac.png'
        - label: 'Sylvain Marroufin'
          suffix: 'smarroufin'
          avatar:
            src: 'https://github.com/smarroufin.png'
        - label: 'Sébastien Chopin'
          suffix: 'atinux'
          avatar:
            src: 'https://github.com/atinux.png'
        - label: 'Romain Hamel'
          suffix: 'romhml'
          avatar:
            src: 'https://github.com/romhml.png'
        - label: 'Haytham A. Salama'
          suffix: 'Haythamasalama'
          avatar:
            src: 'https://github.com/Haythamasalama.png'
        - label: 'Daniel Roe'
          suffix: 'danielroe'
          avatar:
            src: 'https://github.com/danielroe.png'
        - label: 'Neil Richter'
          suffix: 'noook'
          avatar:
            src: 'https://github.com/noook.png'
  class: 'flex-1'
---
::

::tip{to="#with-children-in-items"}
Each item can take a `children` array of objects with the following properties to create submenus:
::

### Multiple

Use the `multiple` prop to allow multiple selections.

::component-code
---
collapse: true
hide:
  - autofocus
ignore:
  - groups
  - modelValue
  - multiple
  - class
external:
  - groups
  - modelValue
class: '!p-0'
props:
  multiple: true
  autofocus: false
  modelValue: []
  groups:
    - id: 'users'
      label: 'Users'
      items:
        - label: 'Benjamin Canac'
          suffix: 'benjamincanac'
          avatar:
            src: 'https://github.com/benjamincanac.png'
        - label: 'Sylvain Marroufin'
          suffix: 'smarroufin'
          avatar:
            src: 'https://github.com/smarroufin.png'
        - label: 'Sébastien Chopin'
          suffix: 'atinux'
          avatar:
            src: 'https://github.com/atinux.png'
        - label: 'Romain Hamel'
          suffix: 'romhml'
          avatar:
            src: 'https://github.com/romhml.png'
        - label: 'Haytham A. Salama'
          suffix: 'Haythamasalama'
          avatar:
            src: 'https://github.com/Haythamasalama.png'
        - label: 'Daniel Roe'
          suffix: 'danielroe'
          avatar:
            src: 'https://github.com/danielroe.png'
        - label: 'Neil Richter'
          suffix: 'noook'
          avatar:
            src: 'https://github.com/noook.png'
  class: 'flex-1'
---
::

::caution
Ensure to pass an array to the `default-value` prop or the `v-model` directive.
::

### Placeholder

Use the `placeholder` prop to change the placeholder text.

::component-code
---
collapse: true
hide:
  - autofocus
ignore:
  - class
  - groups
external:
  - groups
class: '!p-0'
props:
  autofocus: false
  placeholder: 'Search an app...'
  groups:
    - id: 'apps'
      items:
        - label: 'Calendar'
          icon: 'i-lucide-calendar'
        - label: 'Music'
          icon: 'i-lucide-music'
        - label: 'Maps'
          icon: 'i-lucide-map'
  class: 'flex-1'
---
::

### Icon

Use the `icon` prop to customize the input [Icon](/components/icon). Defaults to `i-lucide-search`.

::component-code
---
collapse: true
hide:
  - autofocus
ignore:
  - class
  - groups
external:
  - groups
class: '!p-0'
props:
  autofocus: false
  icon: 'i-lucide-box'
  groups:
    - id: 'apps'
      items:
        - label: 'Calendar'
          icon: 'i-lucide-calendar'
        - label: 'Music'
          icon: 'i-lucide-music'
        - label: 'Maps'
          icon: 'i-lucide-map'
  class: 'flex-1'
---
::

::framework-only
#nuxt
:::tip{to="/getting-started/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.search` key.
:::

#vue
:::tip{to="/getting-started/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.search` key.
:::
::

### Selected Icon

Use the `selected-icon` prop to customize the selected item [Icon](/components/icon). Defaults to `i-lucide-check`.

::component-code
---
collapse: true
hide:
  - autofocus
ignore:
  - groups
  - modelValue
  - multiple
  - class
external:
  - groups
  - modelValue
class: '!p-0'
props:
  multiple: true
  autofocus: false
  modelValue:
    - label: 'Benjamin Canac'
      suffix: 'benjamincanac'
      avatar:
        src: 'https://github.com/benjamincanac.png'
  selectedIcon: 'i-lucide-circle-check'
  groups:
    - id: 'users'
      label: 'Users'
      items:
        - label: 'Benjamin Canac'
          suffix: 'benjamincanac'
          avatar:
            src: 'https://github.com/benjamincanac.png'
        - label: 'Sylvain Marroufin'
          suffix: 'smarroufin'
          avatar:
            src: 'https://github.com/smarroufin.png'
        - label: 'Sébastien Chopin'
          suffix: 'atinux'
          avatar:
            src: 'https://github.com/atinux.png'
        - label: 'Romain Hamel'
          suffix: 'romhml'
          avatar:
            src: 'https://github.com/romhml.png'
        - label: 'Haytham A. Salama'
          suffix: 'Haythamasalama'
          avatar:
            src: 'https://github.com/Haythamasalama.png'
        - label: 'Daniel Roe'
          suffix: 'danielroe'
          avatar:
            src: 'https://github.com/danielroe.png'
        - label: 'Neil Richter'
          suffix: 'noook'
          avatar:
            src: 'https://github.com/noook.png'
  class: 'flex-1'
---
::

::framework-only
#nuxt
:::tip{to="/getting-started/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.check` key.
:::

#vue
:::tip{to="/getting-started/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.check` key.
:::
::

### Trailing Icon :badge{label="New" class="align-text-top"}

Use the `trailing-icon` prop to customize the trailing [Icon](/components/icon) when an item has children. Defaults to `i-lucide-chevron-right`.

::component-code
---
collapse: true
prettier: true
hide:
  - autofocus
ignore:
  - groups
  - class
external:
  - groups
class: '!p-0'
props:
  autofocus: false
  trailingIcon: 'i-lucide-arrow-right'
  groups:
    - id: 'actions'
      items:
        - label: 'Share'
          icon: 'i-lucide-share'
          children:
            - label: 'Email'
              icon: 'i-lucide-mail'
            - label: 'Copy'
              icon: 'i-lucide-copy'
            - label: 'Link'
              icon: 'i-lucide-link'
  class: 'flex-1'
---
::

::framework-only
#nuxt
:::tip{to="/getting-started/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.chevronRight` key.
:::

#vue
:::tip{to="/getting-started/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.chevronRight` key.
:::
::

### Loading

Use the `loading` prop to show a loading icon on the CommandPalette.

::component-code
---
collapse: true
hide:
  - autofocus
ignore:
  - class
  - groups
external:
  - groups
class: '!p-0'
props:
  autofocus: false
  loading: true
  groups:
    - id: 'apps'
      items:
        - label: 'Calendar'
          icon: 'i-lucide-calendar'
        - label: 'Music'
          icon: 'i-lucide-music'
        - label: 'Maps'
          icon: 'i-lucide-map'
  class: 'flex-1'
---
::

### Loading Icon

Use the `loading-icon` prop to customize the loading icon. Defaults to `i-lucide-loader-circle`.

::component-code
---
collapse: true
hide:
  - autofocus
ignore:
  - class
  - groups
external:
  - groups
class: '!p-0'
props:
  autofocus: false
  loading: true
  loadingIcon: 'i-lucide-loader'
  groups:
    - id: 'apps'
      items:
        - label: 'Calendar'
          icon: 'i-lucide-calendar'
        - label: 'Music'
          icon: 'i-lucide-music'
        - label: 'Maps'
          icon: 'i-lucide-map'
  class: 'flex-1'
---
::

::framework-only
#nuxt
:::tip{to="/getting-started/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.loading` key.
:::

#vue
:::tip{to="/getting-started/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.loading` key.
:::
::

### Close

Use the `close` prop to display a [Button](/components/button) to dismiss the CommandPalette.

::tip
An `update:open` event will be emitted when the close button is clicked.
::

::component-code
---
collapse: true
hide:
  - autofocus
ignore:
  - class
  - groups
  - close
external:
  - groups
class: '!p-0'
props:
  autofocus: false
  close: true
  groups:
    - id: 'apps'
      items:
        - label: 'Calendar'
          icon: 'i-lucide-calendar'
        - label: 'Music'
          icon: 'i-lucide-music'
        - label: 'Maps'
          icon: 'i-lucide-map'
  class: 'flex-1'
---
::

You can pass any property from the [Button](/components/button) component to customize it.

::component-code
---
collapse: true
prettier: true
hide:
  - autofocus
ignore:
  - close.color
  - close.variant
  - groups
  - class
external:
  - groups
class: '!p-0'
props:
  autofocus: false
  close:
    color: primary
    variant: outline
    class: 'rounded-full'
  groups:
    - id: 'apps'
      items:
        - label: 'Calendar'
          icon: 'i-lucide-calendar'
        - label: 'Music'
          icon: 'i-lucide-music'
        - label: 'Maps'
          icon: 'i-lucide-map'
  class: 'flex-1'
---
::

### Close Icon

Use the `close-icon` prop to customize the close button [Icon](/components/icon). Defaults to `i-lucide-x`.

::component-code
---
collapse: true
hide:
  - autofocus
ignore:
  - class
  - groups
  - close
external:
  - groups
class: '!p-0'
props:
  autofocus: false
  close: true
  closeIcon: 'i-lucide-arrow-right'
  groups:
    - id: 'apps'
      items:
        - label: 'Calendar'
          icon: 'i-lucide-calendar'
        - label: 'Music'
          icon: 'i-lucide-music'
        - label: 'Maps'
          icon: 'i-lucide-map'
  class: 'flex-1'
---
::

::framework-only
#nuxt
:::tip{to="/getting-started/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.close` key.
:::

#vue
:::tip{to="/getting-started/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.close` key.
:::
::

### Back :badge{label="New" class="align-text-top"}

Use the `back` prop to customize or hide the back button (with `false` value) displayed when navigating into a submenu.

You can pass any property from the [Button](/components/button) component to customize it.

::component-code
---
collapse: true
prettier: true
hide:
  - autofocus
ignore:
  - back.color
  - groups
  - class
external:
  - groups
class: '!p-0'
props:
  autofocus: false
  back:
    color: primary
  groups:
    - id: 'actions'
      items:
        - label: 'Share'
          icon: 'i-lucide-share'
          children:
            - label: 'Email'
              icon: 'i-lucide-mail'
            - label: 'Copy'
              icon: 'i-lucide-copy'
            - label: 'Link'
              icon: 'i-lucide-link'
  class: 'flex-1'
---
::

### Back Icon :badge{label="New" class="align-text-top"}

Use the `back-icon` prop to customize the back button [Icon](/components/icon). Defaults to `i-lucide-arrow-left`.

::component-code
---
collapse: true
hide:
  - autofocus
ignore:
  - class
  - groups
  - back
external:
  - groups
class: '!p-0'
props:
  autofocus: false
  back: true
  backIcon: 'i-lucide-house'
  groups:
    - id: 'actions'
      items:
        - label: 'Share'
          icon: 'i-lucide-share'
          children:
            - label: 'Email'
              icon: 'i-lucide-mail'
            - label: 'Copy'
              icon: 'i-lucide-copy'
            - label: 'Link'
              icon: 'i-lucide-link'
  class: 'flex-1'
---
::

::framework-only
#nuxt
:::tip{to="/getting-started/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.arrowLeft` key.
:::

#vue
:::tip{to="/getting-started/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.arrowLeft` key.
:::
::

### Disabled

Use the `disabled` prop to disable the CommandPalette.

::component-code
---
collapse: true
hide:
  - autofocus
ignore:
  - groups
  - class
external:
  - groups
class: '!p-0'
props:
  autofocus: false
  disabled: true
  groups:
    - id: 'apps'
      items:
        - label: 'Calendar'
          icon: 'i-lucide-calendar'
        - label: 'Music'
          icon: 'i-lucide-music'
        - label: 'Maps'
          icon: 'i-lucide-map'
  class: 'flex-1'
---
::

## Examples

### Control selected item(s)

You can control the selected item(s) by using the `default-value` prop or the `v-model` directive, by using the `onSelect` field on each item or by using the `@update:model-value` event.

::component-example
---
collapse: true
name: 'command-palette-select-example'
class: '!p-0'
props:
  autofocus: false
---
::

### Control search term

Use the `v-model:search-term` directive to control the search term.

::component-example
---
collapse: true
name: 'command-palette-search-term-example'
class: '!p-0'
props:
  autofocus: false
---
::

::note
This example uses the `@update:model-value` event to reset the search term when an item is selected.
::

### With children in items :badge{label="New" class="align-text-top"}

You can create hierarchical menus by using the `children` property in items. When an item has children, it will automatically display a chevron icon and enable navigation into a submenu.

::component-example
---
collapse: true
prettier: true
name: 'command-palette-items-children-example'
class: '!p-0'
props:
  autofocus: false
---
::

::note
When navigating into a submenu:
- The search term is reset
- A back button appears in the input
- You can go back to the previous group by pressing the :kbd{value="backspace"} key
::

### With fetched items

You can fetch items from an API and use them in the CommandPalette.

::component-example
---
collapse: true
name: 'command-palette-fetch-example'
class: '!p-0'
props:
  autofocus: false
---
::

### With ignore filter

You can set the `ignoreFilter` field to `true` on a group to disable the internal search and use your own search logic.

::component-example
---
collapse: true
name: 'command-palette-ignore-filter-example'
class: '!p-0'
props:
  autofocus: false
---
::

::note
This example uses [`refDebounced`](https://vueuse.org/shared/refDebounced/#refdebounced) to debounce the API calls.
::

### With post-filtered items

You can use the `postFilter` field on a group to filter items after the search happened.

::component-example
---
collapse: true
name: 'command-palette-post-filter-example'
class: '!p-0'
props:
  autofocus: false
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
props:
  autofocus: false
---
::

### Within a Popover

You can use the CommandPalette component inside a [Popover](/components/popover)'s content.

::component-example
---
collapse: true
name: 'popover-command-palette-example'
props:
  autofocus: false
---
::

### Within a Modal

You can use the CommandPalette component inside a [Modal](/components/modal)'s content.

::component-example
---
collapse: true
name: 'modal-command-palette-example'
props:
  autofocus: false
---
::

### Within a Drawer

You can use the CommandPalette component inside a [Drawer](/components/drawer)'s content.

::component-example
---
collapse: true
name: 'drawer-command-palette-example'
props:
  autofocus: false
---
::

### Listen open state

When using the `close` prop, you can listen to the `update:open` event when the button is clicked.

::component-example
---
collapse: true
name: 'command-palette-open-example'
props:
  autofocus: false
---
::

::note
This can be useful when using the CommandPalette inside a [`Modal`](/components/modal) for example.
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
collapse: true
name: 'command-palette-custom-slot-example'
class: '!p-0'
props:
  autofocus: false
---
::

::tip{to="#slots"}
You can also use the `#item`, `#item-leading`, `#item-label` and `#item-trailing` slots to customize all items.
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
