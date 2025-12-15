---
title: extendLocale
description: 'A utility to extend an existing locale with custom translations.'
---

## Usage

Use the `extendLocale` utility to customize an existing locale by overriding specific properties or messages.

```vue
<script setup lang="ts">
import { en } from '@nuxt/ui/locale'

const locale = extendLocale(en, {
  code: 'en-AU',
  messages: {
    commandPalette: {
      placeholder: 'Search a component...'
    }
  }
})
</script>

<template>
  <UApp :locale="locale">
    <NuxtPage />
  </UApp>
</template>
```

This is useful when you want to:
- Create a regional variant of a language (e.g., `en-AU` from `en`)
- Override specific translations without redefining the entire locale
- Customize component labels for your application

::tip{to="/docs/getting-started/integrations/i18n"}
Learn more about internationalization in the **i18n integration** documentation.
::

## API

`extendLocale<M>(locale: Locale<M>, options: Partial<DefineLocaleOptions<DeepPartial<M>>>): Locale<M>`{lang="ts-type"}

Extends an existing locale with the provided options, deeply merging the messages.

#### Parameters

::field-group
  ::field{name="locale" type="Locale<M>" required}
  The base locale to extend. Import from `@nuxt/ui/locale`.
  ::

  ::field{name="options" type="Partial<DefineLocaleOptions<DeepPartial<M>>>" required}
  The properties to override:

  ::collapsible
    ::field-group
      ::field{name="name" type="string"}
      Override the display name of the locale.
      ::

      ::field{name="code" type="string"}
      Override the ISO code of the locale (e.g., `'en-GB'`, `'fr-CA'`).
      ::

      ::field{name="dir" type="'ltr' | 'rtl'"}
      Override the text direction of the locale.
      ::

      ::field{name="messages" type="DeepPartial<M>"}
      Partial messages object to merge with the base locale. Only specify the messages you want to override.
      ::
    ::
  ::
  ::
::

**Returns:** A new `Locale<M>` object with the merged properties.

## Example

Here's an example extending the English locale for an Australian variant:

```vue
<script setup lang="ts">
import { en } from '@nuxt/ui/locale'

const locale = extendLocale(en, {
  name: 'English (Australia)',
  code: 'en-AU',
  messages: {
    colorMode: {
      dark: 'Dark',
      light: 'Light',
      system: 'System'
    },
    selectMenu: {
      search: 'Search…',
      noData: 'No results found',
      noMatch: 'No matching results'
    }
  }
})
</script>

<template>
  <UApp :locale="locale">
    <NuxtPage />
  </UApp>
</template>
```

::note
The `extendLocale` utility uses deep merging, so you only need to specify the messages you want to override. All other messages will be inherited from the base locale.
::
