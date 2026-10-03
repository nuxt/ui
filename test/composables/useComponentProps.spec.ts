import type { ComputedRef } from 'vue'
import { describe, expectTypeOf, it, expect, test, beforeAll, afterAll } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useAppConfig } from '#imports'
import { UFormField, UFieldGroup, UAvatarGroup, UTheme, UButton, UAvatar, UInput, UKbd, UEmpty } from '#components'
import type * as ui from '#build/ui'
import type { ThemeDefaults } from '../../src/runtime/types/theme'
import { useComponentOverrides } from '../../src/runtime/composables/useComponentProps'

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

type Expected = Exclude<keyof typeof ui, NonProxyComponents>

// Drift catchers — surfaced at the type level so any new themable component
// added to `#build/ui` without a `ThemeDefaults` entry (or vice versa) breaks
// `vue-tsc --noEmit` in CI. The error message names the offending key
// directly, e.g. `Type 'never' is not assignable to type '"button"'`.
type MissingFromThemeDefaults = Exclude<Expected, keyof ThemeDefaults>
type ExtraInThemeDefaults = Exclude<keyof ThemeDefaults, Expected | '*'>

describe('useComponentOverrides', () => {
  it('types the documented recipe without an annotation', () => {
    const recipe = () => useComponentOverrides(ui => ui.myComponent)
    expectTypeOf(recipe).returns.toMatchTypeOf<ComputedRef<unknown>>()
  })
})

describe('ThemeDefaults registry', () => {
  test('every themable `#build/ui` component has a ThemeDefaults entry', () => {
    expectTypeOf<MissingFromThemeDefaults>().toBeNever()
  })

  test('ThemeDefaults declares no entries beyond the `#build/ui` registry', () => {
    expectTypeOf<ExtraInThemeDefaults>().toBeNever()
  })
})

// A `<UTheme :props>` key must override a prop the component pins in
// `withDefaults` (here `orientation`). Regression test for #6683.
describe('<UTheme :props> over withDefaults', () => {
  it('overrides the withDefaults fallback', async () => {
    const wrapper = await mountSuspended({
      components: { UTheme, UFormField },
      template: `<UTheme :props="{ formField: { orientation: 'horizontal' } }"><UFormField label="Label" /></UTheme>`
    })

    const root = wrapper.find('[data-slot="form-field"]')
    // Drives both the `data-orientation` attribute and the tv class resolution
    expect(root.attributes('data-orientation')).toBe('horizontal')
    expect(root.classes()).toContain('place-items-baseline')
  })

  it('still lets an explicit prop win', async () => {
    const wrapper = await mountSuspended({
      components: { UTheme, UFormField },
      template: `<UTheme :props="{ formField: { orientation: 'horizontal' } }"><UFormField label="Label" orientation="vertical" /></UTheme>`
    })

    const root = wrapper.find('[data-slot="form-field"]')
    expect(root.attributes('data-orientation')).toBe('vertical')
  })
})

// Every variant prop defaults in `withDefaults`, so a raw prop is never
// `undefined`: a group and a parent tell what was passed from what is a default.
describe('withDefaults variants', () => {
  it('still inherits the size of a group', async () => {
    const wrapper = await mountSuspended({
      components: { UFormField, UFieldGroup, UAvatarGroup, UInput, UButton, UAvatar },
      template: `
        <UFormField label="Field" size="xl"><UInput /></UFormField>
        <UFieldGroup size="xl"><UButton label="Button" /></UFieldGroup>
        <UAvatarGroup size="xl"><UAvatar alt="Benjamin Canac" /></UAvatarGroup>
      `
    })

    expect(wrapper.find('[data-slot="input-base"]').classes()).toContain('text-base')
    expect(wrapper.find('[data-slot="button"]').classes()).toContain('text-base')
    expect(wrapper.find('[data-slot="avatar-group-base"]').classes()).toContain('size-10')
  })

  it('lets an explicit prop win over a group', async () => {
    const wrapper = await mountSuspended({
      components: { UFieldGroup, UButton },
      template: `<UFieldGroup size="xl"><UButton label="Button" size="xs" /></UFieldGroup>`
    })

    expect(wrapper.find('[data-slot="button"]').classes()).toContain('text-xs')
  })

  it('doesn\'t pass a group\'s default down as its own value', async () => {
    const wrapper = await mountSuspended({
      components: { UTheme, UFieldGroup, UButton },
      template: `<UTheme :props="{ button: { size: 'xs' } }"><UFieldGroup><UButton label="Button" /></UFieldGroup></UTheme>`
    })

    expect(wrapper.find('[data-slot="button"]').classes()).toContain('text-xs')
  })

  it('leaves a child component its own default', async () => {
    const wrapper = await mountSuspended({
      components: { UTheme, UEmpty },
      template: `<UTheme :props="{ button: { size: 'xs' } }"><UEmpty title="Title" :actions="[{ label: 'Action' }]" /></UTheme>`
    })

    // Empty passes its `size` to its buttons only when it was given one
    expect(wrapper.find('[data-slot="button"]').classes()).toContain('text-xs')
  })
})

