import { describe, it, expect } from 'vitest'
import { globSync } from 'tinyglobby'
import { join } from 'pathe'
import * as proseComponents from '../../../src/runtime/components/prose'

describe('prose', () => {
  it('exports every prose component', () => {
    const files = globSync('**/*.vue', { cwd: join(process.cwd(), 'src/runtime/components/prose') })
    const names = files.map(file => `Prose${file.split('/').pop()!.replace(/\.vue$/, '')}`)

    expect(Object.keys(proseComponents).sort()).toEqual(names.sort())
  })
})
