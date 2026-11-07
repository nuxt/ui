import { describe, expectTypeOf, it, expect, test, beforeAll, afterAll, vi } from 'vitest'
import { defineComponent, h, isReadonly, isRef, isShallow } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useAppConfig } from '#imports'
import { UFormField } from '#components'
import type * as ui from '#build/ui'
import { useComponentProps } from '../../src/runtime/composables/useComponentProps'
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
type ExtraInThemeDefaults = Exclude<keyof ThemeDefaults, Expected>

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

    const root = wrapper.find('[data-slot="root"]')
    // Drives both the `data-orientation` attribute and the tv class resolution,
    // even though `orientation` isn't set in the theme's `defaultVariants`.
    expect(root.attributes('data-orientation')).toBe('horizontal')
    expect(root.classes()).toContain('place-items-baseline')
  })

  it('still lets an explicit prop win', async () => {
    const wrapper = await mountSuspended(UFormField, {
      props: { label: 'Label', orientation: 'vertical' }
    })

    const root = wrapper.find('[data-slot="root"]')
    expect(root.attributes('data-orientation')).toBe('vertical')
  })
})

describe('Vue internal flags', () => {
  it('reads `__v_*` flags without resolving theme defaults', async () => {
    let calls = -1
    let flags: boolean[] = []

    const Probe = defineComponent({
      props: { color: String },
      setup(rawProps) {
        const props = useComponentProps('button', rawProps)
        const replace = vi.spyOn(String.prototype, 'replace')
        try {
          flags = [isReadonly(props), isShallow(props), isRef(props)]
          calls = replace.mock.calls.length
        } finally {
          replace.mockRestore()
        }
        return () => h('i')
      }
    })

    await mountSuspended(Probe)
    expect(calls).toBe(0)
    // the proxy only advertises itself as reactive, not readonly or shallow
    expect(flags).toEqual([false, false, false])
  })
})

describe('prop name conversion cache', () => {
  const Probe = defineComponent({
    props: { cachedProp: String },
    setup(rawProps) {
      const p = useComponentProps('button', rawProps)
      return { p }
    },
    render: () => h('i')
  })

  it('does not re-convert a prop name on repeated reads', async () => {
    const wrapper = await mountSuspended(Probe, { props: { cachedProp: 'a' } })
    const p = (wrapper.vm as any).p as { cachedProp: string }
    expect(p.cachedProp).toBe('a')

    const replace = vi.spyOn(String.prototype, 'replace')
    try {
      expect(p.cachedProp).toBe('a')
      expect(replace).not.toHaveBeenCalled()
    } finally {
      replace.mockRestore()
    }
  })
})
