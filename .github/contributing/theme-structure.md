# Theme Structure

Theme files define component styling using the variants engine in `src/runtime/utils/tv.ts`.

## File Location

Themes live in `src/theme/` with kebab-case naming (e.g., `button.ts`, `input-menu.ts`).

## Shape

A theme is `slots`, `variants`, `compoundVariants` and `defaultVariants`. Every component declares its elements under `slots`, including the ones made of a single element, which declare one `root` slot (`base` for a control or a prose component, see the table below).

Classes in `variants` and `compoundVariants` are always given per slot, as an object keyed by slot name. A bare string or array targets no slot: the engine ignores it and warns in development. An empty string is fine for a value that only exists to be matched in `compoundVariants` (`solid: ''`).

```ts
variants: {
  size: {
    md: { base: 'px-2.5 py-1.5', leadingIcon: 'size-5' }
  }
},
compoundVariants: [{
  color: 'neutral',
  variant: 'solid',
  class: { base: 'text-inverted bg-inverted' }
}]
```

## Static Theme (Simple Components)

For components without dynamic colors:

```ts
export default {
  slots: {
    root: 'w-full',
    item: 'border-b border-default last:border-b-0',
    trigger: 'flex items-center gap-1.5 font-medium text-sm py-3.5',
    content: 'overflow-hidden',
    body: 'text-sm pb-3.5'
  },
  variants: {
    disabled: {
      true: {
        trigger: 'cursor-not-allowed opacity-75'
      }
    }
  }
}
```

## Dynamic Theme (With Module Options)

For components using theme colors:

```ts
import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    base: ['font-medium inline-flex items-center', options.theme.transitions && 'transition-colors'],
    label: 'truncate',
    leadingIcon: 'shrink-0',
    trailingIcon: 'shrink-0'
  },
  variants: {
    color: {
      // Dynamic colors from module options
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: ''
    },
    variant: {
      solid: '',
      outline: '',
      soft: '',
      subtle: ''
    },
    size: {
      xs: { base: 'text-xs px-2 py-1', leadingIcon: 'size-3' },
      sm: { base: 'text-xs px-2.5 py-1.5', leadingIcon: 'size-4' },
      md: { base: 'text-sm px-2.5 py-1.5', leadingIcon: 'size-5' },
      lg: { base: 'text-sm px-3 py-2', leadingIcon: 'size-5' },
      xl: { base: 'text-base px-3 py-2', leadingIcon: 'size-6' }
    }
  },
  compoundVariants: [
    // Color + variant combinations
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'solid',
      class: { base: `bg-${color} text-inverted` }
    })),
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'outline',
      class: { base: `text-${color} ring ring-inset ring-${color}/50` }
    })),
    // Neutral variants
    {
      color: 'neutral',
      variant: 'solid',
      class: { base: 'text-inverted bg-inverted' }
    },
    {
      color: 'neutral',
      variant: 'outline',
      class: { base: 'ring ring-inset ring-accented text-default bg-default' }
    }
  ],
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md'
  }
})
```

## Reusing Variants

Import shared variants from other themes:

```ts
import type { ModuleOptions } from '../module'
import { fieldGroupVariant } from './field-group'

export default (options: Required<ModuleOptions>) => ({
  slots: { ... },
  variants: {
    ...fieldGroupVariant,
    // Additional variants
  }
})
```

## Semantic Colors

Always use semantic colors, never Tailwind palette colors:

### Text Colors
- `text-default` - Primary text
- `text-muted` - Secondary text
- `text-dimmed` - Tertiary/placeholder text
- `text-highlighted` - Emphasized text
- `text-inverted` - Text on dark backgrounds

### Background Colors
- `bg-default` - Primary background
- `bg-elevated` - Elevated surface (cards, dropdowns)
- `bg-accented` - Subtle accent background
- `bg-inverted` - Inverted (dark) background

### Border Colors
- `border-default` - Standard borders
- `ring-default` - Focus rings
- `ring-accented` - Accented rings
- `divide-default` - Dividers

### Theme Colors
Primary colors used with variants:
- `primary`, `secondary`, `success`, `info`, `warning`, `error`, `neutral`

