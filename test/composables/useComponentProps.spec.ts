import { describe, expectTypeOf, test } from 'vitest'
import type * as ui from '#build/ui'
import type { ThemeDefaults } from '../../src/runtime/composables/useComponentProps'

/**
 * Hand-maintained list of `#build/ui` exports that intentionally don't
 * participate in `<UTheme :props>` overrides. Two reasons land here:
 *
 *   - `prose` is a namespace, not a single component (its children live
 *     under `prose.<tag>` and are read via `useComponentProps('prose.p', …)`).
 *   - The matching Vue file doesn't run `useComponentProps`, so a `:props`
 *     entry would types-check but no-op at runtime. If a key stays here
 *     long-term, consider migrating the component to `useComponentProps`
 *     and removing it from this list.
 */
type NonProxyComponents
  = | 'prose'
    | 'link'
    | 'editorEmojiMenu'
    | 'editorMentionMenu'
    | 'editorSuggestionMenu'

type Expected = Exclude<keyof typeof ui, NonProxyComponents>

// Drift catchers — surfaced at the type level so any new themable component
// added to `#build/ui` without a `ThemeDefaults` entry (or vice versa) breaks
// `vue-tsc --noEmit` in CI. The error message names the offending key
// directly, e.g. `Type 'never' is not assignable to type '"button"'`.
type MissingFromThemeDefaults = Exclude<Expected, keyof ThemeDefaults>
type ExtraInThemeDefaults = Exclude<keyof ThemeDefaults, Expected>

describe('ThemeDefaults registry', () => {
  test('every themable `#build/ui` component has a ThemeDefaults entry', () => {
    expectTypeOf<MissingFromThemeDefaults>().toBeNever()
  })

  test('ThemeDefaults declares no entries beyond the `#build/ui` registry', () => {
    expectTypeOf<ExtraInThemeDefaults>().toBeNever()
  })
})
