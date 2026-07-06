# Component Structure

## File Location

Components live in `src/runtime/components/` with PascalCase naming (e.g., `Button.vue`, `InputMenu.vue`).

## Standard Component Template

```vue
<script lang="ts">
// 1. Type imports first (always separate)
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../types/tv'

// 2. Theme import
import theme from '#build/ui/component-name'

// 3. Type definition
type ComponentName = ComponentConfig<typeof theme, AppConfig, 'componentName'>

// 4. Props interface with JSDoc defaults
export interface ComponentNameProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * @defaultValue 'primary'
   */
  color?: ComponentName['variants']['color']
  /**
   * @defaultValue 'md'
   */
  size?: ComponentName['variants']['size']
  class?: any
  ui?: ComponentName['slots']
}

// 5. Slots interface - always pass ui for customization
//    Return type is VNode[], slots are optional with `?`
export interface ComponentNameSlots {
  default?(props: { ui: ComponentName['ui'] }): VNode[]
}
</script>

<script setup lang="ts">
// 6. Regular imports (separate from type imports)
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { tv } from '../utils/tv'

// 7. Raw props (use withDefaults only when you actually need a runtime default)
const _props = defineProps<ComponentNameProps>()
const slots = defineSlots<ComponentNameSlots>()

// 8. Theme-aware proxy: resolves explicit > <UTheme :props> > withDefaults
//    > app.config.ui.<name>.defaultVariants. The `ui` prop is deep-merged
//    automatically, so reach for `props.ui?.<slot>` in the template.
//    `theme.defaultVariants` is NOT in this chain — it only feeds `tv()`
//    class resolution.
const props = useComponentProps('componentName', _props)

// 9. App config
const appConfig = useAppConfig() as ComponentName['AppConfig']

// 10. Computed UI - always computed for reactivity
const ui = computed(() => tv({
  extend: tv(theme),
  ...(appConfig.ui?.componentName || {})
})({
  color: props.color,
  size: props.size
}))
</script>

<template>
  <!-- 11. data-slot on every element, always read props as `props.x` -->
  <Primitive :as="props.as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot :ui="ui" />
  </Primitive>
</template>
```

## Reka UI Components

For components wrapping Reka UI primitives (example: `Collapsible.vue`):

```vue
<script lang="ts">
import type { CollapsibleRootProps, CollapsibleRootEmits } from 'reka-ui'
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/collapsible'
import type { ComponentConfig } from '../types/tv'

type Collapsible = ComponentConfig<typeof theme, AppConfig, 'collapsible'>

export interface CollapsibleProps extends Pick<CollapsibleRootProps, 'defaultOpen' | 'open' | 'disabled' | 'unmountOnHide'> {
  as?: any
  class?: any
  ui?: Collapsible['slots']
}

export interface CollapsibleEmits extends CollapsibleRootEmits {}

export interface CollapsibleSlots {
  default?(props: { open: boolean }): VNode[]
  content?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useForwardProps } from '../composables/useForwardProps'
import { tv } from '../utils/tv'

const _props = withDefaults(defineProps<CollapsibleProps>(), {
  unmountOnHide: true
})
const emits = defineEmits<CollapsibleEmits>()
const slots = defineSlots<CollapsibleSlots>()

// Theme-aware proxy. `props` deep-merges `ui` and resolves <UTheme :props> defaults.
const props = useComponentProps('collapsible', _props)

const appConfig = useAppConfig() as Collapsible['AppConfig']

// Pick from `props` (the proxy) so theme-supplied values flow through.
// Use the local `useForwardProps` — reka-ui's `useForwardProps` /
// `useForwardPropsEmits` filter root props by `vm.vnode.props ∪ withDefaults`
// and would strip <UTheme :props> values.
const rootProps = useForwardProps(reactivePick(props, 'as', 'defaultOpen', 'open', 'disabled', 'unmountOnHide'), emits)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.collapsible || {}) })())
</script>

<template>
  <CollapsibleRoot v-slot="{ open }" v-bind="rootProps" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <CollapsibleTrigger v-if="!!slots.default" as-child>
      <slot :open="open" />
    </CollapsibleTrigger>

    <CollapsibleContent data-slot="content" :class="ui.content({ class: props.ui?.content })">
      <slot name="content" />
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
```

## Generic Components

For components with typed items (Accordion, Select, Table):

```vue
<script lang="ts">
export interface AccordionItem {
  label?: string
  icon?: string
  content?: string
  value?: string
  disabled?: boolean
  [key: string]: any
}

export interface AccordionProps<T extends AccordionItem = AccordionItem> {
  items?: T[]
  // ...
}
</script>

<script setup lang="ts" generic="T extends AccordionItem">
const props = withDefaults(defineProps<AccordionProps<T>>(), {
  type: 'single',
  collapsible: true
})
</script>
```

