import { describe, it, expect } from 'vitest'
import { createApp } from 'vue'
import appConfigPlugin from '../../src/runtime/vue/plugins/app-config'
import { useAppConfig } from '../../src/runtime/vue/composables/useAppConfig'

describe('Vue plugin `ui` option', () => {
  const appConfig = useAppConfig() as Record<string, any>

  it('merges the theme over the build config', () => {
    const icons = appConfig.ui.icons

    createApp({}).use(appConfigPlugin, { ui: { button: { slots: { base: 'rounded-full' } } } })

    expect(appConfig.ui.button).toEqual({ slots: { base: 'rounded-full' } })
    expect(appConfig.ui.icons).toEqual(icons)
  })

  it('merges over the build config on every install', () => {
    const ui = { card: { slots: { root: ['shadow-sm', 'ring-2'] } } }

    createApp({}).use(appConfigPlugin, { ui })
    createApp({}).use(appConfigPlugin, { ui })

    expect(appConfig.ui.card.slots.root).toEqual(['shadow-sm', 'ring-2'])
    expect(appConfig.ui.button).toBeUndefined()
  })

  it('keeps function slots for the engine to apply', () => {
    const label = () => 'text-base'

    createApp({}).use(appConfigPlugin, { ui: { button: { slots: { label } } } })

    expect(appConfig.ui.button.slots.label).toBe(label)
  })
})
