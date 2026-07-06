import { describe, it, expect } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { UFormField } from '#components'

// `app.config.ui.<name>.defaultVariants` must override a prop the component
// pins in `withDefaults` (here `orientation`). Regression test for #6683.
// Lives in a nested (nuxt-only) folder because it relies on `mockNuxtImport`.
mockNuxtImport('useAppConfig', () => {
  return () => ({
    ui: {
      formField: {
        defaultVariants: {
          orientation: 'horizontal'
        }
      }
    }
  })
})

describe('useComponentProps app.config defaults', () => {
  it('app.config defaultVariants overrides withDefaults', async () => {
    const wrapper = await mountSuspended(UFormField, {
      props: { label: 'Label' }
    })

    const root = wrapper.find('[data-slot="root"]')
    // Drives both the `data-orientation` attribute and the tv class resolution,
    // even though `orientation` isn't set in the theme's `defaultVariants`.
    expect(root.attributes('data-orientation')).toBe('horizontal')
    expect(root.classes()).toContain('place-items-baseline')
  })

  it('explicit prop still wins over app.config defaultVariants', async () => {
    const wrapper = await mountSuspended(UFormField, {
      props: { label: 'Label', orientation: 'vertical' }
    })

    const root = wrapper.find('[data-slot="root"]')
    expect(root.attributes('data-orientation')).toBe('vertical')
  })
})
