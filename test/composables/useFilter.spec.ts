import { describe, it, expect } from 'vitest'
import { useFilter } from '../../src/runtime/composables/useFilter'

type Item = string | { type: 'label' | 'separator', label?: string }

const isStructural = (item: Item) => typeof item === 'object' && ['label', 'separator'].includes(item.type)

describe('useFilter', () => {
  describe('filterGroups', () => {
    it('keeps labels and separators where they are while sorting the matches', () => {
      const { filterGroups } = useFilter()
      const separator: Item = { type: 'separator' }
      const group: Item[] = ['Banana', separator, 'Aubergine', 'Broccoli']

      expect(filterGroups([group], 'b', { fields: ['label'], isStructural })).toEqual([
        ['Banana', separator, 'Broccoli', 'Aubergine']
      ])
    })

    it('does not let a match move across a label', () => {
      const { filterGroups } = useFilter()
      const fruits: Item = { type: 'label', label: 'Fruits' }
      const vegetables: Item = { type: 'label', label: 'Vegetables' }
      const group: Item[] = [fruits, 'Banana', vegetables, 'Aubergine']

      expect(filterGroups([group], 'a', { fields: ['label'], isStructural })).toEqual([
        [fruits, 'Banana', vegetables, 'Aubergine']
      ])
    })

    it('sorts the matches by relevance', () => {
      const { filterGroups } = useFilter()
      const group: Item[] = ['Aubergine', 'Broccoli', 'B']

      expect(filterGroups([group], 'b', { fields: ['label'], isStructural })).toEqual([
        ['B', 'Broccoli', 'Aubergine']
      ])
    })

    it('drops a group left with structural items only', () => {
      const { filterGroups } = useFilter()
      const groups: Item[][] = [
        [{ type: 'label', label: 'Fruits' }, 'Apple'],
        [{ type: 'label', label: 'Vegetables' }, 'Carrot']
      ]

      expect(filterGroups(groups, 'apple', { fields: ['label'], isStructural })).toEqual([
        [{ type: 'label', label: 'Fruits' }, 'Apple']
      ])
    })
  })
})
