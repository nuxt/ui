import { defineComponent } from 'vue'
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Toaster from '../../src/runtime/components/Toaster.vue'
import Toast from '../../src/runtime/components/Toast.vue'
import type { ToastProps, ToastSlots } from '../../src/runtime/components/Toast.vue'
import ComponentRender from '../component-render'
import { ClientOnly } from '#components'

const ToastWrapper = defineComponent({
  components: {
    UToaster: Toaster,
    UToast: Toast,
    ClientOnly
  },
  inheritAttrs: false,
  template: `<UToaster :portal="false">
  <ClientOnly>
    <UToast v-bind="$attrs">
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </UToast>
  </ClientOnly>
</UToaster>`
})

describe('Toast', () => {
  const props = { title: 'Toast' }

  it.each([
    // Props
    ['with title', { props }],
    ['with description', { props: { ...props, description: 'This is a toast' } }],
    ['with icon', { props: { ...props, icon: 'i-lucide-rocket' } }],
    ['with avatar', { props: { ...props, avatar: { src: 'https://github.com/benjamincanac.png' } } }],
    ['with actions', { props: { ...props, actions: [{ label: 'Action' }] } }],
    ['with orientation vertical', { props: { ...props, icon: 'i-lucide-rocket', description: 'This is a toast', actions: [{ label: 'Action' }], orientation: 'vertical' as const } }],
    ['with orientation horizontal', { props: { ...props, icon: 'i-lucide-rocket', description: 'This is a toast', actions: [{ label: 'Action' }], orientation: 'horizontal' as const } }],
    ['without close', { props: { ...props, close: false } }],
    ['with closeIcon', { props: { ...props, closeIcon: 'i-lucide-trash' } }],
    ['with type', { props: { ...props, type: 'background' as const } }],
    ['with color neutral', { props: { ...props, color: 'neutral' as const } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'bg-elevated/50' } }],
    ['with ui', { props: { ...props, ui: { title: 'font-bold' } } }],
    // Slots
    ['with leading slot', { props, slots: { leading: () => 'Leading slot' } }],
    ['with title slot', { props, slots: { title: () => 'Title slot' } }],
    ['with description slot', { props, slots: { description: () => 'Description slot' } }],
    ['with close slot', { props, slots: { close: () => 'Close slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ToastProps, slots?: Partial<ToastSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, ToastWrapper)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ToastWrapper, {
      props: {
        title: 'Title',
        description: 'Description',
        avatar: { src: 'https://github.com/benjamincanac.png', alt: 'Benjamin Canac' },
        actions: [{ label: 'Action' }]
      }
    })
    expect(await axe(wrapper.element, {
      rules: {
        // "ARIA role should be appropriate for the element (aria-allowed-role)"

        // Fix any of the following:
        //   ARIA role alert is not allowed for given element
        'aria-allowed-role': { enabled: false },
        // "ARIA hidden element must not be focusable or contain focusable elements (aria-hidden-focus)"

        // Fix all of the following:
        //   Focusable content should have tabindex="-1" or be removed from the DOM
        'aria-hidden-focus': { enabled: false },
        // "<ul> and <ol> must only directly contain <li>, <script> or <template> elements (list)"

        // Fix all of the following:
        //   List element has direct children that are not allowed: [role=alert]
        'list': { enabled: false }
      }
    })).toHaveNoViolations()
  })
})
