---
description: A set of tab panels that are displayed one at a time.
category: navigation
links:
  - label: Tabs
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/tabs
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Tabs.vue
---

## Usage

Use the Tabs component to display a list of items in a tabs.

::component-example
---
collapse: true
prettier: true
name: 'tabs-example'
props:
  class: 'w-full'
---
::

### Items

Use the `items` prop as an array of objects with the following properties:

- `label?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `avatar?: AvatarProps`{lang="ts-type"}
- `badge?: string | number | BadgeProps`{lang="ts-type"}
- `content?: string`{lang="ts-type"}
- `value?: string | number`{lang="ts-type"}
- `disabled?: boolean`{lang="ts-type"}
- [`slot?: string`{lang="ts-type"}](#with-custom-slot)
- `class?: any`{lang="ts-type"}
- `ui?: { trigger?: ClassNameValue, leadingIcon?: ClassNameValue, leadingAvatar?: ClassNameValue, leadingAvatarSize?: ClassNameValue, label?: ClassNameValue, trailingBadge?: ClassNameValue, trailingBadgeSize?: ClassNameValue, content?: ClassNameValue }`{lang="ts-type"}

::component-code
---
ignore:
  - items
  - class
external:
  - items
externalTypes:
  - TabsItem[]
props:
  items:
    - label: Account
      icon: 'i-lucide-user'
      content: 'This is the account content.'
    - label: Password
      icon: 'i-lucide-lock'
      content: 'This is the password content.'
  class: 'w-full'
---
::

### Content

Set the `content` prop to `false` to turn the Tabs into a toggle-only control without displaying any content. Defaults to `true`.

::component-code
---
ignore:
  - content
  - items
  - class
external:
  - items
externalTypes:
  - TabsItem[]
props:
  content: false
  items:
    - label: Account
      icon: 'i-lucide-user'
      content: 'This is the account content.'
    - label: Password
      icon: 'i-lucide-lock'
      content: 'This is the password content.'
  class: 'w-full'
---
::

### Unmount

Use the `unmount-on-hide` prop to prevent the content from being unmounted when the Tabs is collapsed. Defaults to `true`.

::component-code
---
ignore:
  - content
  - items
  - class
external:
  - items
externalTypes:
  - TabsItem[]
props:
  unmountOnHide: false
  items:
    - label: Account
      icon: 'i-lucide-user'
      content: 'This is the account content.'
    - label: Password
      icon: 'i-lucide-lock'
      content: 'This is the password content.'
  class: 'w-full'
---
::

::note
You can inspect the DOM to see each item's content being rendered.
::

### Color

Use the `color` prop to change the color of the Tabs.

::component-code
---
ignore:
  - content
  - items
  - class
external:
  - items
externalTypes:
  - TabsItem[]
props:
  color: neutral
  content: false
  items:
    - label: Account
    - label: Password
  class: 'w-full'
---
::

### Variant

Use the `variant` prop to change the variant of the Tabs.

::component-code
---
ignore:
  - content
  - items
  - class
external:
  - items
externalTypes:
  - TabsItem[]
props:
  color: neutral
  variant: link
  content: false
  items:
    - label: Account
    - label: Password
  class: 'w-full'
---
::

### Size

Use the `size` prop to change the size of the Tabs.

::component-code
---
ignore:
  - content
  - items
  - class
external:
  - items
externalTypes:
  - TabsItem[]
props:
  size: md
  variant: pill
  content: false
  items:
    - label: Account
    - label: Password
  class: 'w-full'
---
::

### Orientation

Use the `orientation` prop to change the orientation of the Tabs. Defaults to `horizontal`.

::component-code
---
ignore:
  - content
  - items
  - class
external:
  - items
externalTypes:
  - TabsItem[]
props:
  orientation: vertical
  variant: pill
  content: false
  items:
    - label: Account
    - label: Password
  class: 'w-full'
---
::

## Examples

### Control active item

You can control the active item by using the `default-value` prop or the `v-model` directive with the `value` of the item. If no `value` is provided, it defaults to the index **as a string**.

:component-example{name="tabs-model-value-example"}

::tip
Use the `value-key` prop to change the key used to match items when a `v-model` or `default-value` is provided.
::

### With route query

You can control the active item by a URL query parameter, using `route.query.tab` as the `value` of the item.

:component-example{name="tabs-route-query-example"}

### With content slot

Use the `#content` slot to customize the content of each item.

:component-example{name="tabs-content-slot-example"}

### With custom slot

Use the `slot` property to customize a specific item.

You will have access to the following slots:

- `#{{ item.slot }}`{lang="ts-type"}

::component-example
---
collapse: true
name: 'tabs-custom-slot-example'
---
::

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

### Expose

When accessing the component via a template ref, you can use the following:

| Name | Type |
| ---- | ---- |
| `triggersRef`{lang="ts-type"} | `Ref<ComponentPublicInstance[]>`{lang="ts-type"} |

## Theme

:component-theme

## Changelog

:component-changelog
