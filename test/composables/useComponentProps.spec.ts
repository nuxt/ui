import { describe, expectTypeOf, it, expect, test, beforeAll, afterAll } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useAppConfig } from '#imports'
import { UFormField, UTheme, UButton, UAvatar } from '#components'
import type * as ui from '#build/ui'
import type { ThemeDefaults } from '../../src/runtime/types/theme'

/**
 * Hand-maintained list of `#build/ui` exports that intentionally don't
 * participate in `<UTheme :props>` overrides: the matching Vue file doesn't
 * run `useComponentProps`, so a `:props` entry would types-check but no-op at
 * runtime. If a key stays here long-term, consider migrating the component to
 * `useComponentProps` and removing it from this list.
 *
 * Note: `prose` is a namespace whose children (`prose.h2`, …) *do* read
 * `useComponentProps('prose.<tag>', …)`, so it participates via a nested
 * `ThemeDefaults['prose']` shape and is not excluded here.
 */
type NonProxyComponents
  = | 'link'
    | 'editorEmojiMenu'
    | 'editorMentionMenu'
    | 'editorSuggestionMenu'

type Expected = Exclude<keyof typeof ui, NonProxyComponents>

// Drift catchers — surfaced at the type level so any new themable component
// added to `#build/ui` without a `ThemeDefaults` entry (or vice versa) breaks
// `vue-tsc --noEmit` in CI. The error message names the offending key
// directly, e.g. `Type 'never' is not assignable to type '"button"'`.
type MissingFromThemeDefaults = Exclude<Expected, keyof ThemeDefaults>
type ExtraInThemeDefaults = Exclude<keyof ThemeDefaults, Expected | '*'>

describe('ThemeDefaults registry', () => {
  test('every themable `#build/ui` component has a ThemeDefaults entry', () => {
    expectTypeOf<MissingFromThemeDefaults>().toBeNever()
  })

  test('ThemeDefaults declares no entries beyond the `#build/ui` registry', () => {
    expectTypeOf<ExtraInThemeDefaults>().toBeNever()
  })
})

// `app.config.ui.<name>.defaultVariants` must override a prop the component
// pins in `withDefaults` (here `orientation`). Regression test for #6683.
describe('app.config defaultVariants', () => {
  let appConfig: { ui?: Record<string, any> }

  beforeAll(() => {
    appConfig = useAppConfig() as { ui?: Record<string, any> }
    appConfig.ui ??= {}
    appConfig.ui.formField = { defaultVariants: { orientation: 'horizontal' } }
  })

  afterAll(() => {
    delete appConfig.ui!.formField
  })

  it('overrides the withDefaults fallback', async () => {
    const wrapper = await mountSuspended(UFormField, {
      props: { label: 'Label' }
    })

    const root = wrapper.find('[data-slot="form-field"]')
    // Drives both the `data-orientation` attribute and the tv class resolution,
    // even though `orientation` isn't set in the theme's `defaultVariants`.
    expect(root.attributes('data-orientation')).toBe('horizontal')
    expect(root.classes()).toContain('place-items-baseline')
  })

  it('still lets an explicit prop win', async () => {
    const wrapper = await mountSuspended(UFormField, {
      props: { label: 'Label', orientation: 'vertical' }
    })

    const root = wrapper.find('[data-slot="form-field"]')
    expect(root.attributes('data-orientation')).toBe('vertical')
  })
})

// `'*'` replaces only the library-wide `primary` / `md` defaults, below a
// component's own key, from `<UTheme :props>` or `app.config.ui.defaultVariants`.
describe('\'*\' default variants', () => {
  const render = (props: Record<string, any>) => mountSuspended({
    components: { UTheme, UButton, UAvatar },
    setup: () => ({ props }),
    template: `
      <UTheme :props="props">
        <UButton label="Button" />
        <UAvatar alt="Benjamin Canac" />
      </UTheme>
    `
  })

  it('replaces primary and md, and keeps a component\'s own default', async () => {
    const wrapper = await render({ '*': { color: 'error', size: 'sm' } })

    expect(wrapper.find('[data-slot="button"]').classes()).toEqual(expect.arrayContaining(['[--ui-accent:var(--ui-error)]', 'text-xs']))
    expect(wrapper.find('[data-slot="avatar"]').classes()).toContain('[--ui-accent:var(--ui-neutral)]')
  })

  it('lets a component\'s own key win', async () => {
    const wrapper = await render({ '*': { color: 'error' }, 'button': { color: 'success' } })

    expect(wrapper.find('[data-slot="button"]').classes()).toContain('[--ui-accent:var(--ui-success)]')
  })

  describe('from app.config', () => {
    let appConfig: { ui?: Record<string, any> }

    beforeAll(() => {
      appConfig = useAppConfig() as { ui?: Record<string, any> }
      appConfig.ui ??= {}
      appConfig.ui.defaultVariants = { color: 'warning' }
    })

    afterAll(() => {
      delete appConfig.ui!.defaultVariants
    })

    it('applies app-wide, below `<UTheme>`', async () => {
      const wrapper = await render({})
      expect(wrapper.find('[data-slot="button"]').classes()).toContain('[--ui-accent:var(--ui-warning)]')

      const themed = await render({ '*': { color: 'error' } })
      expect(themed.find('[data-slot="button"]').classes()).toContain('[--ui-accent:var(--ui-error)]')
    })
  })
})
