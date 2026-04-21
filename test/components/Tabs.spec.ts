import { createSSRApp, defineComponent, nextTick, onUnmounted, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderToString } from 'vue/server-renderer'
import { renderEach } from '../component-render'
import Tabs from '../../src/runtime/components/Tabs.vue'
import theme from '#build/ui/tabs'

const hydrationIt = (globalThis as { __NUXT_VITEST_ENVIRONMENT__?: boolean }).__NUXT_VITEST_ENVIRONMENT__ ? it.skip : it

describe('Tabs', () => {
  const variants = Object.keys(theme.variants.variant) as any
  const sizes = Object.keys(theme.variants.size) as any

  const items = [{
    label: 'Tab1',
    avatar: {
      src: 'https://github.com/benjamincanac.png',
      alt: 'Benjamín Canac'
    },
    content: 'This is the content shown for Tab1'
  }, {
    label: 'Tab2',
    icon: 'i-lucide-user',
    content: 'And, this is the content for Tab2'
  }, {
    label: 'Tab3',
    icon: 'i-lucide-bell',
    content: 'Finally, this is the content for Tab3',
    slot: 'custom',
    badge: 'badge'
  }]

  const props = { items }

  renderEach(Tabs, [
    // Props
    ['with items', { props }],
    ['with modelValue', { props: { ...props, modelValue: '1' } }],
    ['with defaultValue', { props: { ...props, defaultValue: '1' } }],
    ['with valueKey', { props: { ...props, valueKey: 'label', defaultValue: 'Tab1' } }],
    ['with labelKey', { props: { ...props, labelKey: 'icon' } }],
    ['with orientation vertical', { props: { ...props, orientation: 'vertical' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { ...props, variant } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { ...props, variant, color: 'neutral' } }]),
    ['without content', { props: { ...props, content: false } }],
    ['with unmountOnHide', { props: { ...props, unmountOnHide: false } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'w-96' } }],
    ['with ui', { props: { ...props, ui: { content: 'w-full ring ring-default' } } }],
    // Slots
    ['with leading slot', { props, slots: { leading: () => 'Leading slot' } }],
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with trailing slot', { props, slots: { trailing: () => 'Trailing slot' } }],
    ['with content slot', { props, slots: { content: () => 'Content slot' } }],
    ['with custom slot', { props, slots: { custom: () => 'Custom slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Tabs, {
      props: {
        items,
        modelValue: '0'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('keeps tab content mounted when removing a leading item', async () => {
    const unmounted: string[] = []
    let nextInstanceId = 0

    const statefulItems = [{
      label: 'First',
      value: 'first'
    }, {
      label: 'Second',
      value: 'second'
    }, {
      label: 'Third',
      value: 'third'
    }]

    const StatefulContent = defineComponent({
      props: {
        value: {
          type: String,
          required: true
        }
      },
      setup(props) {
        const instanceId = ++nextInstanceId

        onUnmounted(() => {
          unmounted.push(props.value)
        })

        return { instanceId }
      },
      template: '<div :data-tab-value="value" :data-instance-id="instanceId">{{ value }}</div>'
    })

    const TestTabs = defineComponent({
      components: {
        StatefulContent,
        Tabs
      },
      props: {
        items: {
          type: Array,
          required: true
        }
      },
      setup() {
        const modelValue = ref('third')

        return { modelValue }
      },
      template: `
        <Tabs
          v-model="modelValue"
          :items="items"
          value-key="value"
          label-key="label"
          :unmount-on-hide="false"
        >
          <template #content="{ item }">
            <StatefulContent :value="item.value" />
          </template>
        </Tabs>
      `
    })

    const wrapper = mount(TestTabs, {
      props: {
        items: statefulItems
      }
    })

    const getInstances = () => Object.fromEntries(
      wrapper.findAll('[data-instance-id]').map((node) => {
        return [node.attributes('data-tab-value'), node.attributes('data-instance-id')]
      })
    )

    const initialInstances = getInstances()

    await wrapper.setProps({
      items: statefulItems.slice(1)
    })

    const nextInstances = getInstances()
    const activeTabs = wrapper.findAll('[role="tab"][data-state="active"]')

    expect(nextInstances.second).toBe(initialInstances.second)
    expect(nextInstances.third).toBe(initialInstances.third)
    expect(unmounted).toContain('first')
    expect(unmounted).not.toContain('second')
    expect(unmounted).not.toContain('third')
    expect(activeTabs).toHaveLength(1)
    expect(activeTabs[0]?.text()).toContain('Third')
  })

  hydrationIt('refreshes hydrated tabs when the active trigger state does not match modelValue', async () => {
    const serverItems = [{
      label: 'Third',
      value: 'third'
    }]
    const clientItems = [{
      label: 'First',
      value: 'first'
    }, {
      label: 'Second',
      value: 'second'
    }, {
      label: 'Third',
      value: 'third'
    }]
    const container = document.createElement('div')

    document.body.appendChild(container)

    container.innerHTML = await renderToString(createSSRApp(Tabs, {
      content: false,
      items: serverItems,
      labelKey: 'label',
      modelValue: 'third',
      valueKey: 'value'
    }))

    const app = createSSRApp(Tabs, {
      content: false,
      items: clientItems,
      labelKey: 'label',
      modelValue: 'third',
      valueKey: 'value'
    })

    app.mount(container)

    await nextTick()
    await nextTick()

    const activeTabs = Array.from(container.querySelectorAll<HTMLElement>('[data-slot="trigger"][role="tab"][data-state="active"]'))

    expect(activeTabs).toHaveLength(1)
    expect(activeTabs[0]?.textContent).toContain('Third')

    app.unmount()
    container.remove()
  })
})
