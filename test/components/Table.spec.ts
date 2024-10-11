import { describe, it, expect } from 'vitest'
import Table, { type TableProps, type TableSlots } from '../../src/runtime/components/Table.vue'
import ComponentRender from '../component-render'

describe('Table', () => {
  const data = [{
    id: 'm5gr84i9',
    amount: 316,
    status: 'success',
    email: 'ken99@yahoo.com'
  }, {
    id: '3u1reuv4',
    amount: 242,
    status: 'success',
    email: 'Abe45@gmail.com'
  }, {
    id: 'derv1ws0',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@gmail.com'
  }, {
    id: '5kma53ae',
    amount: 874,
    status: 'success',
    email: 'Silas22@gmail.com'
  }, {
    id: 'bhqecj4p',
    amount: 721,
    status: 'failed',
    email: 'carmella@hotmail.com'
  }]

  it.each([
    // Props
    ['with as', { props: { as: 'div' } }],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: TableProps<any>, slots?: Partial<TableSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Table)
    expect(html).toMatchSnapshot()
  })
})
