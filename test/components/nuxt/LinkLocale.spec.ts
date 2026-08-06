import { h, onUnmounted } from 'vue'
import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useNuxtApp } from '#imports'
import Link from '../../../src/runtime/components/Link.vue'
import Button from '../../../src/runtime/components/Button.vue'

function createLocalePathFallbackFixture(component: typeof Link | typeof Button) {
  return {
    setup() {
      const nuxtApp = useNuxtApp() as ReturnType<typeof useNuxtApp>
      const originalLocalePath = nuxtApp.$localePath

      nuxtApp.$localePath = () => ''

      onUnmounted(() => {
        nuxtApp.$localePath = originalLocalePath
      })

      return () => h(component, { to: '/dashboard' }, () => 'Dashboard')
    }
  }
}

describe('Link locale fallback', () => {
  it('falls back to the original internal path when localePath returns an empty string', async () => {
    const wrapper = await mountSuspended(createLocalePathFallbackFixture(Link))

    const link = wrapper.get('a')

    expect(link.attributes('href')).toBe('/dashboard')
    expect(link.text()).toContain('Dashboard')
  })

  it('keeps button links navigable when localePath cannot resolve the route', async () => {
    const wrapper = await mountSuspended(createLocalePathFallbackFixture(Button))

    const link = wrapper.get('a')

    expect(link.attributes('href')).toBe('/dashboard')
    expect(link.text()).toContain('Dashboard')
  })
})
