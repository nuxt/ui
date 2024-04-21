---
description: Add a pagination to handle pages.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/navigation/Pagination.vue
---

## Usage

Use a `v-model` to get a reactive page alongside a `total` which represents the total of items. You can also use the `page-count` prop to define the number of items per page which defaults to `10`.

:component-example{component="pagination-example-basic"}

### Max

Use the `max` prop to set a maximum of displayed pages. Defaults to `7`, being the minimum.

::component-card
---
baseProps:
  modelValue: 1
props:
  max: 5
  pageCount: 5
  total: 100
excludedProps:
  - pageCount
  - total
---
::

### Size

Use the `size` prop to change the size of the buttons.

::component-card
---
baseProps:
  modelValue: 1
  total: 100
  showLast: true
  showFirst: true
props:
  size: 'sm'
---
::

### Links

Use the `to` property to transform buttons into links. Note that it must be a function that receives the page number and returns a route destination.

:component-example{component="pagination-example-to"}

### Disabled

Use the `disabled` prop to disable all the buttons.

::component-card
---
baseProps:
  modelValue: 1
  total: 100
  showLast: true
  showFirst: true
props:
  disabled: true
---
::

### Active / Inactive

Use the `active-button` and `inactive-button` props to customize the active and inactive buttons of the Pagination.

::component-card
---
baseProps:
  modelValue: 1
  total: 100
props:
  activeButton:
    variant: 'outline'
  inactiveButton:
    color: 'gray'
excludedProps:
  - activeButton
  - inactiveButton
---
::

### Prev / Next

Use the `prev-button` and `next-button` props to customize the prev and next buttons of the Pagination.

::component-card
---
baseProps:
  modelValue: 1
  total: 100
props:
  prevButton:
    icon: 'i-heroicons-arrow-small-left-20-solid'
    label: Prev
    color: 'gray'
  nextButton:
    icon: 'i-heroicons-arrow-small-right-20-solid'
    trailing: true
    label: Next
    color: 'gray'
excludedProps:
  - prevButton
  - nextButton
---
::

### First / Last

Use the `first-button` and `last-button` props to customize the first and last buttons of the Pagination.

::component-card
---
baseProps:
  modelValue: 1
  total: 100
  showFirst: true
  showLast: true
props:
  firstButton:
    icon: 'i-heroicons-arrow-small-left-20-solid'
    label: First
    color: 'gray'
  lastButton:
    icon: 'i-heroicons-arrow-small-right-20-solid'
    trailing: true
    label: Last
    color: 'gray'
excludedProps:
  - firstButton
  - lastButton
---
::

## Slots

### `prev` / `next`

Use the `#prev` and `#next` slots to set the content of the previous and next buttons.

:component-example{component="pagination-example-prev-next-slots"}

### `first` / `last`

Use the `#first` and `#last` slots to set the content of the first and last buttons.

:component-example{component="pagination-example-first-last-slots"}

## Props

:component-props

## Config

:component-preset
