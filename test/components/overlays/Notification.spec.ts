import { describe, it, expect } from 'vitest'
import { UNotification } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Notification', () => {
  it.each([
    ['basic case', {}],
    ['with title', { props: { title: 'Notification title' } }],
    ['with description', { props: { description: 'Notification description' } }],
    ['with icon', { props: { icon: 'i-heroicons-academic-cap' } }],
    ['with avatar', { props: { avatar: { src: 'https://repository-images.githubusercontent.com/428329515/43fec891-9030-4601-8233-5d45ba5c6013', alt: 'nuxtui' } } }],
    ['with close button', { props: { closeButton: { label: 'close', color: 'red' } } }],
    ['with color', { props: { color: 'red' } }]
    // // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UNotification.props>) => {
    let html = await ComponentRender(nameOrHtml, options, UNotification)
    // avoid test failure due to width variations
    html = html.replace('style="width: 100%;"', '')
    html = html.replace('style="width: 100.02%;"', '')
    expect(html).toMatchSnapshot()
  })
})

'<transition-stub appear="true" persisted="false" css="true">\n  <div class="w-full pointer-events-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg" role="status">\n    <div class="">\n      <div class="flex items-center">\n        <!--v-if-->\n        <!--v-if-->\n        <div class="">\n          <!--v-if-->\n          <!--v-if-->\n          <!--v-if-->\n        </div>\n        <div class="mt-0">\n          <!--v-if--><button type="button" class="focus:outline-none focus-visible:outline-0 disabled:curs…us-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center" aria-label="Close"><span class="i-heroicons-x-mark-20-solid flex-shrink-0 h-5 w-5" aria-hidden="true"></span>\n            <!--v-if-->\n            <!--v-if-->\n          </button>\n        </div>\n      </div>\n      <div class="absolute bottom-0 end-0 start-0 h-1 bg-primary-500 dark:bg-primary-400" style="width: 100%;"></div>\n    </div>\n  </div>\n</transition-stub>'
