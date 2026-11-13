---
description: A carousel with motion and swipe.
category: data
keywords:
  - swiper
  - gallery
  - image slider
  - slideshow
links:
  - label: Carousel
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/carousel
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v5/src/runtime/components/Carousel.vue
---

## Usage

Use the Carousel component to display a list of items in a carousel.

::component-example
---
collapse: true
overflowHidden: true
name: 'carousel-example'
class: '!p-0'
---
::

::note
Use your mouse to drag the carousel horizontally on desktop.
::

### Items

Use the `items` prop as an array and render each item using the default slot:

::component-example
---
name: 'carousel-items-example'
class: 'p-8'
---
::

You can also pass an array of objects with the following properties:

- `class?: any`{lang="ts-type"}
- `ui?: { item?: ClassNameValue }`{lang="ts-type"}

You can control how many items are visible by using the [`basis`](https://tailwindcss.com/docs/flex-basis) / [`width`](https://tailwindcss.com/docs/width) utility classes on the `item`:

::component-example
---
name: 'carousel-items-multiple-example'
class: 'p-8 px-16'
---
::

### Orientation

Use the `orientation` prop to change the orientation of the Carousel. Defaults to `horizontal`.

::note
Use your mouse to drag the carousel vertically on desktop.
::

::component-example
---
name: 'carousel-orientation-example'
class: 'p-8'
---
::

::caution
You need to specify a `height` on the container in vertical orientation.
::

### Arrows

Use the `arrows` prop to display prev and next buttons.

::component-example
---
name: 'carousel-arrows-example'
class: 'p-8'
---
::

### Prev / Next

Use the `prev` and `next` props to customize the prev and next buttons with any [Button](/docs/components/button) props.

::component-example
---
name: 'carousel-prev-next-example'
class: 'p-8'
---
::

### Prev / Next Icons

Use the `prev-icon` and `next-icon` props to customize the buttons [Icon](/docs/components/icon). Defaults to `i-lucide-arrow-left` / `i-lucide-arrow-right`.

::component-example
---
name: 'carousel-prev-next-icon-example'
class: 'p-8'
options:
  - name: 'prevIcon'
    label: 'prevIcon'
    default: 'i-lucide-chevron-left'
  - name: 'nextIcon'
    label: 'nextIcon'
    default: 'i-lucide-chevron-right'
---
::

::framework-only
#nuxt
:::tip{to="/docs/getting-started/integrations/icons/nuxt#theme"}
You can customize these icons globally in your `app.config.ts` under `ui.icons.arrowLeft` / `ui.icons.arrowRight` key.
:::

#vue
:::tip{to="/docs/getting-started/integrations/icons/vue#theme"}
You can customize these icons globally in your `vite.config.ts` under `icons.arrowLeft` / `icons.arrowRight` key.
:::
::

### Dots

Use the `dots` prop to display a list of dots to scroll to a specific slide.

::component-example
---
name: 'carousel-dots-example'
class: 'p-8 pb-12'
---
::

The number of dots is based on the number of slides displayed in the view:

::component-example
---
name: 'carousel-dots-multiple-example'
class: 'p-8 px-16 pb-12'
---
::

### Autoplay

Use the `autoplay` prop as a boolean or an object to move to the next slide on an interval. It pauses while the mouse is over the carousel and stops when a slide gets keyboard focus.

::component-example
---
name: 'carousel-autoplay-example'
class: 'p-8 px-16 pb-12'
---
::

::note
In this example, we're using the `loop` prop for an infinite carousel.
::

::tip
Use `v-model:playing` to start or stop the rotation from your own controls.
::

### Auto Scroll

Use the `auto-scroll` prop as a boolean or an object to scroll the carousel continuously. Its `speed` is in pixels per second.

::component-example
---
name: 'carousel-auto-scroll-example'
class: 'p-8 px-16 pb-12'
---
::

::note
In this example, we're using the `loop` prop for an infinite carousel.
::

### Auto Height

Use the `auto-height` prop to give the viewport the height of the slides in view.

::component-example
---
name: 'carousel-auto-height-example'
class: 'p-8 pt-16'
---
::

::note
In this example, we add the `transition-[height]` class on the `viewport` to animate the height change.
::

### Fade

Use the `fade` prop to stack the slides and cross-fade between them instead of sliding.

::component-example
---
name: 'carousel-fade-example'
class: 'p-8 pb-12'
---
::

### Wheel Gestures

Use the `wheel-gestures` prop to navigate the carousel with the mouse wheel.

::note
Use your mouse wheel to scroll the carousel.
::

::component-example
---
name: 'carousel-wheel-gestures-example'
class: 'p-8 px-16'
---
::

## Examples

### With active slide

The current slides get a `data-active` attribute and the slides in view a `data-in-view` attribute, so you can style them with the `data-active:` and `data-in-view:` variants.

::component-example
---
name: 'carousel-active-example'
class: 'p-8'
---
::

::note
In this example, we add the `transition-opacity not-data-active:opacity-10` classes on the `item` to fade out the other slides. The `active` and `inView` props of the default slot carry the same state.
::

### With thumbnails

Use the `v-model` directive to control the current slide and display thumbnails under the carousel that navigate to it.

::component-example
---
name: 'carousel-thumbnails-example'
class: 'p-8 px-16'
---
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

## Changelog

:component-changelog
