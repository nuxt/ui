import { bench, describe } from 'vitest'
import {
  get,
  set,
  pick,
  omit,
  compare,
  isEmpty,
  getDisplayValue,
  mergeClasses,
  transformUI,
  resolveBaseURL
} from '../src/runtime/utils/index'

const nestedObject = {
  user: {
    profile: {
      name: 'John Doe',
      address: {
        city: 'Paris',
        country: 'France',
        zip: '75001'
      }
    },
    roles: ['admin', 'editor', 'viewer']
  }
}

const flatObject = Object.fromEntries(
  Array.from({ length: 50 }, (_, i) => [`key${i}`, `value${i}`])
)

const items = Array.from({ length: 500 }, (_, i) => ({
  id: i,
  label: `Item ${i}`,
  value: `value-${i}`
}))

describe('get', () => {
  bench('nested string path', () => {
    get(nestedObject, 'user.profile.address.city')
  })

  bench('array path', () => {
    get(nestedObject, ['user', 'roles', 1])
  })

  bench('missing path with default', () => {
    get(nestedObject, 'user.profile.nonexistent.deep', 'fallback')
  })
})

describe('set', () => {
  bench('nested string path', () => {
    set({ user: { profile: {} } }, 'user.profile.address.city', 'Lyon')
  })
})

describe('pick / omit', () => {
  bench('pick keys', () => {
    pick(flatObject, ['key0', 'key10', 'key20', 'key30', 'key40'])
  })

  bench('omit keys', () => {
    omit(flatObject, ['key0', 'key10', 'key20', 'key30', 'key40'])
  })
})

describe('compare', () => {
  bench('primitive strings', () => {
    compare('hello', 'hello')
  })

  bench('objects with comparator key', () => {
    compare({ id: 1, label: 'a' }, { id: 1, label: 'b' }, 'id')
  })

  bench('deep equality', () => {
    compare(nestedObject, nestedObject)
  })
})

describe('isEmpty', () => {
  bench('empty string', () => {
    isEmpty('   ')
  })

  bench('populated object', () => {
    isEmpty(flatObject)
  })

  bench('array', () => {
    isEmpty(items)
  })
})

describe('getDisplayValue', () => {
  bench('find by value key in large list', () => {
    getDisplayValue(items, 'value-250', { valueKey: 'value', labelKey: 'label' })
  })
})

describe('mergeClasses', () => {
  bench('array + prop class', () => {
    mergeClasses(['bg-red-500', 'text-white', 'p-4'], 'rounded-lg shadow')
  })
})

describe('transformUI', () => {
  const ui = Object.fromEntries(
    Array.from({ length: 20 }, (_, i) => [`slot${i}`, () => `class-${i}`])
  )

  bench('transform functional ui config', () => {
    transformUI(ui, { slot0: 'override' })
  })
})

describe('resolveBaseURL', () => {
  bench('join base url', () => {
    resolveBaseURL('/docs/getting-started', '/app')
  })
})
