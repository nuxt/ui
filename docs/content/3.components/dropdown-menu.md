---
title: DropdownMenu
description: A menu to display actions when clicking on an element.
links:
  - label: DropdownMenu
    icon: i-custom-radix-vue
    to: https://www.radix-vue.com/components/dropdown-menu.html
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/DropdownMenu.vue
---

## Usage

Use a [Button](/components/button) or any other component in the default slot of the DropdownMenu.

### Items

Use the `items` prop as an array of objects with the following properties:

- `label?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `avatar?: AvatarProps`{lang="ts-type"}
- `kbds?: string[] | KbdProps[]`{lang="ts-type"}
- [`type?: "link" | "label" | "separator" | "checkbox"`{lang="ts-type"}](#with-checkbox-items)
- [`checked?: boolean`{lang="ts-type"}](#with-checkbox-items)
- `disabled?: boolean`{lang="ts-type"}
- `class?: any`{lang="ts-type"}
- [`slot?: string`{lang="ts-type"}](#with-custom-slot)
- `onSelect?(e: Event): void`{lang="ts-type"}
- [`onUpdateChecked?(checked: boolean): void`{lang="ts-type"}](#with-checkbox-items)

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
props:
  items:
    - - label: Benjamin
        avatar:
          src: 'https://github.com/benjamincanac.png'
        type: label
    - - label: Profile
        icon: i-heroicons-user
      - label: Billing
        icon: i-heroicons-credit-card
      - label: Settings
        icon: i-heroicons-cog
        kbds:
          - ','
      - label: Keyboard shortcuts
        icon: i-heroicons-computer-desktop
    - - label: Team
        icon: i-heroicons-users
      - label: Invite users
        icon: i-heroicons-user-plus
        children:
          - - label: Email
              icon: i-heroicons-envelope
            - label: Message
              icon: i-heroicons-chat-bubble-left
          - - label: More
              icon: i-heroicons-plus-circle
      - label: New team
        icon: i-heroicons-plus
        kbds:
          - meta
          - n
    - - label: GitHub
        icon: i-simple-icons-github
        to: 'https://github.com/nuxt/ui'
        target: _blank
      - label: Support
        icon: i-heroicons-lifebuoy
        to: '/components/dropdown-menu'
      - label: API
        icon: i-heroicons-cloud
        disabled: true
    - - label: Logout
        icon: i-heroicons-arrow-right-on-rectangle
        kbds:
          - shift
          - meta
          - q
  class: 'w-48'
slots:
  default: |

    <UButton icon="i-heroicons-bars-3" color="neutral" variant="outline" />
---

:u-button{icon="i-heroicons-bars-3" color="neutral" variant="outline"}
::

::note
You can pass an array of arrays to the `items` prop to create separated groups of items.
::

::tip
Each item can take a `children` array of objects with the same properties as the `items` prop to create a nested menu which can be controlled using the `open`, `defaultOpen` and `content` properties.
::

### Content

Use the `content` prop to control how the DropdownMenu content is rendered, like its `align` or `side` for example.

::component-code
---
prettier: true
ignore:
  - items
  - class
external:
  - items
items:
  content.align:
    - start
    - center
    - end
  content.side:
    - right
    - left
    - top
    - bottom
props:
  items:
    - label: Profile
      icon: i-heroicons-user
    - label: Billing
      icon: i-heroicons-credit-card
    - label: Settings
      icon: i-heroicons-cog
  content:
    align: start
    side: bottom
    sideOffset: 8
  class: 'w-48'
slots:
  default: |

    <UButton label="Open" icon="i-heroicons-bars-3" color="neutral" variant="outline" />
---

:u-button{label="Open" icon="i-heroicons-bars-3" color="neutral" variant="outline"}
::

### Arrow

Use the `arrow` prop to display an arrow on the DropdownMenu.

::component-code
---
prettier: true
ignore:
  - arrow
  - items
  - class
external:
  - items
props:
  arrow: true
  items:
    - label: Profile
      icon: i-heroicons-user
    - label: Billing
      icon: i-heroicons-credit-card
    - label: Settings
      icon: i-heroicons-cog
  class: 'w-48'
slots:
  default: |

    <UButton label="Open" icon="i-heroicons-bars-3" color="neutral" variant="outline" />
---

:u-button{label="Open" icon="i-heroicons-bars-3" color="neutral" variant="outline"}
::

### Size

Use the `size` prop to control the size of the DropdownMenu.

::component-code
---
prettier: true
ignore:
  - items
  - class
  - content.align
external:
  - items
props:
  size: xl
  items:
    - label: Profile
      icon: i-heroicons-user
    - label: Billing
      icon: i-heroicons-credit-card
    - label: Settings
      icon: i-heroicons-cog
  content:
    align: start
  class: 'w-48'
slots:
  default: |

    <UButton size="xl" label="Open" icon="i-heroicons-bars-3" color="neutral" variant="outline" />
---

:u-button{size="xl" label="Open" icon="i-heroicons-bars-3" color="neutral" variant="outline"}
::

::warning
The `size` prop will not be proxied to the Button, you need to set it yourself.
::

::note
When using the same size, the DropdownMenu items will be perfectly aligned with the Button.
::

### Disabled

Use the `disabled` prop to disable the DropdownMenu.

::component-code
---
prettier: true
ignore:
  - items
  - class
external:
  - items
props:
  disabled: true
  items:
    - label: Profile
      icon: i-heroicons-user
    - label: Billing
      icon: i-heroicons-credit-card
    - label: Settings
      icon: i-heroicons-cog
  class: 'w-48'
slots:
  default: |

    <UButton label="Open" icon="i-heroicons-bars-3" color="neutral" variant="outline" />
---

:u-button{label="Open" icon="i-heroicons-bars-3" color="neutral" variant="outline"}
::

## Examples

### With checkbox items

You can use the `type` property with `checkbox` and use the `checked` / `onUpdateChecked` properties to control the checked state of the item.

::component-example
---
collapse: true
name: 'dropdown-menu-checkbox-items-example'
---
::

::note
To ensure reactivity for the `checked` state of items, it's recommended to wrap your `items` array inside a `computed`.
::

### Control open state

You can control the open state by using the `default-open` prop or the `v-model:open` directive.

::component-example
---
name: 'dropdown-menu-open-example'
---
::

::note
In this example, press :kbd{value="O"} to toggle the DropdownMenu.
::

### With custom slot

Use the `slot` property to customize a specific item.

You will have access to the following slots:

- `#{{ item.slot }}`{lang="ts-type"}
- `#{{ item.slot }}-leading`{lang="ts-type"}
- `#{{ item.slot }}-label`{lang="ts-type"}
- `#{{ item.slot }}-trailing`{lang="ts-type"}

::component-example
---
name: 'dropdown-menu-custom-slot-example'
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
const items = [{
  label: 'Invite users',
  icon: 'i-heroicons-user-plus',
  children: [{
    label: 'Invite by email',
    icon: 'i-heroicons-paper-airplane',
    kbds: ['meta', 'e'],
    onSelect() {
      console.log('Invite by email clicked')
    }
  }, {
    label: 'Invite by link',
    icon: 'i-heroicons-link',
    kbds: ['meta', 'i'],
    onSelect() {
      console.log('Invite by link clicked')
    }
  }]
}, {
  label: 'New team',
  icon: 'i-heroicons-plus',
  kbds: ['meta', 'n'],
  onSelect() {
    console.log('New team clicked')
  }
}]

defineShortcuts(extractShortcuts(items))
</script>
```

::note
In this example, :kbd{value="meta"} :kbd{value="E"}, :kbd{value="meta"} :kbd{value="I"} and :kbd{value="meta"} :kbd{value="N"} would trigger the `select` function of the corresponding item.
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
