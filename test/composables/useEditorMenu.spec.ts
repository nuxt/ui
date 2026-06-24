import { computed } from 'vue'
import { beforeEach, describe, expect, it, vi, expectTypeOf } from 'vitest'
import type { SuggestionOptions } from '@tiptap/suggestion'
import { PluginKey } from '@tiptap/pm/state'
import { useEditorMenu } from '../../src/runtime/composables/useEditorMenu'
import type { EditorMenuOptions } from '../../src/runtime/composables/useEditorMenu'
import type { EditorSuggestionMenuProps } from '../../src/runtime/components/EditorSuggestionMenu.vue'
import type { EditorMentionMenuProps } from '../../src/runtime/components/EditorMentionMenu.vue'
import type { EditorEmojiMenuProps } from '../../src/runtime/components/EditorEmojiMenu.vue'

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
  if (suggestionMock.mock.calls.length !== 1) {
    throw new Error(`Suggestion should be called exactly once, but was called ${suggestionMock.mock.calls.length} times`)
  }

  return suggestionMock.mock.calls[0]![0]
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

  it('keeps plugin identity fields authoritative over suggestion overrides', () => {
    const wrongPluginKey = new PluginKey('wrong-plugin-key')
    const wrongEditor = createEditor()

    useEditorMenu(createOptions({
      suggestion: {
        pluginKey: wrongPluginKey,
        editor: wrongEditor,
        char: '@'
      } as Partial<SuggestionOptions>
    }))

    const config = getSuggestionConfig()

    expect(config.pluginKey).not.toBe(wrongPluginKey)
    expect(config.editor).not.toBe(wrongEditor)
    expect(config.char).toBe(':')
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
    type ExpectedType = Omit<Partial<SuggestionOptions>, 'pluginKey' | 'editor' | 'char' | 'items' | 'command' | 'render'> | undefined

    expectTypeOf<EditorMenuOptions<{ label: string }>['suggestion']>().toEqualTypeOf<ExpectedType>()
    expectTypeOf<EditorSuggestionMenuProps['suggestion']>().toEqualTypeOf<ExpectedType>()
    expectTypeOf<EditorMentionMenuProps['suggestion']>().toEqualTypeOf<ExpectedType>()
    expectTypeOf<EditorEmojiMenuProps['suggestion']>().toEqualTypeOf<ExpectedType>()
  })
})
