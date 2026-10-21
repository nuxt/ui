import { describe, it, expect } from 'vitest'
import { isToolStreaming } from '../../src/runtime/utils/ai'

describe('isToolStreaming', () => {
  it('is streaming until the tool reaches a terminal state', () => {
    expect(isToolStreaming({ state: 'input-streaming' })).toBe(true)
    expect(isToolStreaming({ state: 'input-available' })).toBe(true)
    expect(isToolStreaming({ state: 'approval-requested' })).toBe(false)
    expect(isToolStreaming({ state: 'output-available' })).toBe(false)
    expect(isToolStreaming({ state: 'output-error' })).toBe(false)
    expect(isToolStreaming({ state: 'output-denied' })).toBe(false)
  })

  it('stops streaming once the approval is denied', () => {
    expect(isToolStreaming({ state: 'approval-responded', approval: { approved: true } })).toBe(true)
    expect(isToolStreaming({ state: 'approval-responded', approval: { approved: false } })).toBe(false)
  })
})
