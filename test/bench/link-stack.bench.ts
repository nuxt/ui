import { describe, test } from 'vitest'
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
  ['ULink custom + ULinkBase', cls => h(Link, { custom: true }, { default: ({ active: _active, ...slotProps }: any) => h(LinkBase, { ...slotProps, class: cls }, () => 'x') })],
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

test('mount', async ({ bench }) => {
  for (const [name, render] of CASES) {
    await bench(name, async () => {
      const wrapper = await mountSuspended(makeParent(render), { props: { cls: 'p-2' } })
      wrapper.unmount()
    }).run()
  }
})

// One cycle is short enough for the JIT state of CodSpeed's single measured run
// to decide the number, see `components.bench.ts`.
const CYCLES = 20

describe('re-render', () => {
  for (const [name, render] of CASES) {
    test(name, async ({ bench }) => {
      const wrapper = await mountSuspended(makeParent(render), { props: { cls: 'p-2' } })

      await bench(`${name} x${CYCLES}`, async () => {
        for (let i = 0; i < CYCLES; i++) {
          await wrapper.setProps({ cls: 'p-3' })
          await wrapper.setProps({ cls: 'p-2' })
        }
      }).run()
    })
  }
})