Usage in compoundVariants:
```ts
`bg-${color}` // background
`text-${color}` // text color
`ring-${color}` // ring/border
`ring-${color}/50` // with opacity
```

## Logical Properties (RTL)

Components must work in RTL by default. Reka's `dir` is already wired through `UApp`, so the theme only needs to stay direction-agnostic: always use CSS **logical** properties, never physical ones.

| Physical (avoid) | Logical (use) |
|---|---|
| `ml-*` / `mr-*` | `ms-*` / `me-*` |
| `pl-*` / `pr-*` | `ps-*` / `pe-*` |
| `left-*` / `right-*` | `start-*` / `end-*` |
| `text-left` / `text-right` | `text-start` / `text-end` |
| `border-l` / `border-r` | `border-s` / `border-e` |
| `rounded-l/r-*` | `rounded-s/e-*` |
| `rounded-tl/tr/bl/br-*` | `rounded-ss/se/es/ee-*` |

These render identically in LTR, so prefer them even when a component has no RTL case yet.

Some things logical properties don't cover, handle them explicitly:
- **`transform`** (`translate-x-*`, `-scale-x-*`) does not flip. Add an `rtl:` counterpart when it is direction-dependent (e.g. `translate-x-1/2 rtl:-translate-x-1/2`). Centering (`*-1/2` with a translate) is symmetric and needs nothing.
- **`cursor-w/e-resize`** and **gradients** (`bg-gradient-to-l/r`) are physical with no logical form, add `rtl:` counterparts.
- **Transitions** must name the logical property they animate (`transition-[inset-inline-start,inset-inline-end,width]`, not `transition-[left,right,width]`).
- An **`absolute`** element needs an explicit `start-*`/`end-*` anchor, don't rely on its static position (unreliable in RTL).

Keep physical only when the class is tied to a physical prop **value** (`side`, `direction`, `position` = `left`/`right`), or when positioning is driven by a Reka `offsetLeft`-based CSS variable (which already tracks correctly in RTL).

## Conditional Transitions

Add transitions based on module options:

```ts
slots: {
  base: [
    'rounded-md font-medium',
    options.theme.transitions && 'transition-colors'
  ]
}
```

## Animations

Common animation classes:
```ts
// Accordion expand/collapse
content: 'data-[state=open]:animate-[accordion-down_200ms_ease-out] data-[state=closed]:animate-[accordion-up_200ms_ease-out]'

// Modal fade/scale
overlay: 'data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]'
content: 'data-[state=open]:animate-[scale-in_200ms_ease-out] data-[state=closed]:animate-[scale-out_200ms_ease-in]'

// Loading spinner
leadingIcon: 'animate-spin'
```

## Compound Variants

Apply styles when multiple conditions match:

```ts
compoundVariants: [
  // Color + variant
  {
    color: 'primary',
    variant: 'solid',
    class: { base: 'bg-primary text-inverted' }
  },
  
  // Size + boolean
  {
    size: 'sm',
    square: true,
    class: { base: 'p-1' }
  },
  
  // Multiple slots
  {
    loading: true,
    leading: true,
    class: {
      leadingIcon: 'animate-spin'
    }
  },
  
  // Array of variants
  {
    color: 'neutral',
    variant: ['outline', 'subtle'],
    class: { base: 'focus-visible:ring-2 focus-visible:ring-inverted' }
  }
]
```

## Slot Naming Conventions

| Slot | Usage |
|------|-------|
| `root` | Outermost element, or the wrapper around `base` when there is one |
| `base` | The element the component stands for: the box of a control (anything that can sit in a `FieldGroup`: Button, Badge, the `<input>` of Input, the trigger of Select) or the HTML element of a prose component (`<p>`, `<h1>`, `<pre>`). Wrapped in a `root` when it needs one, outermost otherwise. Not used on other components |
| `leading` / `trailing` | Icon/content containers |
| `leadingIcon` / `trailingIcon` | Icon elements |
| `label` | Text label |
| `content` | Main content area |
| `overlay` | Background overlay |
| `header` / `body` / `footer` | Structural sections |
