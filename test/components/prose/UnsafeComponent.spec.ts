import { describe, it, expect } from 'vitest'
import { defineComponent, h } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useAppConfig } from '#imports'
import Button from '../../../src/runtime/components/Button.vue'
import Card from '../../../src/runtime/components/Card.vue'
import ChatReasoning from '../../../src/runtime/components/ChatReasoning.vue'
import ChatTool from '../../../src/runtime/components/ChatTool.vue'
import Popover from '../../../src/runtime/components/Popover.vue'
import Select from '../../../src/runtime/components/Select.vue'
import SelectMenu from '../../../src/runtime/components/SelectMenu.vue'
import Theme from '../../../src/runtime/components/Theme.vue'
import A from '../../../src/runtime/components/prose/A.vue'
import Badge from '../../../src/runtime/components/prose/Badge.vue'
import Callout from '../../../src/runtime/components/prose/Callout.vue'
import CodeGroup from '../../../src/runtime/components/prose/CodeGroup.vue'
import Field from '../../../src/runtime/components/prose/Field.vue'
import Icon from '../../../src/runtime/components/prose/Icon.vue'

// What a bound prop like `:as='{"template":"..."}'` in markdown is parsed into
const payload = () => ({ template: '<b>{{ 7 * 191 }}</b>' })
// A forged VNode renders its `props` as is, `innerHTML` included
const vnode = () => ({ __v_isVNode: true, type: 'i', props: { innerHTML: '1337' }, shapeFlag: 1, children: null })

describe('unsafe components from markdown', () => {
  it.each([
    ['Field `as`', Field, { props: { as: payload() } }],
    ['Icon `name`', Icon, { props: { name: payload() } }],
    ['Callout `icon`', Callout, { props: { icon: payload() } }],
    ['A `as` fallthrough', A, { attrs: { as: payload() } }],
    ['CodeGroup `as` fallthrough', CodeGroup, { attrs: { as: payload() } }],
    ['ChatTool `as` fallthrough', ChatTool, { props: { text: 'Tool' }, attrs: { as: payload() } }],
    ['ChatReasoning `as` fallthrough', ChatReasoning, { props: { text: 'Thinking' }, attrs: { as: payload() } }],
    ['Select `as` fallthrough', Select, { props: { items: ['a'] }, attrs: { as: payload() } }],
    ['SelectMenu `as` fallthrough', SelectMenu, { props: { items: ['a'] }, attrs: { as: payload() } }],
    ['Field forged VNode `as`', Field, { props: { as: vnode() } }],
    ['Icon forged VNode `name`', Icon, { props: { name: vnode() } }],
    ['Popover `content.as`', Popover, { props: { open: true, portal: false, content: { as: payload() } }, slots: { content: () => 'Content' } }]
  ])('does not render a template from %s', async (_, component: any, options) => {
    const wrapper = await mountSuspended(component, options)
    expect(wrapper.html()).not.toContain('1337')
  })

  it.each([
    ['Field `as`', Field, { props: { as: 'script' } }],
    ['Badge `as` fallthrough', Badge, { attrs: { as: 'iframe' } }],
    ['Select `as` fallthrough', Select, { props: { items: ['a'] }, attrs: { as: 'script' } }]
  ])('does not render a script or iframe from %s', async (_, component: any, options) => {
    const wrapper = await mountSuspended(component, options)
    expect(wrapper.html()).not.toMatch(/<(script|iframe)/)
  })

  it('falls back to the default element', async () => {
    const wrapper = await mountSuspended(Button, { props: { as: payload() } })
    expect(wrapper.element.tagName).toBe('BUTTON')
  })

  it('does not render a template from `app.config` defaults', async () => {
    const appConfig = useAppConfig() as any
    const card = appConfig.ui.card
    appConfig.ui.card = { ...card, defaultVariants: { ...card?.defaultVariants, as: payload() } }
    try {
      const wrapper = await mountSuspended(Card)
      expect(wrapper.html()).not.toContain('1337')
    } finally {
      appConfig.ui.card = card
    }
  })

  it('does not render a template from `<UTheme :props>`', async () => {
    const App = defineComponent({ render: () => h(Theme, { props: { card: { as: payload() } } }, { default: () => h(Card) }) })
    const wrapper = await mountSuspended(App)
    expect(wrapper.html()).not.toContain('1337')
  })
})
