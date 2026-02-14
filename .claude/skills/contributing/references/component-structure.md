# Component Structure

## File Location

Components live in `src/runtime/components/` with PascalCase naming (e.g., `Button.vue`, `InputMenu.vue`).

## Standard Component Template

```vue
<script lang="ts">
// 1. Type imports first (always separate)
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
export interface ComponentNameSlots {
  default(props: { ui: ComponentName['ui'] }): any
}
</script>

<script setup lang="ts">
// 6. Regular imports (separate from type imports)
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { tv } from '../utils/tv'

// 7. Props with withDefaults for runtime defaults
const props = withDefaults(defineProps<ComponentNameProps>(), {
  as: 'div'
})
const slots = defineSlots<ComponentNameSlots>()

// 8. App config
const appConfig = useAppConfig() as ComponentName['AppConfig']

// 9. Theme-aware ui prop - merges Theme context with component ui prop
const uiProp = useComponentUI('componentName', props)

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
  <!-- 11. data-slot on all elements, use uiProp instead of props.ui -->
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <slot :ui="ui" />
  </Primitive>
</template>
```

## Reka UI Components

For components wrapping Reka UI primitives:

```vue
<script lang="ts">
import type { DialogRootProps, DialogRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/modal'
import type { ComponentConfig } from '../types/tv'

type Modal = ComponentConfig<typeof theme, AppConfig, 'modal'>

export interface ModalProps extends Pick<DialogRootProps, 'open' | 'defaultOpen' | 'modal'> {
  title?: string
  description?: string
  class?: any
  ui?: Modal['slots']
}

export interface ModalEmits extends DialogRootEmits {}

export interface ModalSlots {
  default(props?: {}): any
  content(props: { close: () => void }): any
}
</script>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { DialogRoot, DialogPortal, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<ModalProps>(), {
  overlay: true,
  portal: true
})
const emits = defineEmits<ModalEmits>()
const slots = defineSlots<ModalSlots>()

const appConfig = useAppConfig() as Modal['AppConfig']
const uiProp = useComponentUI('modal', props)

// Forward only Reka UI props
const rootProps = useForwardPropsEmits(reactivePick(props, 'open', 'defaultOpen', 'modal'), emits)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.modal || {}) })())
</script>
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

const { 
  id, name, size, color, highlight, disabled, 
  ariaAttrs, emitFormBlur, emitFormInput, emitFormChange 
} = useFormField<InputProps>(props, { deferInputValidation: true })

const { orientation, size: fieldGroupSize } = useFieldGroup<InputProps>(props)
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

## Key Patterns

| Pattern | Usage |
|---------|-------|
| `withDefaults` | Runtime default values |
| `defineOptions({ inheritAttrs: false })` | When spreading `$attrs` to inner element |
| `reactivePick` + `useForwardPropsEmits` | Forward Reka UI props/emits |
| `createReusableTemplate` | Complex template reuse (Table, Modal) |
| `useTemplateRef` | Template refs (Vue 3.5+) |
| `toRef(() => props.x)` | Reactive prop access |

## Export Types

Add to `src/runtime/types/index.ts`:

```ts
export * from '../components/ComponentName.vue'
```
