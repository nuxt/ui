---
description: A carousel with motion and swipe support.
links:
  - label: Embla
    to: https://www.embla-carousel.com/api/
    icon: i-custom-embla-carousel
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Carousel.vue
---

## Usage

### Items

### Orientation

### Arrows

### Prev / Next

### Prev Icon / Next Icon

### Dots

## Plugins

The Carousel component implements the official [Embla Carousel plugins](https://www.embla-carousel.com/plugins/).

::warning
You need to install each plugin individually as Nuxt UI does not bundle them.
::

### Autoplay

1. Install the `embla-carousel-autoplay` package:

::code-group

```bash [pnpm]
pnpm add embla-carousel-autoplay
```

```bash [yarn]
yarn add embla-carousel-autoplay
```

```bash [npm]
npm install embla-carousel-autoplay
```

```bash [bun]
bun add embla-carousel-autoplay
```

::

### Auto Scroll

1. Install the `embla-carousel-auto-scroll` package:

::code-group

```bash [pnpm]
pnpm add embla-carousel-auto-scroll
```

```bash [yarn]
yarn add embla-carousel-auto-scroll
```

```bash [npm]
npm install embla-carousel-auto-scroll
```

```bash [bun]
bun add embla-carousel-auto-scroll
```

::

### Auto Height

1. Install the `embla-carousel-auto-height` package:

::code-group

```bash [pnpm]
pnpm add embla-carousel-auto-height
```

```bash [yarn]
yarn add embla-carousel-auto-height
```

```bash [npm]
npm install embla-carousel-auto-height
```

```bash [bun]
bun add embla-carousel-auto-height
```

::

### Class Names

1. Install the `embla-carousel-class-names` package:

::code-group

```bash [pnpm]
pnpm add embla-carousel-class-names
```

```bash [yarn]
yarn add embla-carousel-class-names
```

```bash [npm]
npm install embla-carousel-class-names
```

```bash [bun]
bun add embla-carousel-class-names
```

::

### Fade

1. Install the `embla-carousel-fade` package:

::code-group

```bash [pnpm]
pnpm add embla-carousel-fade
```

```bash [yarn]
yarn add embla-carousel-fade
```

```bash [npm]
npm install embla-carousel-fade
```

```bash [bun]
bun add embla-carousel-fade
```

::

### Wheel Gestures

1. Install the `embla-carousel-wheel-gestures` package:

::code-group

```bash [pnpm]
pnpm add embla-carousel-wheel-gestures
```

```bash [yarn]
yarn add embla-carousel-wheel-gestures
```

```bash [npm]
npm install embla-carousel-wheel-gestures
```

```bash [bun]
bun add embla-carousel-wheel-gestures
```

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
  - onClick
---
::

### Slots

:component-slots

### Expose

When accessing the component via a template ref, you can use the following:

| Name | Type |
| ---- | ---- |
| `emblaRef`{lang="ts-type"} | `Ref<HTMLElement \| null>`{lang="ts-type"} |
| `emblaApi`{lang="ts-type"} | [`Ref<EmblaCarouselType \| null>`{lang="ts-type"}](https://www.embla-carousel.com/api/methods/#typescript) |

## Theme

:component-theme
