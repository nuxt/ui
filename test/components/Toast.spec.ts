import { defineComponent } from 'vue'
import { describe, it, expect } from 'vitest'
import Toaster from '../../src/runtime/components/Toaster.vue'
import Toast, { type ToastProps, type ToastSlots } from '../../src/runtime/components/Toast.vue'
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
    ['with description actions', { props: { ...props, description: 'This is a toast', actions: [{ label: 'Action' }] } }],
    ['without close', { props: { ...props, close: false } }],
    ['with closeIcon', { props: { ...props, closeIcon: 'i-lucide-trash' } }],
    ['with type', { props: { ...props, type: 'background' as const } }],
    ['with color neutral', { props: { ...props, color: 'neutral' as const } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'bg-[var(--ui-bg-elevated)]/50' } }],
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
})
