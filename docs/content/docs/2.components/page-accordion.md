---
title: PageAccordion
description: 'A pre-styled Accordion to display in your pages.'
category: page
links:
  - label: Accordion
    icon: i-simple-icons-nuxtdotjs
    to: /docs/components/accordion
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/PageAccordion.vue
---

## Usage

The PageAccordion component is built on top of the [Accordion](/docs/components/accordion) component. It is styled to match other page components.

::component-code
---
ignore:
  - items
external:
  - items
props:
  items:
    - label: 'What are the main considerations when upgrading to Nuxt UI v3?'
      icon: 'i-lucide-circle-help'
      content: 'The transition to v3 involves significant changes, including new component structures, updated theming approaches, and revised TypeScript definitions. We recommend a careful, incremental upgrade process, starting with thorough testing in a development environment.'
    - label: 'Is Nuxt UI v3 compatible with standalone Vue projects?'
      icon: 'i-lucide-circle-help'
      content: 'Nuxt UI is now compatible with Vue! You can follow the installation guide to get started.'
    - label: 'What about Nuxt UI Pro?'
      icon: 'i-lucide-circle-help'
      content: 'We also rebuilt Nuxt UI Pro from scratch and released a v3.0.0-alpha.x package but it only contains the components to build this documentation yet. This will be a free update, so the license you buy now will be valid for v3. We are actively working to finish the rewrite of all Nuxt UI Pro components.'
class: 'px-8'
---
::

## Examples

### With markdown content

You can use the [MDC](https://github.com/nuxt-modules/mdc?tab=readme-ov-file#mdc) component from `@nuxtjs/mdc` to render markdown in the accordion items.

::component-example
---
collapse: true
name: 'page-accordion-markdown-example'
class: 'px-8'
---
::

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme
