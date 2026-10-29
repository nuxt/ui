import { test } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Button from '../../src/runtime/components/Button.vue'
import Table from '../../src/runtime/components/Table.vue'
import type { TableColumn, TableData } from '../../src/runtime/components/Table.vue'

// A toolbar of many buttons (the #6293 shape): each Button builds its own tv
// factory on mount, and re-renders on every editor transaction. Labels only —
// icons resolve via an async fetch that's orthogonal to the tv cost measured here.
const Toolbar = {
  components: { UButton: Button },
  template: `<div><UButton v-for="i in 25" :key="i" :label="'B' + i" /></div>`
}

// CodSpeed measures one run after a forced GC, and a single on/off cycle is
// short enough that the JIT state it lands in decides the number: the Button
// benches swung between ~14 ms and ~19 ms on changes that didn't touch them.
// Repeating the cycle lets that one-off cost amortize. The names carry the
// count so CodSpeed reads them as new benches rather than as a 20x regression.
const CYCLES = 20

test('Button mount', async ({ bench }) => {
  await bench('toolbar of 25', async () => {
    const wrapper = await mountSuspended(Toolbar)
    wrapper.unmount()
  }).run()
})

// Toggling a variant prop re-runs the component's `ui` computed and re-renders
// its subtree. Each iteration performs a full on/off cycle so the work measured
// is deterministic and always ends back in the initial `false` state.
test('Button re-render (variant prop change)', async ({ bench }) => {
  const wrapper = await mountSuspended(Button, { props: { label: 'Button' } })

  await bench(`toggle loading x${CYCLES}`, async () => {
    for (let i = 0; i < CYCLES; i++) {
      await wrapper.setProps({ loading: true })
      await wrapper.setProps({ loading: false })
    }
  }).run()
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

// `mountSuspended` doesn't infer the Table's row generic, so the mounted prop
// expects `TableColumn<TableData>[]` — cast the checked columns at use.
const tableProps = (data: Row[]) => ({ data, columns: columns as unknown as TableColumn<TableData>[] })

// Under CodSpeed's simulator each Table test runs well past the 60s timeout
// Vitest gives benchmark projects, so it is disabled for them.
const tableBench = { timeout: 0 }

// The per-cell `ui.td()` path at scale (200 rows x 5 columns = 1000 cells).
test('Table mount (200 x 5)', tableBench, async ({ bench }) => {
  const data = makeData(200)

  await bench('mount', async () => {
    const wrapper = await mountSuspended(Table, { props: tableProps(data) })
    wrapper.unmount()
  }).run()
})

test('Table re-render (new data identity)', tableBench, async ({ bench }) => {
  const wrapper = await mountSuspended(Table, { props: tableProps(makeData(200)) })

  await bench('set data', async () => {
    await wrapper.setProps({ data: makeData(200) })
  }).run()
})
