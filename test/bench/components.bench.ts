import { bench, describe } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Button from '../../src/runtime/components/Button.vue'
import Table from '../../src/runtime/components/Table.vue'
import type { TableColumn } from '../../src/runtime/components/Table.vue'

// A toolbar of many buttons (the #6293 shape): each Button builds its own tv
// factory on mount, and re-renders on every editor transaction. Labels only —
// icons resolve via an async fetch that's orthogonal to the tv cost measured here.
const Toolbar = {
  components: { UButton: Button },
  template: `<div><UButton v-for="i in 25" :key="i" :label="'B' + i" /></div>`
}

describe('Button mount', () => {
  bench('toolbar of 25', async () => {
    const wrapper = await mountSuspended(Toolbar)
    wrapper.unmount()
  })
})

// Toggling a variant prop re-runs the component's `ui` computed. Today that
// rebuilds the whole tv factory; after PR 2 it only re-invokes it.
describe('Button re-render (variant prop change)', () => {
  let wrapper: Awaited<ReturnType<typeof mountSuspended>>
  let loading = false

  bench('toggle loading', async () => {
    loading = !loading
    await wrapper.setProps({ loading })
  }, {
    async setup() {
      wrapper = await mountSuspended(Button, { props: { label: 'Button' } })
    },
    teardown() {
      wrapper?.unmount()
    }
  })
})

type Row = { id: number, name: string, email: string, amount: number, status: string }

function makeData(n: number): Row[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    name: `Name ${i}`,
    email: `user${i}@example.com`,
    amount: i * 3,
    status: i % 2 ? 'success' : 'failed'
  }))
}

const columns: TableColumn<Row>[] = [
  { accessorKey: 'id', header: '#' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'amount', header: 'Amount' },
  { accessorKey: 'status', header: 'Status' }
]

// The per-cell `ui.td()` path at scale (200 rows x 5 columns = 1000 cells).
describe('Table mount (200 x 5)', () => {
  const data = makeData(200)

  bench('mount', async () => {
    const wrapper = await mountSuspended(Table, { props: { data, columns } })
    wrapper.unmount()
  })
})

describe('Table re-render (new data identity)', () => {
  let wrapper: Awaited<ReturnType<typeof mountSuspended>>

  bench('set data', async () => {
    await wrapper.setProps({ data: makeData(200) })
  }, {
    async setup() {
      wrapper = await mountSuspended(Table, { props: { data: makeData(200), columns } })
    },
    teardown() {
      wrapper?.unmount()
    }
  })
})