## Form Components

For inputs that integrate with UForm:

```vue
<script setup lang="ts">
import { useFormField } from '../composables/useFormField'
import { useFieldGroup } from '../composables/useFieldGroup'

defineOptions({ inheritAttrs: false })

// Pass raw `_props` (not the proxy) so the wrapping `<UFormField>` /
// `<UFieldGroup>` keep precedence over `<UTheme :props>` / `withDefaults` /
// `app.config` defaults. Their internal fallback is `props?.x ?? injected.x`,
// so handing them the proxy would leak theme defaults into "explicit prop"
// and silently override the wrapper.
const {
  id, name, size: formFieldSize, color, highlight, disabled,
  ariaAttrs, emitFormBlur, emitFormInput, emitFormChange
} = useFormField<InputProps>(_props, { deferInputValidation: true })

const { orientation, size: fieldGroupSize } = useFieldGroup<InputProps>(_props)

const inputSize = computed(() => fieldGroupSize.value || formFieldSize.value)

// In `tv()` calls, fall back to `props.X` (the proxy) so `<UTheme :props>`
// applies when there is no wrapping FormField/FieldGroup. Without `?? props.X`,
// theme size/color/highlight is silently dropped on bare inputs.
//
// Final precedence: explicit > closer-context (form/group) > <UTheme :props>
//                   > withDefaults > app.config > tv defaults
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.input || {}) })({
  color: color.value ?? props.color,
  size: inputSize.value ?? props.size,
  highlight: highlight.value ?? props.highlight,
  variant: props.variant
}))
</script>

<template>
  <input
    :id="id"
    :name="name"
    :disabled="disabled"
    v-bind="{ ...$attrs, ...ariaAttrs }"
    @blur="emitFormBlur"
    @input="emitFormInput"
    @change="emitFormChange"
  >
</template>
```

The same `?? props.X` pattern applies to `useAvatarGroup` (`size`) and any other context composable whose contract is `props?.x ?? injected.x`. The composable itself stays untouched — the fallback lives at the `tv()` call site so the wrapper-vs-theme precedence is explicit and reviewable.

## `data-slot` on the root

Parents label a child by passing `data-slot` (e.g. `<UIcon data-slot="leadingIcon" />`, `<UAvatar data-slot="leadingAvatar" />`). The rule is: **a caller-supplied `data-slot` always wins on the component's root element**, with the component's own value (`root`/`base`) as the fallback. Inner elements keep their own `data-slot`.

How you achieve it depends on how the root receives attributes:

- **Single root, default `inheritAttrs`** (Badge, Card, …): nothing to do. Vue's attribute fallthrough already lets the caller's `data-slot` override the static one on the root. This only holds when the template root renders an element: `Button`'s root is a renderless `ULink custom` that hands `$attrs` back as slot props, so its `ULinkBase` needs the default placed before the spread (`<ULinkBase data-slot="base" v-bind="slotProps">`), same as the `$attrs` case below.
- **`inheritAttrs: false`, `$attrs` spread on the root**: fallthrough is off, so a static `data-slot="root"` placed *after* `v-bind` would win over the caller. Put the default *before* the spread instead, so a caller value in `$attrs` overrides it:

  ```vue
  <!-- bare $attrs: data-slot before v-bind -->
  <Primitive :as="props.as" data-slot="root" v-bind="$attrs" :class="ui.root({ class: [props.ui?.root, props.class] })" />

  <!-- object spread: fold the default in as the first key -->
  <Separator v-bind="{ 'data-slot': 'root', ...rootProps, ...$attrs }" :class="ui.root({ class: [props.ui?.root, props.class] })" />
  ```

- **`inheritAttrs: false`, `$attrs` forwarded to an inner element** (Avatar, Input, Checkbox, Switch, …): the root never receives `$attrs`, so read the caller's value on the root explicitly, and keep each inner element's own `data-slot` *after* its `$attrs` spread so the caller's value does not leak onto it:

  ```vue
  <Primitive :as="props.as" :data-slot="($attrs['data-slot'] as string | undefined) ?? 'root'" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <input v-bind="{ ...$attrs, ...ariaAttrs }" data-slot="base" :class="ui.base({ class: props.ui?.base })">
  </Primitive>
  ```

  For `<Slot>` forwards and inner elements that have no `data-slot` of their own, strip it from what you forward so it cannot leak: `v-bind="{ ...$attrs, 'data-slot': undefined }"`. The same applies when attributes are forwarded from the script, like `Editor` spreading `useAttrs()` into tiptap's `editorProps.attributes`: use `omit(attrs, ['data-slot'])`.

