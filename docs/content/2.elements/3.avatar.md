---
description: Display an image that represents a resource or a group of resources.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/elements/Avatar.vue
---

## Usage

::component-card
---
props:
  src: 'https://avatars.githubusercontent.com/u/739984?v=4'
  alt: 'Avatar'
---
::

### Size

Use the `size` prop to change the size of the Avatar.

::component-card
---
props:
  size: 'sm'
baseProps:
  src: 'https://avatars.githubusercontent.com/u/739984?v=4'
  alt: 'Avatar'
---
::

### Chip

Use the `chip-color`, `chip-text` and `chip-position` props to display a chip on the Avatar.

::component-card
---
props:
  chipColor: 'primary'
  chipText: ''
  chipPosition: 'top-right'
  size : 'sm'
options:
  - name: 'chipColor'
    restriction: 'included'
    values:
      - 'gray'
baseProps:
  src: 'https://avatars.githubusercontent.com/u/739984?v=4'
  alt: 'Avatar'
---
::

### Placeholder

If there is an error loading the `src` of the avatar or `src` is null / false a background placeholder will be displayed, customizable in `ui.avatar.background`.

#### Icon

Use any icon from [Iconify](https://icones.js.org) by setting the `icon` prop by using this pattern: `i-{collection_name}-{icon_name}` or change it globally in `ui.avatar.default.icon` to display an icon on top of the background.

::component-card
---
props:
  icon: 'i-heroicons-photo'
  size: 'sm'
excludedProps:
  - icon
---
::

#### Alt

Otherwise, a placeholder will be displayed with the initials of the `alt` prop, customizable in `ui.avatar.placeholder`.

::component-card
---
props:
  alt: 'Benjamin Canac'
  size: 'sm'
---
::

## Group

To stack avatars as a group, use the `AvatarGroup` component.

- To limit the amount of avatars to show, use the `max` prop. It'll truncate the avatars and show a "+X" label (where X is the remaining avatars)
- To size all the avatars equally, pass the `size` prop
- To adjust the spacing or the ring between avatars, customize with `ui.avatarGroup.margin` or `ui.avatarGroup.ring`

::component-card{slug="UAvatarGroup"}
---
props:
  size: 'sm'
  max: 2
code: |
  <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" alt="benjamincanac" />
    <UAvatar src="https://avatars.githubusercontent.com/u/904724?v=4" alt="Atinux" />
    <UAvatar src="https://avatars.githubusercontent.com/u/7547335?v=4" alt="smarroufin" />
---

#default
:u-avatar{src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Avatar"}
:u-avatar{src="https://avatars.githubusercontent.com/u/904724?v=4" alt="Avatar"}
:u-avatar{src="https://avatars.githubusercontent.com/u/7547335?v=4" alt="Avatar"}
::

## Props

::tabs
  :component-props{label="Avatar"}
  :component-props{label="AvatarGroup" slug="UAvatarGroup"}
::

## Config

::tabs
  :component-preset{label="Avatar"}
  :component-preset{label="AvatarGroup" slug="AvatarGroup"}
::
