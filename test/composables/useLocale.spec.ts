import { describe, it, expect, afterEach } from 'vitest'
import { defineComponent, h, shallowRef } from 'vue'
import type { VNode } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { ToastProvider } from 'reka-ui'
import { useLocale } from '../../src/runtime/composables/useLocale'
import { extendLocale } from '../../src/runtime/composables/defineLocale'
import UApp from '../../src/runtime/components/App.vue'
import UBreadcrumb from '../../src/runtime/components/Breadcrumb.vue'
import UButton from '../../src/runtime/components/Button.vue'
import UCalendar from '../../src/runtime/components/Calendar.vue'
import UCarousel from '../../src/runtime/components/Carousel.vue'
import UInputDate from '../../src/runtime/components/InputDate.vue'
import UInputRating from '../../src/runtime/components/InputRating.vue'
import UInputTime from '../../src/runtime/components/InputTime.vue'
import UPagination from '../../src/runtime/components/Pagination.vue'
import UPinInput from '../../src/runtime/components/PinInput.vue'
import USkeleton from '../../src/runtime/components/Skeleton.vue'
import USlider from '../../src/runtime/components/Slider.vue'
import type { AppProps } from '../../src/runtime/components/App.vue'
import ar from '../../src/runtime/locale/ar'
import de from '../../src/runtime/locale/de'
import en from '../../src/runtime/locale/en'
import fr from '../../src/runtime/locale/fr'

const teardowns: Array<() => void> = []

afterEach(() => {
  teardowns.splice(0).forEach(fn => fn())
})

async function mountDir(appProps?: Pick<AppProps, 'dir' | 'locale' | 'toaster'>, localeOverride?: typeof ar) {
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

async function mountInApp(appProps: AppProps, render: () => VNode) {
  const wrapper = await mountSuspended(defineComponent({
    render: () => h(UApp, appProps, render)
  }))
  teardowns.push(() => wrapper.unmount())

  return wrapper
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
    // `useLocale` is shared on the client: without `toaster: null`, `UToaster` would call it first.
    expect(await mountDir({ dir: 'ltr', toaster: null }, ar)).toBe('rtl')
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

  it('labels Pagination controls and pages in the App locale', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => h(UApp, { locale: de }, () => h(UPagination, { total: 30 }))
    }))
    teardowns.push(() => wrapper.unmount())

    expect(wrapper.findAll('button').map(button => button.attributes('aria-label'))).toEqual([
      'Erste Seite',
      'Vorherige Seite',
      'Seite 1',
      'Seite 2',
      'Seite 3',
      'Nächste Seite',
      'Letzte Seite'
    ])
  })

  it('labels Breadcrumb in the App locale', async () => {
    const wrapper = await mountInApp({ locale: fr }, () => h(UBreadcrumb, { items: [{ label: 'Accueil' }] }))

    expect(wrapper.findComponent(UBreadcrumb).attributes('aria-label')).toBe('fil d\'Ariane')
  })

  it.each([
    ['date', 'Date de l\'événement'],
    ['month', 'Sélecteur de mois'],
    ['year', 'Sélecteur d\'année']
  ] as const)('labels the %s Calendar in the App locale', async (type, label) => {
    const wrapper = await mountInApp({ locale: fr }, () => h(UCalendar, { type }))

    expect(wrapper.get('[data-slot="root"]').attributes('aria-label')).toMatch(new RegExp(`^${label}, `))
  })

  it('describes Carousel and its slides in the App locale', async () => {
    const wrapper = await mountInApp({ locale: fr }, () => h(UCarousel, { items: [1, 2] }, { default: ({ item }: { item: number }) => h('span', item) }))

    expect(wrapper.get('[data-slot="root"]').attributes('aria-roledescription')).toBe('carrousel')
    expect(wrapper.findAll('[data-slot="item"]').map(item => item.attributes('aria-roledescription'))).toEqual(['diapositive', 'diapositive'])
  })

  it('labels InputDate segments in the App locale', async () => {
    const wrapper = await mountInApp({ locale: fr }, () => h(UInputDate))

    expect(['day', 'month', 'year'].map(part => wrapper.get(`[data-segment="${part}"]`).attributes('aria-label'))).toEqual(['jour', 'mois', 'année'])
  })

  it('labels InputRating values in the App locale', async () => {
    const wrapper = await mountInApp({ locale: fr }, () => h(UInputRating, { length: 3 }))

    expect(wrapper.findAll('[data-slot="indicator"]').map(indicator => indicator.attributes('aria-label'))).toEqual(['Noter 1 sur 3', 'Noter 2 sur 3', 'Noter 3 sur 3'])
  })

  it('labels InputTime segments in the App locale', async () => {
    const wrapper = await mountInApp({ locale: fr }, () => h(UInputTime, { granularity: 'second' }))

    expect(['hour', 'minute', 'second'].map(part => wrapper.get(`[data-segment="${part}"]`).attributes('aria-label'))).toEqual(['heure', 'minute', 'seconde'])
  })

  it('labels PinInput inputs in the App locale', async () => {
    const wrapper = await mountInApp({ locale: fr }, () => h(UPinInput, { length: 3 }))

    expect(wrapper.findAll('input[data-slot="base"]').map(input => input.attributes('aria-label'))).toEqual([
      'code PIN, caractère 1 sur 3',
      'code PIN, caractère 2 sur 3',
      'code PIN, caractère 3 sur 3'
    ])
  })

  it('labels Skeleton in the App locale', async () => {
    const wrapper = await mountInApp({ locale: fr }, () => h(USkeleton))

    expect(wrapper.findComponent(USkeleton).attributes('aria-label')).toBe('chargement')
  })

  it.each([
    [10, ['Curseur']],
    [[0, 10, 20], ['Valeur 1 sur 3', 'Valeur 2 sur 3', 'Valeur 3 sur 3']]
  ])('labels Slider thumbs of %j in the App locale', async (modelValue, labels) => {
    const wrapper = await mountInApp({ locale: fr }, () => h(USlider, { modelValue }))

    expect(wrapper.findAll('[role="slider"]').map(thumb => thumb.attributes('aria-label'))).toEqual(labels)
  })

  it('labels Toaster in the App locale', async () => {
    const locale = extendLocale(en, { messages: { toaster: { label: 'Alerte', viewport: 'Alertes ({hotkey})' } } })
    const wrapper = await mountInApp({ locale, toaster: { portal: false } }, () => h('div'))

    expect(wrapper.findComponent(ToastProvider).props('label')).toBe('Alerte')
    expect(wrapper.get('[role="region"]').attributes('aria-label')).toBe('Alertes (F8)')
  })
})
