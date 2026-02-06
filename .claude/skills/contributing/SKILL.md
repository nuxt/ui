---
name: contributing
description: Guide for contributing to Nuxt UI. Provides component structure patterns, Tailwind Variants theming, Vitest testing conventions, and MDC documentation guidelines. Use when creating new components, reviewing component PRs, modifying existing components, writing tests, or creating documentation in this codebase.
---

# Nuxt UI Development

Guidelines for contributing to the Nuxt UI component library.

## Project Structure

```
src/
├── runtime/
│   ├── components/     # Vue components (PascalCase.vue)
│   ├── composables/    # Composables (use*.ts)
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── theme/              # Tailwind Variants themes (kebab-case.ts)
└── module.ts
test/
├── components/         # Component tests (*.spec.ts)
│   └── __snapshots__/  # Auto-generated snapshots
└── component-render.ts
docs/
└── content/docs/2.components/  # Documentation (*.md)
playgrounds/
└── nuxt/app/pages/components/  # Playground pages
```

## CLI for Scaffolding

Always use the CLI when creating new components:

```bash
nuxt-ui make component <name> [options]
```

Options:
- `--primitive` - Primitive component (uses Reka UI Primitive)
- `--prose` - Prose/typography component
- `--content` - Content component
- `--template` - Generate specific template only (`playground`, `docs`, `test`, `theme`, `component`)

## Available Guidance

| File | Topics |
|------|--------|
| **[references/component-structure.md](references/component-structure.md)** | Vue component file patterns, props/slots/emits interfaces, script setup |
| **[references/theme-structure.md](references/theme-structure.md)** | Tailwind Variants theme files, slots, variants, compoundVariants |
| **[references/testing.md](references/testing.md)** | Vitest patterns, snapshot testing, accessibility testing |
| **[references/documentation.md](references/documentation.md)** | Component docs structure, MDC syntax, examples |

## Loading Files

**Load reference files based on your task:**

- [ ] [references/component-structure.md](references/component-structure.md) - if creating/modifying Vue components
- [ ] [references/theme-structure.md](references/theme-structure.md) - if working on component theming
- [ ] [references/testing.md](references/testing.md) - if writing or reviewing tests
- [ ] [references/documentation.md](references/documentation.md) - if writing component docs

**DO NOT load all files at once.** Load only what's relevant.

## Component Creation Workflow

Copy this checklist and track progress when creating a new component:

```
Component: [name]
Progress:
- [ ] 1. Scaffold with CLI: nuxt-ui make component <name>
- [ ] 2. Implement component in src/runtime/components/
- [ ] 3. Create theme in src/theme/
- [ ] 4. Export types from src/runtime/types/index.ts
- [ ] 5. Write tests in test/components/
- [ ] 6. Create docs in docs/content/docs/2.components/
- [ ] 7. Add playground page
- [ ] 8. Run pnpm run lint
- [ ] 9. Run pnpm run typecheck
- [ ] 10. Run pnpm run test
```

## PR Review Checklist

When reviewing component PRs, verify:

```
PR Review:
- [ ] Component follows existing patterns (see references/)
- [ ] Theme uses semantic colors, not Tailwind palette
- [ ] Tests cover props, slots, and accessibility
- [ ] Documentation includes Usage, Examples, and API sections
- [ ] Conventional commit message format
- [ ] All checks pass (lint, typecheck, test)
```

## Code Conventions

| Convention | Description |
|------------|-------------|
| Type imports | Always separate: `import type { X }` on its own line |
| Props defaults | Use `withDefaults()` for runtime, JSDoc `@defaultValue` for docs |
| Template slots | Add `data-slot="name"` attributes on all elements |
| Computed ui | Always use `computed(() => tv(...))` for reactive theming |
| Semantic colors | Use `text-default`, `bg-elevated`, etc. - never Tailwind palette |
| Reka UI props | Use `reactivePick` + `useForwardPropsEmits` to forward props |
| Form components | Use `useFormField` and `useFieldGroup` composables |

## Commands

```bash
pnpm run dev          # Nuxt playground
pnpm run dev:vue      # Vue playground
pnpm run docs         # Documentation site
pnpm run lint         # Check linting
pnpm run lint:fix     # Fix linting
pnpm run typecheck    # Type checking
pnpm run test         # Run tests
```

## Resources

- [Contribution Guide](https://ui.nuxt.com/getting-started/contribution)
- [Nuxt UI GitHub](https://github.com/nuxt/ui)
