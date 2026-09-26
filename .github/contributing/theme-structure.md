# Theme Structure

Theme files define component styling using the variants engine in `src/runtime/utils/tv.ts`.

## File Location

Themes live in `src/runtime/theme/` with kebab-case naming (e.g., `button.ts`, `input-menu.ts`).

## Shape

A theme is `slots`, `variants`, `compoundVariants` and `defaultVariants`. Every component declares its elements under `slots`, including the ones made of a single element, which declare one `root` slot (`base` for a control or a prose component, see the table below).

Classes in `variants` and `compoundVariants` are always given per slot, as an object keyed by slot name. A bare string or array targets no slot: the engine ignores it and warns in development. An empty string is fine for a value that only exists to be matched in `compoundVariants` (`solid: ''`).

`test/utils/theme-slots.spec.ts` checks every theme for this and names the theme and the key. `v4` writes classes bare, where they meant the `base` slot, so they come back with a sync.

```ts
variants: {
  size: {
    md: { base: 'px-2.5 py-1.5', leadingIcon: 'size-5' }
  }
},
compoundVariants: [{
  size: 'xs',
  square: true,
  class: { base: 'p-1' }
}]
```

## Static Theme

A theme is a plain object wrapped in `defineTheme`. It never reads module options, so every class it can produce is written in the file and Tailwind finds it by scanning `src/runtime/theme` from the package, through `@source './theme'` in `src/runtime/index.css`. Components import it directly (`import theme from '../theme/accordion'`), and `#build/ui/*` re-exports it for app code.

`defineTheme` checks `compoundVariants` and `defaultVariants` against `variants`, and keeps their values typed as the variant's values, which inference alone widens to `string`. A theme that builds on another uses `extendTheme(base, {...})` instead, typed after `defuFn`: its values win, a function receives the base value and returns the new one, and `compoundVariants` concatenate. Type a function's parameter from the base (`(prev: typeof input.variants.variant) => ...`) so the variant values survive.

Write each class out whole. A class built at runtime, from a template literal (`` `${hover}bg-elevated` ``), a helper that maps or rewrites classes, or a string with escaped quotes (`'content-[\'*\']'`), never reaches Tailwind's scanner and gets no CSS. Use backticks for a class that holds quotes, and give a helper that rewrites classes its results as literals, like `replaceFocus` in `input.ts`. The `theme classes` test in `test/utils/theme-slots.spec.ts` fails on any class the themes resolve to that isn't spelled out in `src/runtime/theme`.

```ts
import { defineTheme } from '../utils/theme'

export default defineTheme({
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
})
```

## Colors

A component with a `color` prop doesn't repeat its classes per color. `colorVariant` from `./color` builds the `color` group: each color sets `--ui-accent` on the slots you pass, and the classes read it through the `accent` utilities listed in [Accent Tokens](#accent-tokens). The variant then holds one set of classes for every color, with no `color` compounds:

```ts
import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    base: 'font-medium inline-flex items-center transition-colors',
    label: 'truncate',
    leadingIcon: 'shrink-0',
    trailingIcon: 'shrink-0'
  },
  variants: {
    // Sets `--ui-accent` on `base` for each color
    color: colorVariant({ base: '' }),
    variant: {
      solid: { base: 'text-accent-foreground bg-accent hover:bg-accent-hover' },
      outline: { base: 'ring ring-inset ring-accent-border text-accent-soft-foreground bg-accent-surface' },
      soft: { base: 'text-accent-soft-foreground bg-accent-soft' }
    },
    size: {
      xs: { base: 'text-xs px-2 py-1', leadingIcon: 'size-3' },
      md: { base: 'text-sm px-2.5 py-1.5', leadingIcon: 'size-5' }
    }
  },
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md'
  }
})
```

Scope the root slot, so a `[--ui-accent:…]` class on the component reaches all of it, and don't scope a slot inside it again. Scope an inner slot only when its color differs from the root's: a per-item color, a slot rendered as another component with its own color, like Timeline's indicator, which is an Avatar, a part rendered in a portal, or the one colored part of a component that wraps your content, like the dot of a Chip. A theme that extends another and drops its `root` slot scopes its own outer slot, as Select does with `color: () => colorVariant({ base: '' })`. `neutral` needs no entry of its own: it sets the accent roles to the surface tokens, so the same classes render the neutral look.

Every slot passed to `colorVariant` gets the scope, so put the classes the colors share in `slots`. A component whose neutral is a different design, not a neutral version of the colored one, overrides the `neutral` entry, which replaces those classes and the scope, so its own classes can't read `accent`: `{ ...colorVariant({ base: '' }), neutral: { base: '...', icon: '...' } }`.

For a second color on the same element, use `highlightColorVariant` (sets `--ui-highlight`) or `spotlightColorVariant` (sets `--spotlight-color`). A compound that still has to match colors lists them with `colors` from the same file, never with a template string: `color: colors.filter(color => color !== 'neutral')`.

## Reusing Variants

Import shared variants from other themes:

```ts
import { fieldGroupVariant } from './field-group'
import { defineTheme } from '../utils/theme'

export default defineTheme({
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

### Accent Tokens
The `color` prop accepts `primary`, `secondary`, `success`, `info`, `warning`, `error` and `neutral`. Colored classes read the scoped color through `accent` roles, never through an alias name or an opacity modifier:
- `bg-accent` - The color itself
- `text-accent-foreground` - Text on a solid accent background
- `bg-accent-hover` - Hover of a solid background
- `bg-accent-soft` / `bg-accent-soft-hover` / `bg-accent-soft-active` - Tinted background, its hover and its selected state
- `text-accent-soft-foreground` - Text on a tinted background
- `ring-accent-border` / `ring-accent-border-soft` / `ring-accent-border-muted` / `border-accent-border-strong` - Colored borders
- `outline-accent-focus` - Focus outline
- `bg-accent-surface` - Resting background of an outlined element
- `bg-accent-tint` - Light tint on large surfaces
- `text-accent-muted` / `text-accent-muted-hover` / `text-accent-faint` - Secondary and faint text
- `border-accent-line` - Separator line

The full list with values is in `src/runtime/tokens.css` and the [CSS Variables](../../docs/content/docs/1.getting-started/5.theme/2.css-variables.md#accent) docs.

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
- **`cursor-w/e-resize`** and **gradients** (`bg-linear-to-l/r`) are physical with no logical form, add `rtl:` counterparts.
- **Transitions** must name the logical property they animate (`transition-[inset-inline-start,inset-inline-end,width]`, not `transition-[left,right,width]`).
- An **`absolute`** element needs an explicit `start-*`/`end-*` anchor, don't rely on its static position (unreliable in RTL).

Keep physical only when the class is tied to a physical prop **value** (`side`, `direction`, `position` = `left`/`right`), or when positioning is driven by a Reka `offsetLeft`-based CSS variable (which already tracks correctly in RTL).

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
