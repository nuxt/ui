---
description: A component to display any icon from Iconify or another component.
category: element
links:
  - label: Iconify
    to: https://iconify.design/
    target: _blank
    icon: i-simple-icons-iconify
---

## Usage

Use the `name` prop to display an icon:

::component-code
---
props:
  name: 'i-lucide-lightbulb'
  class: 'size-5'
---
::

::note
You can use any name from the <https://iconify.design> collection. Browse them easily on <https://icones.js.org> or search directly from your AI assistant using the [`search_icons`](/docs/getting-started/ai/mcp#available-tools) MCP tool.
::

::framework-only
#nuxt
:::caution{to="/docs/getting-started/integrations/icons/nuxt#collections"}
It's highly recommended to install the icons collections you need, read more about this.
:::
::

## Examples

### SVG

You can also pass a Vue component into the `name` prop:

::component-example
---
name: 'icon-svg-example'
---
::

You can define your icon components yourself, or use [`unplugin-icons`](https://github.com/unplugin/unplugin-icons) to import them directly from SVG files:

```vue
<script setup lang="ts">
import IconLightbulb from '~icons/lucide/lightbulb'
</script>

<template>
  <UIcon :name="IconLightbulb" class="size-5" />
</template>
```

## API

### Props

:component-props

## Changelog

:component-changelog
