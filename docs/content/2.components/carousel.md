---
description: Display images or content in a scrollable area.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/elements/Carousel.vue
---

## Usage

Drag with your mouse, scroll with your mouse wheel or use the navigation arrows to navigate.

Pass an array to the `items` prop and use the default slot to display the content of each item.

:component-example{component="carousel-example"}

### Snap

The carousel will snap the item to the center (`snap-center`). You can use the `snap` utility classes to change this behavior using the `ui` prop:

#### Snap to start

::component-example
---
component: 'carousel-example-snap-start'
---

#code
```vue
<template>
  <UCarousel v-slot="{ item }" :items="items" :ui="{ item: 'snap-start' }">
    <img :src="item" width="200" height="300">
  </UCarousel>
</template>
```
::

#### Snap to end

::component-example
---
component: 'carousel-example-snap-end'
---

#code
```vue
<template>
  <UCarousel v-slot="{ item }" :items="items" :ui="{ item: 'snap-end' }">
    <img :src="item" width="200" height="300">
  </UCarousel>
</template>
```
::

::callout{icon="i-heroicons-light-bulb" to="https://tailwindcss.com/docs/scroll-snap-align" target="_blank"}
Learn more about the `scroll-snap-align` property on the Tailwind CSS documentation.
::

### Size

Each item will take its own size by default in the carousel. You can use the `basis` / `width` utility classes to change this behavior using the `ui` prop:

:component-example{component="carousel-example-size"}

In this example, we used `basis-1/3` to display 3 items at a time but you can also use this to make the carousel full width using `basis-full` and display only one item at a time:

:component-example{component="carousel-example-size-full"}

You can also set a width on the container to center the carousel:

:component-example{component="carousel-example-size-center"}

::callout{icon="i-heroicons-light-bulb" to="https://tailwindcss.com/docs/flex-basis" target="_blank"}
Learn more about the `flex-basis` property on the Tailwind CSS documentation.
::

## Navigation

### Arrows

Use the `arrows` prop to enable prev and next buttons, they will be automatically disabled when the carousel reaches the first or last item.

:component-example{component="carousel-example-arrows"}

You can also customize the prev and next buttons using the `prev-button` and `next-button` props:

:component-example{component="carousel-example-arrows-center"}

In this example, we move the buttons outside of the carousel container. You can also change this globally in `ui.carousel.default.prevButton` and `ui.carousel.default.nextButton`.

### Indicators

Use the `indicators` prop to display a list of buttons at the bottom of the carousel to navigate between items.

:component-example{component="carousel-example-indicators"}

The number of indicators will be automatically generated based on the number of items:

:component-example{component="carousel-example-indicators-size"}

## Autoplay

You can easily implement an autoplay behavior using the exposed [API](#api) through a template ref.

:component-example{component="carousel-example-autoplay"}

## Slots

### `default`

You can put anything inside the default slot, not only images. You will have access to the `item` and `index` properties in the slot scope.

:component-example{component="carousel-example-slots-default"}

### `prev` / `next`

With the `arrows` prop enabled, use the `#prev` and `#next` slots to set the content of the previous and next buttons. You will have access to the `disabled` property and `on-click` method in the slot scope.

:component-example{component="carousel-example-slots-prev-next"}

::callout{icon="i-heroicons-light-bulb"}
You can customize the position of the buttons through `ui.arrows.wrapper`.
::

### `indicator`

With the `indicators` prop enabled, use the `#indicator` slot to set the content of the indicators. You will have access to the `active`, `page` properties and `on-click` method in the slot scope.

:component-example{component="carousel-example-slots-indicator"}

::callout{icon="i-heroicons-light-bulb"}
You can customize the position of the buttons through `ui.indicators.wrapper`.
::

## Props

:component-props

## API

When accessing the component via a template ref, you can use the following:

::field-group
  ::field{name="page" type="number"}
    The current page.
  ::
  ::field{name="pages" type="number"}
    The total number of pages.
  ::
  ::field{name="select (page)"}
    Go to a specific page.
  ::
  ::field{name="next ()"}
    Go to the next page.
  ::
  ::field{name="prev ()"}
    Go to the previous page.
  ::
::

## Config

:component-preset
