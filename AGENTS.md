# AGENTS.md

This file provides guidance for AI coding agents working on the Nuxt UI repository.

## Contributing Skill

This repository includes a [contributing skill](.claude/skills/contributing/SKILL.md) with detailed guidance on component structure, theming, testing, and documentation. **Read and follow it before making changes.**

## Project Overview

Nuxt UI is a component library built on [Reka UI](https://reka-ui.com/), [Tailwind CSS](https://tailwindcss.com/), and [Tailwind Variants](https://www.tailwind-variants.org/). It provides accessible, themeable components for both Nuxt and Vue applications.

## Key Conventions

- **Conventional commits**: All commit messages must follow [conventional commits](https://conventionalcommits.org) (e.g. `fix(Button): resolve hover state`, `feat(Modal): add fullscreen prop`).
- **Type imports**: Always use separate `import type { X }` statements.
- **Semantic colors**: Use `text-default`, `bg-elevated`, etc. — never raw Tailwind palette colors like `text-gray-500`.
- **Template slots**: Add `data-slot="name"` attributes on all template elements.
- **Component theming**: Use `computed(() => tv(...))` for reactive theming with Tailwind Variants.

## Project Structure

```
src/runtime/components/   # Vue components (PascalCase.vue)
src/runtime/composables/  # Composables (use*.ts)
src/runtime/types/        # TypeScript types
src/theme/                # Tailwind Variants themes (kebab-case.ts)
test/components/          # Component tests (*.spec.ts)
docs/content/docs/2.components/  # Documentation (*.md)
playgrounds/nuxt/app/pages/components/  # Playground pages
```

## Commands

```bash
pnpm run dev:prepare  # Generate type stubs (run after install)
pnpm run dev          # Nuxt playground
pnpm run dev:vue      # Vue playground
pnpm run docs         # Documentation site
pnpm run lint         # Check linting
pnpm run lint:fix     # Fix linting
pnpm run typecheck    # Type checking
pnpm run test         # Run tests
```

## Creating New Components

Link the CLI first (one-time setup), then scaffold new components:

```bash
npm link
nuxt-ui make component <name>
```

Options: `--primitive`, `--prose`, `--content`, `--template <name>`

## Before Submitting

- [ ] `pnpm run lint` passes
- [ ] `pnpm run typecheck` passes
- [ ] `pnpm run test` passes
- [ ] Documentation is updated if applicable
- [ ] Commit message follows conventional commits

Multiple commits are fine — PRs are squash merged, so no need to rebase or force push.
