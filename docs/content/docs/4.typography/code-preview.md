---
title: CodePreview
description: 'Show live previews alongside source code for interactive documentation.'
framework: nuxt
category: vue-components
---

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

## Theme

:component-theme{slug="code-preview" prose}

## Changelog

:component-changelog{prose}
