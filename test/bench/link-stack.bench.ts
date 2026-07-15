import { bench, describe } from 'vitest'
import { h } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { Primitive } from 'reka-ui'
import Button from '../../src/runtime/components/Button.vue'
import Link from '../../src/runtime/vue/overrides/vue-router/Link.vue'
import LinkBase from '../../src/runtime/components/LinkBase.vue'

// Decomposes the no-link Button stack layer by layer so each rung's cost is
// attributable. Every case is wrapped in the same parent whose `cls` prop
// toggles, re-rendering the target subtree:
//   plain <button>                 — Vue baseline
//   Primitive                      — reka render primitive
//   ULinkBase                      — LinkBase -> Primitive
//   ULink (default slot)           — Link -> LinkBase -> Primitive, class via tv
//   ULink custom + ULinkBase       — the exact pattern Button/NavigationMenu use
//   UButton                        — full component
const CASES: [string, (cls: string) => any][] = [
  ['plain <button>', cls => h('button', { class: cls, type: 'button' }, 'x')],
  ['Primitive', cls => h(Primitive, { as: 'button', class: cls }, () => 'x')],
  ['ULinkBase', cls => h(LinkBase, { class: cls }, () => 'x')],
  ['ULink (default slot)', cls => h(Link, { class: cls }, () => 'x')],
  ['ULink custom + ULinkBase', cls => h(Link, { custom: true }, ({ active: _active, ...slotProps }: any) => h(LinkBase, { ...slotProps, class: cls }, () => 'x'))],
  ['UButton', cls => h(Button, { label: 'x', class: cls })]
]

function makeParent(render: (cls: string) => any) {
  return {
    props: ['cls'],
    setup(p: any) {
      return () => render(p.cls)
    }
  }
}

describe('mount', () => {
  for (const [name, render] of CASES) {
    bench(name, async () => {
      const wrapper = await mountSuspended(makeParent(render), { props: { cls: 'p-2' } })
      wrapper.unmount()
    })
  }
})

describe('re-render', () => {
  for (const [name, render] of CASES) {
    describe(name, () => {
      let wrapper: Awaited<ReturnType<typeof mountSuspended>>

      bench(name, async () => {
        await wrapper.setProps({ cls: 'p-3' })
        await wrapper.setProps({ cls: 'p-2' })
      }, {
        async setup() {
          wrapper = await mountSuspended(makeParent(render), { props: { cls: 'p-2' } })
        },
        teardown() {
          wrapper?.unmount()
        }
      })
    })
  }
})
