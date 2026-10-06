import { defineComponent } from 'vue'
import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import Toaster from '../../src/runtime/components/Toaster.vue'
import Toast from '../../src/runtime/components/Toast.vue'
import { useToast } from '../../src/runtime/composables/useToast'
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

  renderEach(ToastWrapper, [
    // Props
    ['with title', { props }],
    ['with description', { props: { ...props, description: 'This is a toast' } }],
    ['with icon', { props: { ...props, icon: 'i-lucide-rocket' } }],
    ['with avatar', { props: { ...props, avatar: { src: 'https://github.com/benjamincanac.png' } } }],
    ['with actions', { props: { ...props, actions: [{ label: 'Action' }] } }],
    ['with orientation vertical', { props: { ...props, icon: 'i-lucide-rocket', description: 'This is a toast', actions: [{ label: 'Action' }], orientation: 'vertical' } }],
    ['with orientation horizontal', { props: { ...props, icon: 'i-lucide-rocket', description: 'This is a toast', actions: [{ label: 'Action' }], orientation: 'horizontal' } }],
    ['without close', { props: { ...props, close: false } }],
    ['with closeIcon', { props: { ...props, closeIcon: 'i-lucide-trash' } }],
    ['with type', { props: { ...props, type: 'background' } }],
    ['with color neutral', { props: { ...props, color: 'neutral' } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'bg-elevated/50' } }],
    ['with ui', { props: { ...props, ui: { title: 'font-bold' } } }],
    // Slots
    ['with leading slot', { props, slots: { leading: () => 'Leading slot' } }],
    ['with title slot', { props, slots: { title: () => 'Title slot' } }],
    ['with description slot', { props, slots: { description: () => 'Description slot' } }],
    ['with close slot', { props, slots: { close: () => 'Close slot' } }]
  ])

  it('calls onClick once per click', async () => {
    const onClick = vi.fn()
    const toast = useToast()
    toast.clear()

    const wrapper = await mountSuspended(Toaster, { props: { portal: false } })
    const body = toast.add({ title: 'Toast', onClick })

    await vi.waitFor(() => expect(wrapper.find('[data-slot="base"]').exists()).toBe(true), { timeout: 4000 })
    await wrapper.find('[data-slot="base"]').trigger('click')

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ id: body.id, title: 'Toast' }))

    toast.clear()
  })

  it('marks stacked toasts as collapsed', async () => {
    const toast = useToast()
    toast.clear()

    const wrapper = await mountSuspended(Toaster, { props: { portal: false, expand: false } })
    toast.add({ title: 'Back' })
    toast.add({ title: 'Front' })

    await vi.waitFor(() => expect(wrapper.findAll('li[data-slot="base"]')).toHaveLength(2), { timeout: 4000 })
    const [back, front] = wrapper.findAll('li[data-slot="base"]')

    expect([back!.attributes('data-collapsed'), back!.attributes('data-front')]).toEqual(['true', 'false'])
    expect([front!.attributes('data-collapsed'), front!.attributes('data-front')]).toEqual(['true', 'true'])

    toast.clear()
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
        // "<ul> and <ol> must only directly contain <li>, <script> or <template> elements (list)"

        // Fix all of the following:
        //   List element has direct children that are not allowed: [role=alert]
        'list': { enabled: false }
      }
    })).toHaveNoViolations()
  })
})
