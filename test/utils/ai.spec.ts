import { describe, it, expect } from 'vitest'
import { isPartStreaming, isToolStreaming, toFileUIParts } from '../../src/runtime/utils/ai'

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

  it('stops streaming when the message is no longer streaming', () => {
    expect(isToolStreaming({ state: 'input-streaming' }, false)).toBe(false)
    expect(isToolStreaming({ state: 'input-streaming' }, true)).toBe(true)
  })
})

describe('isPartStreaming', () => {
  it('stops streaming when the message is no longer streaming', () => {
    expect(isPartStreaming({ state: 'streaming' })).toBe(true)
    expect(isPartStreaming({ state: 'streaming' }, true)).toBe(true)
    expect(isPartStreaming({ state: 'streaming' }, false)).toBe(false)
    expect(isPartStreaming({ state: 'done' }, true)).toBe(false)
  })
})

describe('toFileUIParts', () => {
  it('converts files to data URL file parts', async () => {
    const parts = await toFileUIParts([new File(['hello'], 'hello.txt', { type: 'text/plain' })])

    expect(parts).toEqual([{ type: 'file', mediaType: 'text/plain', filename: 'hello.txt', url: 'data:text/plain;base64,aGVsbG8=' }])
  })

  it('falls back to a generic media type', async () => {
    const [part] = await toFileUIParts([new File(['hello'], 'hello')])

    expect(part!.mediaType).toBe('application/octet-stream')
  })
})
