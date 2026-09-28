import { describe, it, expect, afterEach } from 'vitest'
import { defineComponent, h, shallowRef } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useLocale } from '../../src/runtime/composables/useLocale'
import UApp from '../../src/runtime/components/App.vue'
import UButton from '../../src/runtime/components/Button.vue'
import UPagination from '../../src/runtime/components/Pagination.vue'
import type { AppProps } from '../../src/runtime/components/App.vue'
import ar from '../../src/runtime/locale/ar'

const teardowns: Array<() => void> = []

afterEach(() => {
  teardowns.splice(0).forEach(fn => fn())
})

async function mountDir(appProps?: Pick<AppProps, 'dir' | 'locale'>, localeOverride?: typeof ar) {
  let dir: string | undefined

  const Probe = defineComponent({
    setup() {
      dir = useLocale(localeOverride && shallowRef(localeOverride)).dir.value
      return () => null
    }
  })

  const wrapper = await mountSuspended(defineComponent({
    render: () => appProps ? h(UApp, appProps, () => h(Probe)) : h(Probe)
  }))
  teardowns.push(() => wrapper.unmount())

  return dir
}

describe('useLocale', () => {
  it('defaults to ltr without an App', async () => {
    expect(await mountDir()).toBe('ltr')
  })

  it('follows the App dir prop without a locale', async () => {
    expect(await mountDir({ dir: 'rtl' })).toBe('rtl')
  })

  it('follows the locale dir', async () => {
    expect(await mountDir({ locale: ar })).toBe('rtl')
  })

  it('lets the App dir prop override the locale dir', async () => {
    expect(await mountDir({ locale: ar, dir: 'ltr' })).toBe('ltr')
  })

  it('keeps the dir of a locale passed to useLocale without an App', async () => {
    expect(await mountDir(undefined, ar)).toBe('rtl')
  })

  it('keeps the dir of a locale passed to useLocale over the App dir prop', async () => {
    expect(await mountDir({ dir: 'ltr' }, ar)).toBe('rtl')
  })

  it('flips Pagination icons with the App dir prop and no locale', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => h(UApp, { dir: 'rtl' }, () => h(UPagination, { total: 100, page: 5, showEdges: true }))
    }))
    teardowns.push(() => wrapper.unmount())

    const icon = (control: string) => wrapper.findAllComponents(UButton).find(b => b.attributes('data-slot') === control)?.props('icon')

    expect(icon('first')).toBe('i-lucide-chevrons-right')
    expect(icon('prev')).toBe('i-lucide-chevron-right')
    expect(icon('next')).toBe('i-lucide-chevron-left')
    expect(icon('last')).toBe('i-lucide-chevrons-left')
  })
})
