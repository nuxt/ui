---
title: Accordion
description: 'Create expandable content sections for better information organization.'
framework: nuxt
category: vue-components
---

Use the `accordion` and `accordion-item` components to display an [Accordion](/docs/components/accordion) in your content.

::code-preview{class="[&>div]:*:my-0"}

:::accordion

::accordion-item{label="What are the main considerations when upgrading to Nuxt UI v3?" icon="i-lucide-circle-help"}
The transition to v3 involves significant changes, including new component structures, updated theming approaches, and revised TypeScript definitions. We recommend a careful, incremental upgrade process, starting with thorough testing in a development environment.
::

::accordion-item{label="Is Nuxt UI v3 compatible with standalone Vue projects?" icon="i-lucide-circle-help"}
Nuxt UI is now compatible with Vue! You can follow the [installation guide](/docs/getting-started/installation/vue) to get started.
::

::accordion-item{label="Can I customize the default styling?" icon="i-lucide-circle-help"}
Yes! Nuxt UI provides a comprehensive theming system that allows you to customize colors, spacing, typography, and component variants. You can override defaults through your app configuration or create entirely custom themes while maintaining accessibility and consistency.
::

:::

#code

```mdc
::accordion

::accordion-item{label="What are the main considerations when upgrading to Nuxt UI v3?" icon="i-lucide-circle-help"}
The transition to v3 involves significant changes, including new component structures, updated theming approaches, and revised TypeScript definitions. We recommend a careful, incremental upgrade process, starting with thorough testing in a development environment.
::

::accordion-item{label="Is Nuxt UI v3 compatible with standalone Vue projects?" icon="i-lucide-circle-help"}
Nuxt UI is now compatible with Vue! You can follow the [installation guide](/docs/getting-started/installation/vue) to get started.
::

::accordion-item{label="Can I customize the default styling?" icon="i-lucide-circle-help"}
Yes! Nuxt UI provides a comprehensive theming system that allows you to customize colors, spacing, typography, and component variants. You can override defaults through your app configuration or create entirely custom themes while maintaining accessibility and consistency.
::

::
```

::

## API

### Props

:component-props{name="accordion" prose}

## Theme

::component-theme{slug="accordion" prose}
---
extra:
  - accordionItem
---
::

## Changelog

:component-changelog{prose}