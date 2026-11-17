import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import LocaleSelect from '../../../src/runtime/components/locale/LocaleSelect.vue'
import * as locales from '../../../src/runtime/locale'

describe('LocaleSelect', () => {
  it.each([
    ['en', '🇺🇸'],
    ['en-GB', '🇬🇧'],
    ['tg', '🇹🇯']
  ])('renders the flag of %s', async (code, flag) => {
    const wrapper = await mountSuspended(LocaleSelect, {
      props: {
        modelValue: code,
        locales: Object.values(locales)
      }
    })

    expect(wrapper.text()).toContain(flag)
  })
})
