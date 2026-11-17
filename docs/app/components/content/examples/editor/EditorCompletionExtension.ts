import { Extension } from '@tiptap/core'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import type { Editor } from '@tiptap/vue-3'
import { useDebounceFn } from '@vueuse/core'

export interface CompletionOptions {
  /**
   * Debounce delay in ms before triggering completion
   * @defaultValue 250
   */
  debounce?: number
  /**
   * Whether to automatically trigger completion while typing
   * @defaultValue true
   */
  autoTrigger?: boolean
  /**
   * Characters that prevent completion while typing the word they start (slash commands, emojis, mentions)
   * @defaultValue ['/', ':', '@']
   */
  triggerCharacters?: string[]
  /**
   * Called when completion should be triggered, receives the editor instance.
   * Return `false` to skip showing a suggestion.
   */
  onTrigger?: (editor: Editor) => boolean | undefined
  /**
   * Called when suggestion is accepted
   */
  onAccept?: () => void
  /**
   * Called when suggestion is dismissed
   */
  onDismiss?: () => void
}

export interface CompletionStorage {
  suggestion: string
  position: number | undefined
  visible: boolean
  debouncedTrigger: ((editor: Editor) => void) | null
  setSuggestion: (text: string) => void
  clearSuggestion: () => void
}

export const completionPluginKey = new PluginKey('completion')

function dismiss(editor: Editor, storage: CompletionStorage, options: CompletionOptions) {
  storage.clearSuggestion()
  // Force decoration update
  editor.view.dispatch(editor.state.tr.setMeta('completionUpdate', true))
  options.onDismiss?.()
}

export const Completion = Extension.create<CompletionOptions, CompletionStorage>({
  name: 'completion',

  addOptions() {
    return {
      debounce: 250,
      autoTrigger: true,
      triggerCharacters: ['/', ':', '@'],
      onTrigger: undefined,
      onAccept: undefined,
      onDismiss: undefined
    }
  },

  addStorage() {
    return {
      suggestion: '',
      position: undefined as number | undefined,
      visible: false,
      debouncedTrigger: null as ((editor: Editor) => void) | null,
      setSuggestion(text: string) {
        this.suggestion = text
      },
      clearSuggestion() {
        this.suggestion = ''
        this.position = undefined
        this.visible = false
      }
    }
  },

  addProseMirrorPlugins() {
    const storage = this.storage

    return [
      new Plugin({
        key: completionPluginKey,
        props: {
          decorations(state) {
            if (!storage.visible || !storage.suggestion || storage.position === undefined) {
              return DecorationSet.empty
            }

            const widget = Decoration.widget(storage.position, () => {
              const span = document.createElement('span')
              span.className = 'completion-suggestion'
              span.textContent = storage.suggestion
              span.style.cssText = 'color: var(--ui-text-muted); opacity: 0.6; pointer-events: none;'
              return span
            }, { side: 1 })

            return DecorationSet.create(state.doc, [widget])
          }
        }
      })
    ]
  },

  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        if (!this.storage.visible || !this.storage.suggestion || this.storage.position === undefined) {
          return false
        }

        // Store values before clearing
        const suggestion = this.storage.suggestion
        const position = this.storage.position

        // Clear suggestion first
        this.storage.clearSuggestion()

        // Force decoration update
        editor.view.dispatch(editor.state.tr.setMeta('completionUpdate', true))

        // Insert the suggestion text
        editor.chain().focus().insertContentAt(position, suggestion).run()

        this.options.onAccept?.()
        return true
      },
      Escape: ({ editor }) => {
        if (!this.storage.visible) {
          return false
        }

        dismiss(editor as Editor, this.storage, this.options)
        return true
      }
    }
  },

  onUpdate({ editor }) {
    // Clear suggestion on any edit
    if (this.storage.visible) {
      dismiss(editor as Editor, this.storage, this.options)
    }

    if (this.options.autoTrigger) {
      this.storage.debouncedTrigger?.(editor as Editor)
    }
  },

  onSelectionUpdate({ editor }) {
    if (this.storage.visible) {
      dismiss(editor as Editor, this.storage, this.options)
    }
  },

  onCreate() {
    const storage = this.storage
    const options = this.options

    // Create debounced trigger function for this instance
    this.storage.debouncedTrigger = useDebounceFn((editor: Editor) => {
      if (!options.onTrigger) return

      const { state } = editor
      const { selection } = state
      const { $from } = selection

      // Only suggest at end of block with content
      const isAtEndOfBlock = $from.parentOffset === $from.parent.content.size
      const hasContent = $from.parent.textContent.trim().length > 0
      const textContent = $from.parent.textContent

      // Don't trigger if sentence is complete (ends with punctuation)
      const endsWithPunctuation = /[.!?]\s*$/.test(textContent)

      // Don't trigger while typing a word that starts with a trigger character
      const lastWord = textContent.split(/\s/).pop() || ''
      const endsWithTrigger = (options.triggerCharacters || []).some(char => lastWord.startsWith(char))

      if (!isAtEndOfBlock || !hasContent || endsWithPunctuation || endsWithTrigger) {
        return
      }

      // Pass editor to let the handler extract content (e.g., as markdown)
      if (options.onTrigger(editor) === false) {
        return
      }

      // Set position and mark as visible
      storage.position = selection.from
      storage.visible = true
    }, options.debounce || 250)
  },

  onDestroy() {
    this.storage.debouncedTrigger = null
  }
})

export default Completion
