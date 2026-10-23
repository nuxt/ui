import { describe, it, expect } from 'vitest'
import { createApp } from 'vue'
import { mount } from '@vue/test-utils'
import { useAppConfig as useImportsAppConfig } from '#imports'
import Button from '../../src/runtime/components/Button.vue'
import appConfigPlugin from '../../src/runtime/vue/plugins/app-config'
import { useAppConfig } from '../../src/runtime/vue/composables/useAppConfig'

function appConfigOf(options?: Record<string, any>) {
  const app = createApp({}).use(appConfigPlugin, options)
  return app.runWithContext(() => useAppConfig()) as Record<string, any>
}

describe('Vue plugin `ui` option', () => {
  it('merges the theme over the build config', () => {
    const { icons } = (useAppConfig() as Record<string, any>).ui

    const appConfig = appConfigOf({ ui: { button: { slots: { base: 'rounded-full' } } } })

    expect(appConfig.ui.button).toEqual({ slots: { base: 'rounded-full' } })
    expect(appConfig.ui.icons).toEqual(icons)
  })

  it('keeps the theme of each app to itself', () => {
    const ui = { card: { slots: { root: ['shadow-sm', 'ring-2'] } } }

    const first = appConfigOf({ ui })
    const second = appConfigOf({ ui })
    const plain = appConfigOf()

    expect(first.ui.card.slots.root).toEqual(['shadow-sm', 'ring-2'])
    expect(second.ui.card.slots.root).toEqual(['shadow-sm', 'ring-2'])
    expect(plain.ui.card).toBeUndefined()
    expect((useAppConfig() as Record<string, any>).ui.card).toBeUndefined()
  })

  it('keeps function slots for the engine to apply', () => {
    const label = () => 'text-base'

    const appConfig = appConfigOf({ ui: { button: { slots: { label } } } })

    expect(appConfig.ui.button.slots.label).toBe(label)
  })
})

// Components read the Vue stub of `useAppConfig` in the `vue` project only
describe.runIf(useImportsAppConfig === useAppConfig)('Vue plugin `ui` option in components', () => {
  it('styles the components of its own app', () => {
    const themed = mount(Button, { global: { plugins: [[appConfigPlugin, { ui: { button: { slots: { base: 'probe-theme' } } } }]] } })
    const plain = mount(Button)

    expect(themed.classes()).toContain('probe-theme')
    expect(plain.classes()).not.toContain('probe-theme')
  })
})
