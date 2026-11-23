import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'

const items = [{ label: 'apple' }, { label: 'banana' }, { label: 'cherry' }]
const options = { fuseOptions: { keys: ['label'], threshold: 0.1 }, matchAllWhenSearchEmpty: true }

// Each test imports a fresh copy, so `fuse.js` starts unloaded
async function mountWith(search: string, data: typeof items) {
  vi.resetModules()

  const { useLazyFuse, loadFuse } = await import('../../src/runtime/utils/fuse')

  let results!: ReturnType<typeof useLazyFuse<typeof items[number]>>['results']
  const term = ref(search)

  mount(defineComponent({
    setup() {
      results = useLazyFuse(term, data, options).results
      return () => h('div')
    }
  }))

  const labels = () => results.value.map(result => result.item.label)

  return { labels, term, loadFuse }
}

describe('useLazyFuse', () => {
  it('matches every item until fuse.js has loaded, then filters', async () => {
    const { labels, loadFuse } = await mountWith('ban', items)

    expect(labels()).toEqual(['apple', 'banana', 'cherry'])

    await loadFuse()
    await nextTick()

    expect(labels()).toEqual(['banana'])
  })

  it('matches every item for an empty search', async () => {
    const { labels, term, loadFuse } = await mountWith('', items)

    await loadFuse()
    await nextTick()

    expect(labels()).toEqual(['apple', 'banana', 'cherry'])

    term.value = 'cher'
    await nextTick()

    expect(labels()).toEqual(['cherry'])
  })

  it('filters from the first render once fuse.js has loaded', async () => {
    const { loadFuse } = await mountWith('', items)

    await loadFuse()

    const { useLazyFuse } = await import('../../src/runtime/utils/fuse')

    let results!: ReturnType<typeof useLazyFuse<typeof items[number]>>['results']

    mount(defineComponent({
      setup() {
        results = useLazyFuse(ref('app'), items, options).results
        return () => h('div')
      }
    }))

    expect(results.value.map(result => result.item.label)).toEqual(['apple'])
  })

  it('loads fuse.js once mounted with items to filter, and not without', async () => {
    const factory = vi.fn(() => vi.importActual('fuse.js'))

    vi.doMock('fuse.js', factory)

    try {
      const empty = await mountWith('ban', [])

      await new Promise(resolve => setTimeout(resolve))

      expect(factory).not.toHaveBeenCalled()
      expect(empty.labels()).toEqual([])

      await mountWith('ban', items)
      await new Promise(resolve => setTimeout(resolve))

      expect(factory).toHaveBeenCalledOnce()
    } finally {
      vi.doUnmock('fuse.js')
    }
  })
})
