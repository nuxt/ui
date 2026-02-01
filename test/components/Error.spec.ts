import { describe, it, expect, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Error from '../../src/runtime/components/Error.vue'
import type { ErrorProps, ErrorSlots } from '../../src/runtime/components/Error.vue'
import ComponentRender from '../component-render'
import { UTheme } from '#components'

describe('Error', () => {
  const error = {
    statusCode: 404,
    statusMessage: 'Not Found',
    message: 'The page you are looking for does not exist.'
  }

  const props = { error }

  it.each([
    // Props
    ['with error', { props }],
    ['with redirect', { props: { ...props, redirect: '/blog' } }],
    ['with clear', { props: { ...props, clear: { label: 'Home' } } }],
    ['with as', { props: { ...props, as: 'main' } }],
    ['with class', { props: { ...props, class: 'min-h-full' } }],
    ['with ui', { props: { ...props, ui: { links: 'mt-16' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with statusCode slot', { props, slots: { statusCode: () => 'Status code slot' } }],
    ['with statusMessage slot', { props, slots: { statusMessage: () => 'Status message slot' } }],
    ['with message slot', { props, slots: { message: () => 'Message slot' } }],
    ['with links slot', { props, slots: { links: () => 'Links slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ErrorProps, slots?: Partial<ErrorSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Error)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Error, {
      props: {
        error,
        redirect: '/blog',
        clear: { label: 'Home' }
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  test('with theme works', async () => {
    const wrapper = await mountSuspended({
      components: { Error, UTheme },
      template: `
        <UTheme :theme="{ error: { slots: { root: 'test-theme-class' } } }">
          <Error :error="{ statusCode: 404 }" />
        </UTheme>
      `
    })

    expect(wrapper.find('[data-slot="root"]').classes()).toContain('test-theme-class')
  })
})
