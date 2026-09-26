---
description: A headless component to theme child components.
category: layout
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v5/src/runtime/components/Theme.vue
---

## Usage

The Theme component overrides default **slot classes** and **props** of all child components without modifying each one individually. It uses Vue's `provide` / `inject` mechanism under the hood, so the overrides apply at any depth.

::note
The Theme component doesn't render any HTML element, it only provides theme overrides to its children.
::

::framework-only
#nuxt
:::tip
For app-level theme configuration, we recommend using the `app.config.ts` file instead.
:::

#vue
:::tip
For app-level theme configuration, we recommend using the `vite.config.ts` file instead.
:::
::

### Slot classes

Use the `ui` prop to override slot classes of descendant components. Keys are component names (camelCase) and values are their slot class overrides.

::component-example
---
name: 'theme-ui-example'
---
::

### Prop defaults :badge{label="4.8+" class="align-text-top"}

Use the `props` prop to override the default value of any prop on descendant components. Each key maps to a partial of that component's props.

::component-example
---
name: 'theme-props-example'
---
::

::tip
Explicit props on a component (e.g. `<UButton color="primary" />`) always win over `<UTheme :props>`. Theme defaults only apply when the prop wasn't passed explicitly.
::

### Default variants :badge{label="Soon" class="align-text-top"}

Use the `'*'` key of `props` to change the default `color` and `size` of every descendant component. It only replaces the library defaults, `primary` and `md`, so a component with its own default keeps it: Avatar stays `neutral` and Separator stays `xs`. A component's own key takes priority over `'*'`.

::component-example
---
name: 'theme-default-variants-example'
---
::

::framework-only
#nuxt
:::tip
Set `ui.defaultVariants` in your `app.config.ts` to apply them to your whole app:

```ts [app.config.ts]
export default defineAppConfig({
  ui: {
    defaultVariants: {
      color: 'neutral',
      size: 'sm'
    }
  }
})
```
:::

#vue
:::tip
Set `ui.defaultVariants` in your `vite.config.ts` to apply them to your whole app:

```ts [vite.config.ts]
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [
    vue(),
    ui({
      ui: {
        defaultVariants: {
          color: 'neutral',
          size: 'sm'
        }
      }
    })
  ]
})
```
:::
::

### Unstyled :badge{label="Soon" class="align-text-top"}

Use the `unstyled` prop to render descendant components without their theme classes. Only the classes you supply through `class`, `ui` or `app.config.ui` remain, so you can style them from scratch. The `color` prop keeps working: its `[--ui-accent:…]` class stays, so the `accent` utilities you add, like `bg-accent`, follow it. Set it to `false` on a nested Theme to style a subtree again.

::component-example
---
name: 'theme-unstyled-example'
---
::

::warning
This strips **structural** classes too (positioning, transitions, flex/grid), not just cosmetic ones. Layout-heavy components like `Modal`, `Drawer` or `Calendar` will need you to re-supply their layout.
::

::framework-only
#nuxt
:::tip
Set `ui.unstyled` in your `app.config.ts` to apply it to your whole app.
:::

#vue
:::tip
Set `ui.unstyled` in the `ui` options of your `vite.config.ts` to apply it to your whole app.
:::
::

### Variants :badge{label="Soon" class="align-text-top"}

Use the `variants` prop to change the classes of a component's variant values in a subtree, or to add values. It takes the same shape as the `variants` of the component in `app.config.ui`. For a value and slot you set, its classes replace the ones from your app config, and a nested Theme's replace the ones above it.

::component-example
---
name: 'theme-variants-example'
---
::

::note
Unlike the `ui` prop, which applies to every instance of a component, a variant only applies where the component uses that value: here the `soft` buttons, not the `solid` one.
::

::tip
A value you add this way works at runtime, but it isn't part of the component's prop types. Add it to the component's `variants` in your app config to get it typed.
::

### Icons :badge{label="Soon" class="align-text-top"}

Use the `icons` prop to change the icons descendant components use, merged over `app.config.ui.icons`.

::component-example
---
name: 'theme-icons-example'
---
::

## Examples

### Multiple components

Use different keys in `ui` or `props` to theme multiple component types at once.

::component-example
---
name: 'theme-multiple-example'
---
::

### Nested themes

Nest multiple Theme components to compose overrides. The innermost Theme takes precedence, while unoverridden keys are inherited from the outer Theme.

::component-example
---
name: 'theme-nested-example'
---
::

### Explicit priority

Explicitly setting any prop (including `ui`) on an individual component always takes priority over the Theme component.

::component-example
---
name: 'theme-priority-example'
---
::

### Deep propagation

The overrides are available to all descendant components regardless of how deeply nested they are.

::component-example
---
name: 'theme-deep-example'
---
::

::note
In this example, `MyButton` is a custom component that renders a `UButton` internally. The theme overrides still apply because they propagate through the entire component tree.
::

### Form components

Use the Theme component to apply consistent styling across a group of form components.

::component-example
---
name: 'theme-form-example'
---
::

::tip
`<UFormField>`, `<UFieldGroup>` and `<UAvatarGroup>` keep precedence over `<UTheme :props>` for `size`, `color` and `highlight`. Validation errors also force the `error` color over any theme value.
::

### Prose components

Use the `prose` namespace to theme typography components. Keys are nested under `prose` (e.g. `prose.p`, `prose.code`).

::component-example
---
name: 'theme-prose-example'
---
::

## API

### Props

:component-props

### Slots

:component-slots

## Changelog

:component-changelog