The rule is enforced by `test/components/DataSlot.spec.ts`, which mounts every component with a caller `data-slot` and asserts it lands exactly once, on the outermost rendered element.

## Components with Icons

```vue
<script setup lang="ts">
import { useComponentIcons } from '../composables/useComponentIcons'
import UIcon from './Icon.vue'

const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)
</script>

<template>
  <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon" :class="ui.leadingIcon()" />
</template>
```

## Exposing Refs

```vue
<script setup lang="ts">
const inputRef = useTemplateRef('inputRef')

defineExpose({
  inputRef
})
</script>
```

## Theme Defaults

`useComponentProps` is the primary integration with `<UTheme>`. The proxy resolves the priority chain **explicit prop > nearest `<UTheme :props>` > `withDefaults` > `app.config.ui.<name>.defaultVariants`** for every prop — including ones driving template logic that `tv().defaultVariants` can't reach (`<component :is>`, `v-if`, computed conditionals). `theme.defaultVariants` is intentionally NOT in the proxy chain — it only feeds `tv()` class resolution. If a prop value is consumed in template logic, it must come from one of the proxy-resolved sources (typically `withDefaults`):

```vue
<template>
  <component :is="props.variant === 'list' ? 'div' : Label" />
</template>
```

Notes:
- The proxy passes through to `_props` for explicitly set props, so `withDefaults` fallbacks stay lower priority than `<UTheme>` overrides.
- The `ui` prop is deep-merged (slot classes layered on top of theme overrides). All other props are explicit-wins.
- **Always read props as `props.x` in templates and `<script setup>`.** Bare prop names (`{{ label }}`, `v-if="arrow"`) resolve to `_props` and bypass the proxy, so `<UTheme :props>` defaults won't apply. The `nuxt-ui/no-bare-prop-refs` ESLint rule autofixes this.
- Pass the **raw** `_props` (not the proxy) to context composables — `useFormField`, `useFieldGroup`, `useAvatarGroup`. Their internal fallback is `props?.x ?? injected.x`, so the wrapping `<UFormField>` / `<UFieldGroup>` / `<UAvatarGroup>` should beat `<UTheme :props>` / `withDefaults` / `app.config` defaults (closer context wins). **Then always fall back to the proxy in `tv()` calls** — `size: formSize.value ?? props.size`, `color: color.value ?? props.color`, `highlight: highlight.value ?? props.highlight`. Without `?? props.X`, `<UTheme :props>` is silently dropped when no closer context wraps the component. Final chain: `explicit > closer-context > UTheme > withDefaults > app.config > tv defaults`. `useComponentIcons` has no injection chain, so pass the proxy `props` directly.
- Reka primitives' `useForwardProps` / `useForwardPropsEmits` filter root props by `vm.vnode.props ∪ withDefaults` and would strip theme-supplied values. Import `useForwardProps` from `composables/useForwardProps.ts` instead — same `(source, emits?)` signature, proxy-aware.

## Key Patterns

| Pattern | Usage |
|---------|-------|
| `useComponentProps(name, _props)` | Theme-aware proxy — default for new components |
| `useForwardProps(source, emits?)` (local) | Forward Reka UI props/emits without filtering theme defaults |
| `withDefaults` | Runtime default values |
| `defineOptions({ inheritAttrs: false })` | When spreading `$attrs` to inner element |
| Caller `data-slot` wins on root | Fold default into the root `v-bind` before `...$attrs`, or read `$attrs['data-slot']` on the root — see [`data-slot` on the root](#data-slot-on-the-root) |
| `reactivePick` | Pick keys off `props` (the proxy) before forwarding |
| `createReusableTemplate` | Complex template reuse (Table, Modal) |
| `useTemplateRef` | Template refs (Vue 3.5+) |
| `toRef(() => props.x)` | Reactive prop access |

## Export Types

Add to `src/runtime/types/index.ts`:

```ts
export * from '../components/ComponentName.vue'
```

## Register in `ThemeDefaults`

The `ThemeDefaults` interface in `src/runtime/composables/useComponentProps.ts` powers autocomplete inside `<UTheme :props="{ componentName: { … } }">`. The CLI scaffolder (`nuxt-ui make component`) auto-inserts the entry; only do this manually if you skipped the CLI:

```ts
export interface ThemeDefaults {
  // ... existing entries
  componentName?: Partial<ComponentTypes.ComponentNameProps>
}
```

The key is the component name in camelCase (matches the `#build/ui` registry). The value is `Partial<XProps>`. This is a flat literal interface (not a mapped type) because Volar only surfaces inner-prop autocomplete for interface members, not mapped-type members, in template inline objects.
