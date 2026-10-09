---
name: migrate-nuxt-ui-v4-to-v5
description: Migrate an application from Nuxt UI v4 to Nuxt UI v5. Use when upgrading @nuxt/ui to v5, fixing errors after the upgrade, or when the user mentions Nuxt UI v4, v5, upgrade, migration or breaking changes.
---

# Nuxt UI v4 to v5 migration

The migration guide is the single source of truth. This skill is the procedure to apply it, it does not list the changes. Fetch the guide before anything else and don't rely on memory for names, options or versions:

```
https://raw.githubusercontent.com/nuxt/ui/v5/docs/content/docs/1.getting-started/3.migration.md
```

Every breaking change is a section under "Changes from v4", with a `diff` showing the before and after.

## 1. Analyze

Don't edit anything yet.

1. Check that the working tree is clean and create a branch for the migration.
2. Detect the package manager, whether the project is a Nuxt app or a Vue app using the `@nuxt/ui/vite` plugin, and the installed `@nuxt/ui` version. On v3 or older, stop and tell the user to migrate to v4 first.
3. Find where Nuxt UI is configured: `nuxt.config.ts` or `vite.config.ts`, `app.config.ts`, and the CSS file that imports `@nuxt/ui`.
4. Go through each section of "Changes from v4" and search the project for what it changes: props, slots, classes, CSS variables, options, imports. Search templates, scripts, CSS, config files, Markdown content and tests.
5. Give the user a plan: the sections that apply with the files they touch, and the sections that don't apply. Wait for their go.

## 2. Apply

1. Update `@nuxt/ui` to `@nuxt/ui@next` with the project's package manager. Install the optional peer dependencies the guide lists for the components the project uses.
2. Apply the sections one at a time, in the order of the guide. Some renames have to run in a given order, the guide says which.
3. A section that says it can be applied by a find and replace is mechanical: replace whole names only, and review the diff.
4. A section that says it **can't** be applied by a find and replace needs each match read in context. Follow what that paragraph says to look for. When the right change depends on what the user wants, ask instead of guessing.
5. Leave code the guide doesn't mention as it is.

Several changes fail silently: a selector that stops matching, an option or a CSS variable that is ignored, a class that starts to apply. TypeScript doesn't report them, so a passing type check isn't proof that a section is done. Check them against the search results from the analysis.

## 3. Verify

1. Run the type check and the linter after each section when the project has them.
2. Run the build and the tests once every section is applied.
3. Search the project once more for the old names from the guide.

Then list what changed per section, the places that need a visual check in the browser, and anything left for the user to decide.
