import { useCompletion } from '@ai-sdk/vue'
import type { Editor } from '@tiptap/vue-3'
import { Completion } from './EditorCompletionExtension'
import type { CompletionStorage } from './EditorCompletionExtension'

type CompletionMode = 'continue' | 'fix' | 'extend' | 'reduce' | 'simplify' | 'summarize' | 'translate'

export interface UseEditorCompletionOptions {
  api?: string
}

export function useEditorCompletion(editorRef: Ref<{ editor: Editor | undefined } | null | undefined>, options: UseEditorCompletionOptions = {}) {
  // State for direct insertion/transform mode
  const insertState = ref<{
    pos: number
    deleteRange?: { from: number, to: number }
    // Latest streamed completion (full text), committed onFinish
    result?: string
    // Whether we should prefer inline insertion (unwrap single paragraph)
    preferInline?: boolean
    // Whether the initial deleteRange has been applied
    selectionDeleted?: boolean
    // Current range of the inserted streamed content (so we can replace it on each chunk)
    insertedRange?: { from: number, to: number }
    // Optional prefix (e.g. leading space for continue mode)
    prefix?: string
  }>()
  const mode = ref<CompletionMode>('continue')
  const language = ref<string>()

  function normalizeMarkdownForMode(raw: string, editor: Editor | undefined, state: NonNullable<typeof insertState.value>) {
    let markdownText = String(raw)

    // For single-paragraph transforms, replace all line breaks with spaces
    if (['fix', 'simplify', 'translate'].includes(mode.value)) {
      markdownText = markdownText.replace(/[\r\n]+/g, ' ').replace(/\s{2,}/g, ' ')
    }

    // For "continue" mode, add a space before if needed (computed once and reused for all chunks)
    if (mode.value === 'continue' && editor) {
      if (state.prefix === undefined) {
        const insertPos = state.insertedRange?.from ?? state.deleteRange?.from ?? state.pos
        const textBefore = editor.state.doc.textBetween(Math.max(0, insertPos - 1), insertPos)
        const needsSpace = !!(textBefore && !/\s/.test(textBefore) && markdownText && !/^\s/.test(markdownText))
        state.prefix = needsSpace ? ' ' : ''
      }
      markdownText = (state.prefix || '') + markdownText
    }

    return markdownText
  }

  function getInsertableContent(editor: Editor, markdownText: string, preferInline: boolean | undefined) {
    const markdownManager = editor.markdown
    const canParseMarkdown = !!markdownManager && typeof markdownManager.parse === 'function'

    if (!canParseMarkdown) {
      return markdownText
    }

    const parsed = markdownManager.parse(markdownText)
    const content = parsed && Array.isArray(parsed.content) ? parsed.content : null
    if (!content) {
      return markdownText
    }

    if (preferInline && content.length === 1 && content[0]?.type === 'paragraph' && Array.isArray(content[0].content)) {
      return content[0].content
    }
    return content
  }

  // Throttle heavy editor updates while streaming
  function createThrottle<T extends (...args: any[]) => void>(fn: T, waitMs: number) {
    let last = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    let pendingArgs: any[] | undefined

    const run = () => {
      timer = undefined
      last = Date.now()
      if (pendingArgs) {
        const args = pendingArgs
        pendingArgs = undefined
        fn(...args)
      }
    }

    return (...args: Parameters<T>) => {
      const now = Date.now()
      const elapsed = now - last
      pendingArgs = args

      if (elapsed >= waitMs) {
        if (timer) {
          clearTimeout(timer)
          timer = undefined
        }
        run()
        return
      }

      if (!timer) {
        timer = setTimeout(run, waitMs - elapsed)
      }
    }
  }

  function applyStreamedInsert(editor: Editor, state: NonNullable<typeof insertState.value>, rawCompletion: string) {
    const markdownText = normalizeMarkdownForMode(rawCompletion, editor, state)

    const replaceFrom = state.insertedRange?.from ?? state.deleteRange?.from ?? state.pos
    const replaceTo = state.insertedRange?.to ?? state.deleteRange?.to ?? state.pos
    const content = getInsertableContent(editor, markdownText, state.preferInline)

    const beforeSize = editor.state.doc.content.size

    editor
      .chain()
      .focus()
      .deleteRange({ from: replaceFrom, to: replaceTo })
      .insertContentAt(replaceFrom, content)
      .run()

    const afterSize = editor.state.doc.content.size
    const deletedSize = replaceTo - replaceFrom
    const insertedSize = afterSize - beforeSize + deletedSize
    state.insertedRange = { from: replaceFrom, to: replaceFrom + Math.max(0, insertedSize) }
    state.selectionDeleted = true
  }

  const throttledApplyStreamedInsert = createThrottle(applyStreamedInsert, 50)

  // Helper to get completion storage
  function getCompletionStorage() {
    const storage = editorRef.value?.editor?.storage as Record<string, CompletionStorage> | undefined
    return storage?.completion
  }

  const { completion, complete, isLoading, stop, setCompletion } = useCompletion({
    api: options.api || '/api/completion',
    streamProtocol: 'text',
    body: computed(() => ({
      mode: mode.value,
      language: language.value
    })),
    onFinish: () => {
      // For inline suggestion mode, don't clear - let user accept with Tab
      const storage = getCompletionStorage()
      if (mode.value === 'continue' && storage?.visible) {
        return
      }

      // For direct insertion/transform mode, keep streaming updates; ensure we flush the last chunk.
      const editor = editorRef.value?.editor
      const state = insertState.value

      if (editor && state?.result) {
        // Flush any pending throttled updates by applying the final text immediately.
        applyStreamedInsert(editor, state, state.result)
      }

      insertState.value = undefined
      setCompletion('')
    },
    onError: (error) => {
      console.error('AI completion error:', error)
      insertState.value = undefined
      getCompletionStorage()?.clearSuggestion()
      setCompletion('')
    }
  })

  // Watch completion for inline suggestion updates
  watch(completion, (newCompletion, _oldCompletion) => {
    const editor = editorRef.value?.editor
    if (!editor || !newCompletion) return

    const storage = getCompletionStorage()
    if (storage?.visible) {
      // Update inline suggestion
      storage.setSuggestion(newCompletion)
      editor.view.dispatch(editor.state.tr.setMeta('completionUpdate', true))
    } else if (insertState.value) {
      // Direct insertion/transform mode (from toolbar actions)
      // Replace inserted content incrementally while streaming (parsed as markdown).
      insertState.value.result = newCompletion
      throttledApplyStreamedInsert(editor, insertState.value, newCompletion)
    }
  })

  function triggerTransform(editor: Editor, transformMode: Exclude<CompletionMode, 'continue'>, lang?: string) {
    if (isLoading.value) return

    getCompletionStorage()?.clearSuggestion()

    const { state } = editor
    const { selection } = state

    if (selection.empty) return

    mode.value = transformMode
    language.value = lang
    const selectedText = state.doc.textBetween(selection.from, selection.to)

    // Replace the selected text with the transformed version
    insertState.value = {
      pos: selection.from,
      deleteRange: { from: selection.from, to: selection.to },
      result: undefined,
      preferInline: selection.$from.sameParent(selection.$to) && selection.$from.parent.isTextblock,
      selectionDeleted: false,
      insertedRange: undefined,
      prefix: undefined
    }

    complete(selectedText)
  }

  function triggerContinue(editor: Editor) {
    if (isLoading.value) return

    mode.value = 'continue'
    getCompletionStorage()?.clearSuggestion()
    const { state } = editor
    const { selection } = state

    if (selection.empty) {
      // No selection: continue from cursor position
      const textBefore = state.doc.textBetween(0, selection.from, '\n')
      insertState.value = {
        pos: selection.from,
        result: undefined,
        preferInline: true,
        selectionDeleted: false,
        insertedRange: undefined,
        prefix: undefined
      }
      complete(textBefore)
    } else {
      // Text selected: append completion after the selection
      const selectedText = state.doc.textBetween(selection.from, selection.to)
      insertState.value = {
        pos: selection.to,
        result: undefined,
        preferInline: selection.$from.sameParent(selection.$to) && selection.$from.parent.isTextblock,
        selectionDeleted: false,
        insertedRange: undefined,
        prefix: undefined
      }
      complete(selectedText)
    }
  }

  // Configure Completion extension
  const extension = Completion.configure({
    onTrigger: (textBefore) => {
      if (isLoading.value) return
      mode.value = 'continue'
      complete(textBefore)
    },
    onAccept: () => {
      setCompletion('')
    },
    onDismiss: () => {
      stop()
      setCompletion('')
    }
  })

  // Create handlers for toolbar
  const handlers = {
    aiContinue: {
      canExecute: () => !isLoading.value,
      execute: (editor: Editor) => {
        triggerContinue(editor)
        return editor.chain()
      },
      isActive: () => !!(isLoading.value && mode.value === 'continue'),
      isDisabled: () => !!isLoading.value
    },
    aiFix: {
      canExecute: (editor: Editor) => !editor.state.selection.empty && !isLoading.value,
      execute: (editor: Editor) => {
        triggerTransform(editor, 'fix')
        return editor.chain()
      },
      isActive: () => !!(isLoading.value && mode.value === 'fix'),
      isDisabled: (editor: Editor) => editor.state.selection.empty || !!isLoading.value
    },
    aiExtend: {
      canExecute: (editor: Editor) => !editor.state.selection.empty && !isLoading.value,
      execute: (editor: Editor) => {
        triggerTransform(editor, 'extend')
        return editor.chain()
      },
      isActive: () => !!(isLoading.value && mode.value === 'extend'),
      isDisabled: (editor: Editor) => editor.state.selection.empty || !!isLoading.value
    },
    aiReduce: {
      canExecute: (editor: Editor) => !editor.state.selection.empty && !isLoading.value,
      execute: (editor: Editor) => {
        triggerTransform(editor, 'reduce')
        return editor.chain()
      },
      isActive: () => !!(isLoading.value && mode.value === 'reduce'),
      isDisabled: (editor: Editor) => editor.state.selection.empty || !!isLoading.value
    },
    aiSimplify: {
      canExecute: (editor: Editor) => !editor.state.selection.empty && !isLoading.value,
      execute: (editor: Editor) => {
        triggerTransform(editor, 'simplify')
        return editor.chain()
      },
      isActive: () => !!(isLoading.value && mode.value === 'simplify'),
      isDisabled: (editor: Editor) => editor.state.selection.empty || !!isLoading.value
    },
    aiSummarize: {
      canExecute: (editor: Editor) => !editor.state.selection.empty && !isLoading.value,
      execute: (editor: Editor) => {
        triggerTransform(editor, 'summarize')
        return editor.chain()
      },
      isActive: () => !!(isLoading.value && mode.value === 'summarize'),
      isDisabled: (editor: Editor) => editor.state.selection.empty || !!isLoading.value
    },
    aiTranslate: {
      canExecute: (editor: Editor) => !editor.state.selection.empty && !isLoading.value,
      execute: (editor: Editor, cmd: { language?: string } | undefined) => {
        triggerTransform(editor, 'translate', cmd?.language)
        return editor.chain()
      },
      isActive: (_editor: Editor, cmd: { language?: string } | undefined) => !!(isLoading.value && mode.value === 'translate' && language.value === cmd?.language),
      isDisabled: (editor: Editor) => editor.state.selection.empty || !!isLoading.value
    }
  }

  return {
    extension,
    handlers,
    isLoading,
    mode
  }
}
