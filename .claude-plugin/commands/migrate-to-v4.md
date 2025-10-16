---
description: Migrate your Nuxt application from Nuxt UI v3 or Nuxt UI Pro to Nuxt UI v4
---

You are assisting with migrating a Nuxt application to Nuxt UI v4. Nuxt UI v4 marks a major milestone where Nuxt UI and Nuxt UI Pro are now unified into a single, fully open-source and free library with 100+ production-ready components.

**IMPORTANT**: Nuxt UI v4 requires **Nuxt 4**. Ensure the project is on Nuxt 4 before proceeding.

## Phase 0: Initial Assessment

First, analyze the current project setup:

1. Check if the project uses Nuxt UI Pro or Nuxt UI v3:
   - Read `package.json` to detect `@nuxt/ui-pro` or `@nuxt/ui` dependencies
   - Read `nuxt.config.ts` (or `vite.config.ts` for Vue projects) to confirm module configuration
   - Check `app.config.ts` (or `vite.config.ts` for Vue) for `uiPro` configuration

2. Verify git status and ask the user:
   - Whether to create a new migration branch or work on current branch
   - If new branch, suggest name like `feat/migrate-nuxt-ui-v4`

3. Check for AI SDK usage (optional migration):
   - Search for imports from `@ai-sdk/vue` or `ai` packages
   - Search for chat components: `ChatMessage`, `ChatMessages`, `ChatPrompt`, etc.

4. Present a summary to the user:
   ```
   **Migration Assessment**
   - Current version: [Nuxt UI Pro / Nuxt UI v3]
   - Nuxt version: [version]
   - Framework: [Nuxt / Vue]
   - AI SDK components detected: [Yes/No]
   - Recommended branch: [branch-name]

   Ready to proceed?
   ```

Wait for user approval before continuing.

## Phase 1: Dependency Updates

Based on the detected setup, perform the appropriate dependency updates:

### If migrating from Nuxt UI Pro:

1. Remove `@nuxt/ui-pro` and install `@nuxt/ui`:
   ```bash
   # Detect package manager (npm, pnpm, yarn, bun)
   bun remove @nuxt/ui-pro
   bun add @nuxt/ui
   ```

2. Update module configuration:
   - **For Nuxt projects**: Update `nuxt.config.ts`
     ```diff
     export default defineNuxtConfig({
       modules: [
     -   '@nuxt/ui-pro',
     +   '@nuxt/ui'
       ]
     })
     ```

   - **For Vue projects**: Update `vite.config.ts`
     ```diff
     import { defineConfig } from 'vite'
     import vue from '@vitejs/plugin-vue'
     - import uiPro from '@nuxt/ui-pro/vite'
     + import ui from '@nuxt/ui/vite'

     export default defineConfig({
       plugins: [
         vue(),
     -   uiPro({
     +   ui({
           ui: {
             colors: {
               primary: 'green',
               neutral: 'slate'
             }
           }
         })
       ]
     })
     ```

### If migrating from Nuxt UI v3:

1. Update to latest version:
   ```bash
   bun add @nuxt/ui
   ```

2. No module configuration changes needed (already using `@nuxt/ui`)

### Phase 1 Completion:

After dependency updates:
- Run `bun install` to ensure clean install
- Commit changes: `git commit -m "chore: update to Nuxt UI v4 dependencies"`

Wait for user approval before continuing to Phase 2.

## Phase 2: Configuration Updates

### 2.1 Update App Configuration

- **For Nuxt projects**: Update `app.config.ts`
  ```diff
  export default defineAppConfig({
    ui: {
      colors: {
        primary: 'green',
        neutral: 'slate'
      },
  +   pageCard: {
  +     slots: {
  +       root: 'rounded-xl',
  +     }
  +   }
    },
  - uiPro: {
  -   pageCard: {
  -     slots: {
  -       root: 'rounded-xl',
  -     }
  -   }
  - }
  })
  ```

- **For Vue projects**: Update `vite.config.ts` (move `uiPro` config to `ui`)
  ```diff
  export default defineConfig({
    plugins: [
      vue(),
      ui({
        ui: {
          colors: {
            primary: 'green',
            neutral: 'slate'
          },
  +       pageCard: {
  +         slots: {
  +           root: 'rounded-xl',
  +         }
  +       }
        },
  -     uiPro: {
  -       pageCard: {
  -         slots: {
  -           root: 'rounded-xl',
  -         }
  -       }
  -     }
      })
    ]
  })
  ```

### 2.2 Update CSS Imports

