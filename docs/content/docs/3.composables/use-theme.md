---
title: useTheme
description: 'A composable to change the colors and the radius of your app at runtime.'
---

## Usage :badge{label="Soon" class="align-text-top"}

Use the auto-imported `useTheme` composable to change the colors and the radius of your app at runtime: per tenant, from settings stored in a database, or from a color picker.

```vue [app.vue]
<script setup lang="ts">
import colors from 'tailwindcss/colors'

const { data: tenant } = await useFetch('/api/tenant')

useTheme(() => ({
  colors: {
    primary: tenant.value?.color ?? colors.indigo
  },
  radius: tenant.value?.radius
}))
</script>
```

- Renders a `<style>` in the head, on the server too, so the first paint already has the colors.
- Updates when the options change, and goes away with the component that calls it.
- Wins over the colors set in CSS with the [`@nuxt/ui/colors` plugin](/docs/getting-started/theme/design-system#configure-colors), in light and dark mode.

A color alias takes a palette, from `50` to `950`, or a single color. A palette sets the shades behind the alias, so `bg-primary-600` follows it and dark mode keeps its lighter shade. A single color sets the alias alone, in both modes, which recolors the components but not the shade utilities. `neutral` only takes a palette, since the surfaces use its shades.

::tip
Tailwind only outputs the palettes your CSS uses, so give `useTheme` the values themselves: from `tailwindcss/colors`, from your API, or from a palette of your own.
::

## API

`useTheme(options: MaybeRefOrGetter<UseThemeOptions>): void`{lang="ts-type"}

### Parameters

::field-group

  ::field{name="options" type="MaybeRefOrGetter<UseThemeOptions>" required}
  The values to apply, or a ref or getter returning them.

    ::collapsible

      ::field-group
        ::field{name="colors" type="Partial<Record<Color, string | ThemeColorScale>>"}
        The palette of each color alias (`primary`, `secondary`, `success`, `info`, `warning`, `error`, `neutral`), as an object of shades from `50` to `950`, or a single color for all but `neutral`.
        ::

        ::field{name="radius" type="string"}
        The base radius the `rounded-*` utilities derive from, like `0.375rem`.
        ::
      ::
    ::
  ::
::
