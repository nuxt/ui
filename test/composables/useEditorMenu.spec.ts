import { computed } from 'vue'
import { beforeEach, describe, expect, it, vi, expectTypeOf } from 'vitest'
import type { SuggestionOptions } from '@tiptap/suggestion'
import { useEditorMenu } from '../../src/runtime/composables/useEditorMenu'
import type { EditorMenuOptions } from '../../src/runtime/composables/useEditorMenu'
import type { EditorSuggestionMenuProps } from '../../src/runtime/components/EditorSuggestionMenu.vue'

const { suggestionMock } = vi.hoisted(() => ({
  suggestionMock: vi.fn((config: any) => config)
}))

vi.mock('@tiptap/suggestion', () => ({
  default: suggestionMock
}))

function createEditor() {
  const dom = document.createElement('div')
  const parent = document.createElement('div')
  parent.appendChild(dom)

  return {
    isDestroyed: false,
    view: {
      dom,
      state: {
        tr: {
          setMeta: vi.fn(() => ({}))
        }
      },
      dispatch: vi.fn()
    }
  } as any
}

function createOptions(overrides: Partial<EditorMenuOptions<{ label: string }>> = {}): EditorMenuOptions<{ label: string }> {
  return {
    editor: createEditor(),
    char: ':',
    pluginKey: 'suggestion-menu',
    items: [{ label: 'Alpha' }, { label: 'Beta' }],
    onSelect: vi.fn(),
    renderItem: vi.fn(() => []),
    ui: computed(() => ({
      content: () => '',
      viewport: () => '',
      group: () => '',
      label: () => '',
      separator: () => '',
      item: () => '',
      itemLeadingIcon: () => '',
      itemWrapper: () => '',
      itemLabel: () => '',
      itemDescription: () => ''
    })),
    ...overrides
  }
}

function getSuggestionConfig() {
  const config = suggestionMock.mock.calls[0]?.[0]

  if (!config) {
    throw new Error('Suggestion should be called exactly once')
  }

  return config
}

describe('useEditorMenu', () => {
  beforeEach(() => {
    suggestionMock.mockClear()
  })

  it('forwards suggestion matching options', () => {
    useEditorMenu(createOptions({
      suggestion: {
        allowedPrefixes: null,
        allowSpaces: true,
        startOfLine: true
      }
    }))

    const config = getSuggestionConfig()

    expect(config.allowedPrefixes).toBeNull()
    expect(config.allowSpaces).toBe(true)
    expect(config.startOfLine).toBe(true)
    expect(config.char).toBe(':')
  })

  it('keeps existing defaults when suggestion is omitted', () => {
    useEditorMenu(createOptions())

    const config = getSuggestionConfig()
    const items = config.items({ query: 'al' })

    expect(config).not.toHaveProperty('allowedPrefixes')
    expect(items).toEqual([{ label: 'Alpha' }])
  })

  it('keeps menu callbacks authoritative over suggestion overrides', () => {
    const suggestionItems = vi.fn(() => [])
    const suggestionCommand = vi.fn()
    const suggestionRender = vi.fn()

    useEditorMenu(createOptions({
      suggestion: {
        items: suggestionItems,
        command: suggestionCommand,
        render: suggestionRender
      } as Partial<SuggestionOptions>
    }))

    const config = getSuggestionConfig()

    expect(config.items).not.toBe(suggestionItems)
    expect(config.command).not.toBe(suggestionCommand)
    expect(config.render).not.toBe(suggestionRender)
  })

  it('types suggestion options on the composable and component props', () => {
    expectTypeOf<EditorMenuOptions<{ label: string }>['suggestion']>().toMatchTypeOf<Partial<SuggestionOptions> | undefined>()
    expectTypeOf<EditorSuggestionMenuProps['suggestion']>().toMatchTypeOf<Partial<SuggestionOptions> | undefined>()
  })
})
