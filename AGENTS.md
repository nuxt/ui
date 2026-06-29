# AGENTS.md

This file provides guidance for AI coding agents working on the Nuxt UI repository.

## Project Overview

Nuxt UI is a component library built on [Reka UI](https://reka-ui.com/), [Tailwind CSS](https://tailwindcss.com/), and [Tailwind Variants](https://www.tailwind-variants.org/). It provides accessible, themeable components for both Nuxt and Vue applications.

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

## Commands

```bash
pnpm run dev:prepare  # Generate type stubs (run after install)
pnpm run dev          # Nuxt playground
pnpm run dev:vue      # Vue playground
pnpm run dev:repl     # REPL playground
pnpm run docs         # Documentation site
pnpm run lint         # Check linting
pnpm run lint:fix     # Fix linting
pnpm run typecheck    # Type checking
pnpm run test         # Run tests
```

## CLI for Scaffolding

Link the CLI first (one-time setup):

```bash
npm link
```

Then use it to create new components:

```bash
nuxt-ui make component <name> [options]
```

Options:
- `--primitive` - Primitive component (uses Reka UI Primitive)
- `--prose` - Prose/typography component
- `--content` - Content component
- `--template` - Generate specific template only (`playground`, `docs`, `test`, `theme`, `component`)

## Key Conventions

- **Conventional commits**: All commit messages must follow [conventional commits](https://conventionalcommits.org) (e.g. `fix(Button): resolve hover state`, `feat(Modal): add fullscreen prop`).
- **Semantic colors**: Use `text-default`, `bg-elevated`, etc. — never raw Tailwind palette colors like `text-gray-500`.
- **`Soon` badge on docs headings**: PRs that introduce a new feature or fix often add `:badge{label="Soon" class="align-text-top"}` to the relevant docs heading. This is intentional: the docs site redeploys on merge, but the feature only ships on the next npm release — the badge bridges that gap. Do NOT flag this as inconsistent in reviews. See [documentation.md](.github/contributing/documentation.md) for details.

## Library Source (`src/` and `test/`)

The following conventions and references apply **only** when working on files in `src/` or `test/`. They do not apply to `docs/`, `playgrounds/`, or other directories.

### References

Load these based on your task. **Do not load all files at once** — only load what's relevant.

| File | Topics |
|------|--------|
| **[.github/contributing/component-structure.md](.github/contributing/component-structure.md)** | Vue component file patterns, props/slots/emits interfaces, script setup |
| **[.github/contributing/theme-structure.md](.github/contributing/theme-structure.md)** | Tailwind Variants theme files, slots, variants, compoundVariants |
| **[.github/contributing/testing.md](.github/contributing/testing.md)** | Vitest patterns, snapshot testing, accessibility testing |
| **[.github/contributing/documentation.md](.github/contributing/documentation.md)** | Component docs structure, MDC syntax, examples |

### Code Conventions

| Convention | Description |
|------------|-------------|
| Type imports | Always separate: `import type { X }` on its own line |
| Props defaults | Use `withDefaults()` for runtime, JSDoc `@defaultValue` for docs |
| Template slots | Add `data-slot="name"` attributes on all elements |
| Computed ui | Always use `computed(() => tv(...))` for reactive theming |
| Theme defaults | Wrap raw props with `useComponentProps(name, _props)` to resolve the priority chain (explicit prop > `<UTheme :props>` > `withDefaults` > `app.config.ui.<name>.defaultVariants`). The proxy deep-merges `ui` automatically — read `props.ui?.<slot>` in templates. `theme.defaultVariants` is **not** read by the proxy — it only feeds `tv()` class resolution. Pass the **raw** `_props` (not the proxy) to `useFormField` / `useFieldGroup` / `useAvatarGroup` so their injection precedence (closer context wins) stays correct. |
| Form/group fallback | When consuming `size` / `color` / `highlight` from `useFormField`, `useFieldGroup`, or `useAvatarGroup`, always fall back to the proxy in `tv()` calls: `size: size.value ?? props.size`, `color: color.value ?? props.color`, `highlight: highlight.value ?? props.highlight`. This gives the full precedence `explicit > group/formField > <UTheme :props> > undefined`. Without the `?? props.X` fallback, `<UTheme :props>` is silently dropped when the closer context (FormField/FieldGroup/AvatarGroup) is absent. |
| Semantic colors | Use `text-default`, `bg-elevated`, etc. - never Tailwind palette |
| Reka UI props | Use `reactivePick` + `useForwardProps(source, emits?)` from `composables/useForwardProps` to forward props (proxy-aware; reka-ui's `useForwardProps` / `useForwardPropsEmits` filter out `<UTheme :props>` defaults) |
| Form components | Use `useFormField` and `useFieldGroup` composables |

## Component Creation Workflow

Copy this checklist and track progress when creating a new component:

```
Component: [name]
Progress:
- [ ] 1. Scaffold with CLI: nuxt-ui make component <name>
- [ ] 2. Implement component in src/runtime/components/
- [ ] 3. Create theme in src/theme/
- [ ] 4. Export types from src/runtime/types/index.ts
- [ ] 5. Register in ThemeDefaults interface (src/runtime/composables/useComponentProps.ts)
- [ ] 6. Write tests in test/components/
- [ ] 7. Create docs in docs/content/docs/2.components/
- [ ] 8. Add playground page
- [ ] 9. Run pnpm run lint
- [ ] 10. Run pnpm run typecheck
- [ ] 11. Run pnpm run test
```

### PR Review Checklist

When reviewing PRs that touch `src/` or `test/`, verify:

```
PR Review:
- [ ] Component follows existing patterns (see .github/contributing/)
- [ ] Theme uses semantic colors, not Tailwind palette
- [ ] Tests cover props, slots, and accessibility
- [ ] Documentation includes Usage, Examples, and API sections
- [ ] Conventional commit message format
- [ ] All checks pass (lint, typecheck, test)
```

**Do NOT flag as issues:**
- `:badge{label="Soon"}` on docs headings in PRs adding new features/fixes (intentional — bridges the gap between docs deploy on merge and feature shipping on next npm release).

## Before Submitting

- [ ] `pnpm run lint` passes
- [ ] `pnpm run typecheck` passes
- [ ] `pnpm run test` passes
- [ ] Documentation is updated if applicable
- [ ] Commit message follows conventional commits
- [ ] PR description follows [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md) (linked issue, type of change, description, checklist)

Multiple commits are fine — PRs are squash merged, so no need to rebase or force push.

## Resources

- [Contribution Guide](https://ui.nuxt.com/getting-started/contribution)
- [Nuxt UI GitHub](https://github.com/nuxt/ui)