Find CSS files (commonly `app/assets/css/main.css` or `src/assets/css/main.css`) and update:

```diff
@import "tailwindcss";
- @import "@nuxt/ui-pro";
+ @import "@nuxt/ui";
```

**For Nuxt 4 projects upgrading simultaneously**: Update `@source` directive if present:
```diff
@import "tailwindcss";
@import "@nuxt/ui";

- @source "../../content/**/*";
+ @source "../../../content/**/*";
```

### Phase 2 Completion:

After configuration updates:
- Run `npx nuxi typecheck` (or `npx vue-tsc` for Vue) to check for issues
- Commit changes: `git commit -m "chore: migrate configuration to Nuxt UI v4"`

Wait for user approval before continuing to Phase 3.

## Phase 3: Code Migration

This phase updates component usage and imports throughout the codebase.

### 3.1 Rename Components

Search and replace the following component renames:

1. **ButtonGroup → FieldGroup**:
   ```bash
   # Search for UButtonGroup usage
   ```
   Replace with:
   ```diff
   - <UButtonGroup>
   + <UFieldGroup>
       <UButton label="Button" />
       <UButton icon="i-lucide-chevron-down" />
   + </UFieldGroup>
   - </UButtonGroup>
   ```

2. **PageMarquee → Marquee**:
   ```diff
   - <UPageMarquee :items="items" />
   + <UMarquee :items="items" />
   ```

3. **PageAccordion → Accordion** (with additional props):
   ```diff
   - <UPageAccordion
   + <UAccordion
       :items="items"
   +   :unmount-on-hide="false"
   +   :ui="{ trigger: 'text-base', body: 'text-base text-muted' }"
     />
   ```

### 3.2 Update Model Modifiers

Search for `v-model.nullify` usage and update:

```diff
- <UInput v-model.nullify="value" />
+ <UInput v-model.nullable="value" />
```

```diff
- <UTextarea v-model="value" :model-modifiers="{ nullify: true }" />
+ <UTextarea v-model="value" :model-modifiers="{ nullable: true }" />
```

**Note**: Use `nullable` for `null` values, `optional` for `undefined` values.

### 3.3 Update Form Components

Search for nested `UForm` components and update:

```diff
<template>
  <UForm :state="state" :schema="schema" @submit="onSubmit">
    <UFormField label="Customer" name="customer">
      <UInput v-model="state.customer" placeholder="Wonka Industries" />
    </UFormField>

    <div v-for="(item, index) in state.items" :key="index">
      <UForm
-       :state="item"
+       :name="`items.${index}`"
        :schema="itemSchema"
+       nested
      >
        <UFormField :label="!index ? 'Description' : undefined" name="description">
          <UInput v-model="item.description" />
        </UFormField>
      </UForm>
    </div>
  </UForm>
</template>
```

**Key changes**:
- Add `nested` prop to nested forms
- Replace `:state` with `:name` for path-based state access
- Schema transformations now only apply to `@submit` data

### 3.4 Update Imports

Search for all imports from `@nuxt/ui-pro` and update:

```diff
- import type { BannerProps } from '@nuxt/ui-pro'
+ import type { BannerProps } from '@nuxt/ui'
```

```diff
- import { findPageHeadline } from '@nuxt/ui-pro/utils/content'
+ import { findPageHeadline } from '@nuxt/content/utils'
```

```diff
- import { findPageBreadcrumb } from '@nuxt/ui-pro/utils/content'
+ import { findPageBreadcrumb } from '@nuxt/content/utils'
```

### Phase 3 Completion:

After code migrations:
- Run `npx nuxi typecheck` to verify no type errors
- Run `npm run build` to test build
- Commit changes: `git commit -m "refactor: migrate components and imports to Nuxt UI v4"`

Wait for user approval before continuing to Phase 4 (if AI SDK detected).

## Phase 4: AI SDK v5 Migration (Optional)

**Only perform this phase if AI SDK usage was detected in Phase 0.**

Ask user: "AI SDK components were detected. Would you like to migrate to AI SDK v5? (Yes/No)"

If Yes:

### 4.1 Update AI SDK Dependencies

```diff
{
  "dependencies": {
-   "@ai-sdk/vue": "^1.2.x",
+   "@ai-sdk/vue": "^2.0.x",
-   "ai": "^4.3.x"
+   "ai": "^5.0.x"
  }
}
```

### 4.2 Update Chat Composables

Replace `useChat` with new `Chat` class:

