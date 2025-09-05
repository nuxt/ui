---
title: CodePreview
description: 'Display code examples with a preview and their source for clearer documentation.'
framework: nuxt
category: components
---

## Usage

Wrap any content with the `code-preview` component to display a live preview alongside its source code using the `code` slot.

::code-preview{class="[&>div]:*:my-0 [&>div]:*:w-full" label="Preview"}

::code-preview{class="[&>div]:*:my-0"}
`inline code`

#code

```mdc
`inline code`
```

::

#code

````mdc
::code-preview
`inline code`

#code
```mdc
`inline code`
```
::
````

::

## API

### Props

:component-props{name="code-preview" prose}

### Slots

:component-slots{name="code-preview" prose}

## Theme

:component-theme{slug="code-preview" prose}

## Changelog

:component-changelog{prose}