// `'*'` replaces only the library-wide `primary` / `md` defaults, below a
// component's own key.
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

  it('skips a value the component does not have', async () => {
    const wrapper = await mountSuspended({
      components: { UTheme, UButton, UKbd },
      template: `
        <UTheme :props="{ '*': { size: 'xl' } }">
          <UButton label="Button" />
          <UKbd value="K" />
        </UTheme>
      `
    })

    expect(wrapper.find('[data-slot="button"]').classes()).toContain('text-base')
    expect(wrapper.find('[data-slot="kbd"]').classes()).toContain('h-5')
  })

  it('reaches components with generic props', async () => {
    const wrapper = await mountSuspended({
      components: { UTheme, UInput },
      template: `<UTheme :props="{ '*': { color: 'error', size: 'sm' } }"><UInput highlight /></UTheme>`
    })

    expect(wrapper.find('[data-slot="input"]').classes()).toContain('[--ui-accent:var(--ui-error)]')
    expect(wrapper.find('[data-slot="input-base"]').classes()).toContain('text-sm/4')
  })

  it('lets a component\'s own key win', async () => {
    const wrapper = await render({ '*': { color: 'error' }, 'button': { color: 'success' } })

    expect(wrapper.find('[data-slot="button"]').classes()).toContain('[--ui-accent:var(--ui-success)]')
  })

  // A group passes down only what was set for it, so the `'*'` default doesn't
  // reach a child as the group's own value and beat the child's key
  it('lets a child\'s own key win inside a group', async () => {
    const wrapper = await mountSuspended({
      components: { UTheme, UFormField, UFieldGroup, UAvatarGroup, UInput, UButton, UAvatar },
      template: `
        <UTheme :props="{ '*': { size: 'xs' }, input: { size: 'xl' }, button: { size: 'xl' }, avatar: { size: 'xl' } }">
          <UFormField label="Field"><UInput /></UFormField>
          <UFieldGroup><UButton label="Button" /></UFieldGroup>
          <UAvatarGroup><UAvatar alt="Benjamin Canac" /></UAvatarGroup>
        </UTheme>
      `
    })

    expect(wrapper.find('[data-slot="input-base"]').classes()).toContain('text-base')
    expect(wrapper.find('[data-slot="button"]').classes()).toContain('text-base')
    expect(wrapper.find('[data-slot="avatar-group-base"]').classes()).toContain('size-10')
  })

  it('still reaches a child through a group', async () => {
    const wrapper = await mountSuspended({
      components: { UTheme, UFormField, UInput },
      template: `<UTheme :props="{ '*': { size: 'xs' } }"><UFormField label="Field"><UInput /></UFormField></UTheme>`
    })

    expect(wrapper.find('[data-slot="input-base"]').classes()).toEqual(expect.arrayContaining(['px-2', 'py-1']))
  })
})

// `unstyled` resolves against the blanked theme, keeping the user's classes.
describe('unstyled', () => {
  const render = (template: string) => mountSuspended({
    components: { UTheme, UButton },
    template
  })

  it('drops the theme classes under `<UTheme unstyled>` and keeps `ui` and `class`', async () => {
    const wrapper = await render('<UTheme unstyled><UButton label="Button" class="px-3" :ui="{ label: \'font-bold\' }" /></UTheme>')

    const button = wrapper.find('[data-slot="button"]')
    expect(button.classes()).toEqual(['[--ui-accent:var(--ui-primary)]', 'px-3'])
    expect(wrapper.find('[data-slot="button-label"]').classes()).toEqual(['font-bold'])
  })

  // The color scope sets a variable and styles nothing, so `color` keeps working
  // for the `accent` classes the user writes
  it('keeps the color scope under `<UTheme unstyled>`', async () => {
    const wrapper = await render('<UTheme unstyled><UButton label="Button" color="error" class="bg-accent" /></UTheme>')

    expect(wrapper.find('[data-slot="button"]').classes()).toEqual(['[--ui-accent:var(--ui-error)]', 'bg-accent'])
  })

  it('styles a subtree again with `:unstyled="false"`', async () => {
    const wrapper = await render('<UTheme unstyled><UTheme :unstyled="false"><UButton label="Button" /></UTheme></UTheme>')

    expect(wrapper.find('[data-slot="button"]').classes()).toContain('rounded-md')
  })

  describe('from app.config', () => {
    let appConfig: { ui?: Record<string, any> }

    beforeAll(() => {
      appConfig = useAppConfig() as { ui?: Record<string, any> }
      appConfig.ui ??= {}
      appConfig.ui.unstyled = true
    })

    afterAll(() => {
      delete appConfig.ui!.unstyled
    })

    it('applies app-wide, below `<UTheme>`', async () => {
      const wrapper = await render('<UButton label="Button" />')
      expect(wrapper.find('[data-slot="button"]').classes()).not.toContain('rounded-md')

      const styled = await render('<UTheme :unstyled="false"><UButton label="Button" /></UTheme>')
      expect(styled.find('[data-slot="button"]').classes()).toContain('rounded-md')
    })
  })
})
