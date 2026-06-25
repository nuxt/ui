import { describe, it, expect } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { addIcon, Icon as IconifyIcon } from '@iconify/vue'
import { loadIconsData } from '../../src/plugins/icons'

describe('loadIconsData', () => {
  it('loads the SVG data for an installed collection', async () => {
    const data = await loadIconsData(['lucide:check'], process.cwd())

    expect(data['lucide:check']?.body).toBeTruthy()
  })

  it('skips collections whose data is not installed instead of throwing', async () => {
    // The collection isn't installed, so it degrades to runtime loading (empty result)
    // rather than failing the build.
    await expect(loadIconsData(['not-a-real-collection:foo'], process.cwd())).resolves.toEqual({})
  })
})

describe('icon bundling (SSR)', () => {
  it('renders a bundled default icon to inline SVG during SSR with no network call', async () => {
    // What the build does: load the data, then register it via `addIcon` (here using the
    // same colon name the generated `virtual:nuxt-ui-icons` module uses).
    const data = await loadIconsData(['lucide:check'], process.cwd())
    for (const name in data) {
      addIcon(name, data[name]!)
    }

    // `lucide-check` is exactly the string the `Icon` component looks up after stripping the
    // `i-` prefix from `i-lucide-check`, so this asserts the registered name normalizes to the
    // same Iconify icon the component resolves. On the server an unregistered icon renders no
    // SVG, so inline `<svg>` here proves the icon was bundled rather than fetched at runtime.
    const html = await renderToString(createSSRApp(() => h(IconifyIcon, { icon: 'lucide-check' })))

    expect(html).toContain('<svg')
    expect(html).toContain('</svg>')
  })
})
