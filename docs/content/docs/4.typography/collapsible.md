---
title: Collapsible
description: 'Toggle content visibility with smooth expand and collapse animations.'
framework: nuxt
category: components
---

## Usage

Wrap your content with the `collapsible` component to display a [Collapsible](/docs/components/collapsible) in your content.

::code-preview{class="[&>div]:*:w-full [&>div]:*:my-0"}

::collapsible

| Prop    | Default   | Type                     |
|---------|-----------|--------------------------|
| `name`  |           | `string`{lang="ts-type"} |
| `size`  | `md`      | `string`{lang="ts-type"} |
| `color` | `neutral` | `string`{lang="ts-type"} |

::

#code

```mdc
::collapsible

| Prop    | Default   | Type                     |
|---------|-----------|--------------------------|
| `name`  |           | `string`{lang="ts-type"} |
| `size`  | `md`      | `string`{lang="ts-type"} |
| `color` | `neutral` | `string`{lang="ts-type"} |

::
```

::

## API

### Props

:component-props{name="collapsible" prose}

### Slots

:component-slots{name="collapsible" prose}

## Theme

:component-theme{slug="collapsible" prose}

## Changelog

:component-changelog{prose}