```diff
<script setup lang="ts">
- import { useChat } from '@ai-sdk/vue'
+ import { Chat } from '@ai-sdk/vue'
+ import type { UIMessage } from 'ai'

- const { messages, input, handleSubmit, status, error, reload, setMessages } = useChat()
+ const messages: UIMessage[] = []
+ const input = ref('')
+
+ const chat = new Chat({
+   messages
+ })
+
+ function handleSubmit(e: Event) {
+   e.preventDefault()
+   chat.sendMessage({ text: input.value })
+   input.value = ''
+ }
</script>
```

### 4.3 Update Message Structure

Messages now use `parts` instead of `content`:

```diff
// When manually creating messages
- setMessages([{
+ messages.push({
  id: '1',
  role: 'user',
- content: 'Hello world'
+ parts: [{ type: 'text', text: 'Hello world' }]
- }])
+ })
```

```diff
// In templates
- <UChatMessage :content="message.content" />
+ <UChatMessage :parts="message.parts" />
```

### 4.4 Update Method Names

```diff
// Regenerate the last message
- reload()
+ chat.regenerate()

// Access chat state
- :messages="messages"
- :status="status"
+ :messages="chat.messages"
+ :status="chat.status"
```

### 4.5 Add Text Extraction Utility

For MDC rendering with AI SDK v5:

```vue
<script setup lang="ts">
import { getTextFromMessage } from '@nuxt/ui/utils/ai'
</script>

<template>
  <UChatMessages :messages="chat.messages" :status="chat.status">
    <template #content="{ message }">
      <MDC :value="getTextFromMessage(message)" :cache-key="message.id" unwrap="p" />
    </template>
  </UChatMessages>
</template>
```

### Phase 4 Completion:

After AI SDK migration:
- Run `npx nuxi typecheck` to verify no type errors
- Run tests if available
- Commit changes: `git commit -m "feat: migrate to AI SDK v5"`

## Phase 5: Final Verification

Perform comprehensive checks:

1. **Type checking**:
   ```bash
   npx nuxi typecheck  # For Nuxt
   npx vue-tsc        # For Vue
   ```

2. **Build verification**:
   ```bash
   npm run build
   ```

3. **Run tests** (if available):
   ```bash
   npm run test
   ```

4. **Lint check** (if configured):
   ```bash
   npm run lint
   ```

5. **Development server**:
   ```bash
   npm run dev
   ```
   Ask user to verify the application runs correctly.

### Final Summary

Present a complete migration summary:

```
✅ Nuxt UI v4 Migration Complete

**Changes Applied:**
- ✅ Dependencies updated to @nuxt/ui v4
- ✅ Configuration migrated (nuxt.config.ts/vite.config.ts, app.config.ts)
- ✅ CSS imports updated
- ✅ Components renamed (ButtonGroup→FieldGroup, PageMarquee→Marquee, PageAccordion→Accordion)
- ✅ Model modifiers updated (nullify→nullable)
- ✅ Form components updated with nested prop
- ✅ Imports updated from @nuxt/ui-pro to @nuxt/ui
- [✅/➖] AI SDK v5 migration completed (if applicable)

**Verification Results:**
- Type checking: [✅/❌]
- Build: [✅/❌]
- Tests: [✅/❌]
- Lint: [✅/❌]

**Next Steps:**
1. Review the changes in git diff
2. Test your application thoroughly
3. Update any custom components that depend on changed APIs
4. Refer to the migration guide for additional edge cases: https://ui.nuxt.com/docs/getting-started/migration/v4

**References:**
- Nuxt UI v4 Migration Guide: https://ui.nuxt.com/docs/getting-started/migration/v4
- AI SDK v5 Migration Guide: https://ai-sdk.dev/docs/migration-guides/migration-guide-5-0
- Nuxt UI v4 Upgrade PR: https://github.com/nuxt/ui/pull/4698
```

Ask the user if they want to:
1. Push the changes to remote
2. Create a pull request
3. Make any additional adjustments

## Error Handling

Throughout the migration, if any step fails:

1. **Show the error clearly** to the user
2. **Explain what went wrong** and potential causes
3. **Suggest fixes** or ask for user input
4. **Don't proceed** to the next phase until the current issue is resolved
5. **Offer to rollback** to the last successful git commit if needed

## Important Notes

- **Backup**: Ensure the user has committed or backed up their work before starting
- **Incremental**: Each phase should be committed separately for easy rollback
- **Testing**: Encourage testing after each major phase
- **Documentation**: Point users to official migration guides for edge cases
- **Breaking Changes**: Explain each breaking change clearly before applying
- **User Control**: Always wait for user approval before proceeding to the next phase
