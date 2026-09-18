<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { Extension } from '@codemirror/state'
import type { EditorView, Panel, ViewUpdate } from '@codemirror/view'
// eslint-disable-next-line vue/no-dupe-keys
import theme from '#build/ui/code-editor'
import type { ModelModifiers } from '../types/input'
import type { ComponentConfig } from '../types/tv'
import type { CodeEditorHighlighter, CodeEditorThemes, CodeEditorToken } from '../utils/code-editor'

type CodeEditor = ComponentConfig<typeof theme, AppConfig, 'codeEditor'>

export type CodeEditorModelModifiers = Pick<ModelModifiers, 'lazy' | 'trim'>

export interface CodeEditorProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  id?: string
  name?: string
  /** The placeholder text when the editor is empty. */
  placeholder?: string
  /**
   * The language used to highlight the code, any language bundled with Shiki.
   * @defaultValue 'text'
   * @see https://shiki.style/languages
   */
  lang?: string
  /**
   * The Shiki theme used to color the tokens, or one theme per color mode.
   * @defaultValue { light: 'material-theme-lighter', dark: 'material-theme-palenight' }
   * @see https://shiki.style/themes
   */
  theme?: string | CodeEditorThemes
  /**
   * The Shiki highlighter used to tokenize the code. When not set, a highlighter using the JavaScript RegExp engine is created once and shared by every editor.
   * @see https://shiki.style/guide/install#highlighter-usage
   */
  highlighter?: CodeEditorHighlighter
  /**
   * @defaultValue 'primary'
   */
  color?: CodeEditor['variants']['color']
  /**
   * @defaultValue 'outline'
   */
  variant?: CodeEditor['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: CodeEditor['variants']['size']
  required?: boolean
  autofocus?: boolean
  autofocusDelay?: number
  disabled?: boolean
  readonly?: boolean
  /**
   * The minimum number of visible rows.
   * @defaultValue 3
   */
  rows?: number
  /**
   * The maximum number of visible rows before the editor scrolls, `0` to grow with the content.
   * @defaultValue 0
   */
  maxrows?: number
  /**
   * Display the line numbers gutter.
   * @defaultValue true
   */
  lineNumbers?: boolean
  /**
   * Wrap long lines instead of scrolling horizontally.
   * @defaultValue false
   */
  lineWrapping?: boolean
  /**
   * The number of spaces a tab is displayed as and a level of indentation inserts.
   * @defaultValue 2
   */
  tabSize?: number
  /**
   * Indent and dedent with the Tab key. Disabled by default as it traps the keyboard focus, press Escape then Tab to leave the editor when enabled.
   * @defaultValue false
   */
  indentWithTab?: boolean
  /**
   * Additional CodeMirror extensions, appended after the built-in ones.
   * @see https://codemirror.net/docs/extensions/
   */
  extensions?: Extension[]
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  /** Keep the mobile text size on all breakpoints. */
  fixed?: boolean
  defaultValue?: string
  modelValue?: string | null
  modelModifiers?: CodeEditorModelModifiers
  class?: any
  ui?: CodeEditor['slots']
}

export interface CodeEditorEmits {
  'update:modelValue': [value: string]
  'blur': [event: FocusEvent]
  'change': [event: Event]
}

export interface CodeEditorSlots {
  default?(props: { ui: CodeEditor['ui'] }): VNode[]
}
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, onServerPrefetch, reactive, ref, shallowRef, useAttrs, useTemplateRef, watch } from 'vue'
import { Primitive } from 'reka-ui'
import { useVModel } from '@vueuse/core'
import { Compartment, EditorState } from '@codemirror/state'
import { EditorView as CodeMirrorView, dropCursor, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, keymap, lineNumbers as lineNumbersGutter, placeholder as placeholderExtension, runScopeHandlers } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentWithTab as indentWithTabKeymap } from '@codemirror/commands'
import { SearchQuery, closeSearchPanel, findNext, findPrevious, getSearchQuery, highlightSelectionMatches, replaceAll, replaceNext, search, searchKeymap, selectMatches, setSearchQuery } from '@codemirror/search'
import { bracketMatching, indentUnit } from '@codemirror/language'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useFormField } from '../composables/useFormField'
import { useLocale } from '../composables/useLocale'
import { omit } from '../utils'
import { getCodeEditorHighlighter, getResolvedCodeEditorHighlighter, isCodeEditorHighlighterReady, prepareCodeEditorHighlighter, resolveCodeEditorThemes, shikiHighlight, tokenizeCodeEditorLines } from '../utils/code-editor'
import { tv } from '../utils/tv'
import UButton from './Button.vue'
import UFieldGroup from './FieldGroup.vue'
import UInput from './Input.vue'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<CodeEditorProps>(), {
  lang: 'text',
  rows: 3,
  maxrows: 0,
  autofocusDelay: 0,
  lineNumbers: true,
  tabSize: 2
})
const emits = defineEmits<CodeEditorEmits>()
defineSlots<CodeEditorSlots>()
const attrs = useAttrs()

const props = useComponentProps<CodeEditorProps>('codeEditor', _props)

// eslint-disable-next-line vue/no-dupe-keys
const modelValue = useVModel<CodeEditorProps, 'modelValue', 'update:modelValue'>(props, 'modelValue', emits, { defaultValue: props.defaultValue })

const appConfig = useAppConfig() as CodeEditor['AppConfig']
const { t } = useLocale()

const { emitFormFocus, emitFormBlur, emitFormInput, emitFormChange, size: formFieldSize, color: formFieldColor, id, name, highlight: formFieldHighlight, disabled: formFieldDisabled, ariaAttrs } = useFormField<CodeEditorProps>(_props, { deferInputValidation: true })

// eslint-disable-next-line vue/no-dupe-keys
const color = computed(() => formFieldColor.value ?? props.color)
// eslint-disable-next-line vue/no-dupe-keys
const highlight = computed(() => formFieldHighlight.value ?? props.highlight)
// eslint-disable-next-line vue/no-dupe-keys
const size = computed(() => formFieldSize.value ?? props.size)
// eslint-disable-next-line vue/no-dupe-keys
const disabled = computed(() => formFieldDisabled.value ?? props.disabled)
// eslint-disable-next-line vue/no-dupe-keys
const readonly = computed(() => !!(disabled.value || props.readonly))

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.codeEditor || {}) })({
  color: color.value,
  variant: props.variant,
  size: size.value,
  highlight: highlight.value,
  fixed: props.fixed,
  disabled: disabled.value,
  maxrows: props.maxrows! > 0
}))

const rowsStyle = computed(() => ({
  '--ui-code-editor-rows': props.rows,
  '--ui-code-editor-maxrows': props.maxrows! > 0 ? props.maxrows : undefined
}))

const editorRef = useTemplateRef('editorRef')
const view = shallowRef<EditorView>()

const compartments = {
  editable: new Compartment(),
  lineNumbers: new Compartment(),
  lineWrapping: new Compartment(),
  indentation: new Compartment(),
  placeholder: new Compartment(),
  attributes: new Compartment(),
  highlight: new Compartment(),
  extensions: new Compartment()
}

function editableExtension(): Extension {
  return [CodeMirrorView.editable.of(!disabled.value), EditorState.readOnly.of(readonly.value)]
}

function lineNumbersExtension(): Extension {
  return props.lineNumbers ? [lineNumbersGutter(), highlightActiveLineGutter()] : []
}

function lineWrappingExtension(): Extension {
  return props.lineWrapping ? CodeMirrorView.lineWrapping : []
}

function indentationExtension(): Extension {
  return [
    EditorState.tabSize.of(props.tabSize!),
    indentUnit.of(' '.repeat(props.tabSize!)),
    keymap.of(props.indentWithTab ? [indentWithTabKeymap] : [])
  ]
}

function placeholderCompartmentExtension(): Extension {
  return props.placeholder ? placeholderExtension(props.placeholder) : []
}

function attributesExtension(): Extension {
  const contentAttributes: Record<string, string> = {}
  for (const [key, value] of Object.entries({ ...omit(attrs, ['data-slot', 'style']), ...ariaAttrs.value })) {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      contentAttributes[key] = String(value)
    }
  }
  if (id.value) {
    contentAttributes.id = id.value
  }
  if (props.required) {
    contentAttributes['aria-required'] = 'true'
  }
  if (disabled.value) {
    contentAttributes['aria-disabled'] = 'true'
    contentAttributes.tabindex = '-1'
  }

  const editorClass = ui.value.editor({ class: props.ui?.editor })
  const contentClass = ui.value.content({ class: props.ui?.content })
  if (contentClass) {
    contentAttributes.class = contentClass
  }

  return [
    CodeMirrorView.editorAttributes.of(editorClass ? { class: editorClass } : {}),
    CodeMirrorView.contentAttributes.of(contentAttributes)
  ]
}

function extensionsExtension(): Extension {
  return props.extensions ?? []
}

function updateModel(value: string) {
  if (props.modelModifiers?.trim) {
    value = value.trim()
  }

  modelValue.value = value
}

let focusedDoc: string | undefined
// Set while the document is replaced to reflect a new model value, so the change is not emitted back.
let syncing = false

function onUpdate(update: ViewUpdate) {
  if (!update.docChanged || syncing) {
    return
  }

  if (!props.modelModifiers?.lazy) {
    updateModel(update.state.doc.toString())
  }

  emitFormInput()
}

function onFocus(_event: FocusEvent, editor: EditorView) {
  focusedDoc = editor.state.doc.toString()
  emitFormFocus()
}

function onBlur(event: FocusEvent, editor: EditorView) {
  const doc = editor.state.doc.toString()

  if (props.modelModifiers?.lazy) {
    updateModel(doc)
  }

  if (doc !== focusedDoc) {
    emitFormChange()
    emits('change', event)
  }

  emitFormBlur()
  emits('blur', event)
}

function createState(doc: string): EditorState {
  return EditorState.create({
    doc,
    extensions: [
      compartments.editable.of(editableExtension()),
      compartments.lineNumbers.of(lineNumbersExtension()),
      compartments.lineWrapping.of(lineWrappingExtension()),
      compartments.indentation.of(indentationExtension()),
      compartments.placeholder.of(placeholderCompartmentExtension()),
      compartments.attributes.of(attributesExtension()),
      compartments.highlight.of([]),
      compartments.extensions.of(extensionsExtension()),
      highlightSpecialChars(),
      history(),
      dropCursor(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      bracketMatching(),
      closeBrackets(),
      search({ top: false, createPanel: createSearchPanel }),
      keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...searchKeymap, ...historyKeymap]),
      CodeMirrorView.updateListener.of(onUpdate),
      CodeMirrorView.domEventHandlers({ focus: onFocus, blur: onBlur })
    ]
  })
}

function reconfigure(compartment: Compartment, extension: Extension) {
  view.value?.dispatch({ effects: compartment.reconfigure(extension) })
}

function resolveLang(): string {
  return props.lang || 'text'
}

function resolveThemes(): CodeEditorThemes {
  return resolveCodeEditorThemes(props.theme ?? { light: 'material-theme-lighter', dark: 'material-theme-palenight' })
}

// Bumped once the server has prepared the highlighter, so the fallback re-tokenizes.
const highlighterReady = ref(0)

// Lines rendered before CodeMirror mounts (server and hydration), highlighted when a
// highlighter already knows the language and themes: the `highlighter` prop, or the
// shared one once it has been created.
const fallbackLines = computed<CodeEditorToken[][]>(() => {
  void highlighterReady.value

  const code = (modelValue.value ?? '').replace(/\r\n?/g, '\n')
  const lang = resolveLang()
  const themes = resolveThemes()
  const highlighter = props.highlighter ?? getResolvedCodeEditorHighlighter()

  if (highlighter && isCodeEditorHighlighterReady(highlighter, lang, themes)) {
    try {
      return tokenizeCodeEditorLines(highlighter, code, lang, themes)
    } catch {
      // Rendered as plain lines below
    }
  }

  return code.split('\n').map(line => line ? [{ content: line }] : [])
})

onServerPrefetch(async () => {
  try {
    const highlighter = props.highlighter ?? await getCodeEditorHighlighter()
    await prepareCodeEditorHighlighter(highlighter, resolveLang(), resolveThemes())
    highlighterReady.value++
  } catch (error) {
    console.warn(`[Nuxt UI] CodeEditor: unable to highlight \`${resolveLang()}\` code on the server.`, error)
  }
})

let highlightVersion = 0

async function loadHighlight() {
  const version = ++highlightVersion
  const lang = resolveLang()
  const themes = resolveThemes()

  let extension: Extension = []
  try {
    const highlighter = props.highlighter ?? await getCodeEditorHighlighter()
    await prepareCodeEditorHighlighter(highlighter, lang, themes)
    extension = shikiHighlight({ highlighter, lang, themes })
  } catch (error) {
    console.warn(`[Nuxt UI] CodeEditor: unable to highlight \`${lang}\` code.`, error)
  }

  if (version === highlightVersion) {
    reconfigure(compartments.highlight, extension)
  }
}

// Search panel: CodeMirror provides the panel element, the controls are teleported into it.
const searchPanel = shallowRef<HTMLElement>()
const searchInputRef = useTemplateRef<{ inputRef: HTMLInputElement | null }>('searchInputRef')
const replaceInputRef = useTemplateRef<{ inputRef: HTMLInputElement | null }>('replaceInputRef')
const query = reactive({ search: '', replace: '', caseSensitive: false, regexp: false, wholeWord: false })

function syncQuery(searchQuery: SearchQuery) {
  Object.assign(query, {
    search: searchQuery.search,
    replace: searchQuery.replace,
    caseSensitive: searchQuery.caseSensitive,
    regexp: searchQuery.regexp,
    wholeWord: searchQuery.wholeWord
  })
}

function createSearchPanel(editor: EditorView): Panel {
  const dom = document.createElement('div')
  dom.className = ui.value.search({ class: props.ui?.search })
  dom.addEventListener('keydown', onSearchKeydown)
  syncQuery(getSearchQuery(editor.state))
  searchPanel.value = dom

  return {
    dom,
    top: false,
    mount() {
      nextTick(() => {
        searchInputRef.value?.inputRef?.focus()
        searchInputRef.value?.inputRef?.select()
      })
    },
    update(update) {
      for (const transaction of update.transactions) {
        for (const effect of transaction.effects) {
          if (effect.is(setSearchQuery)) {
            syncQuery(effect.value)
          }
        }
      }
    },
    destroy() {
      searchPanel.value = undefined
    }
  }
}

watch(query, () => {
  view.value?.dispatch({ effects: setSearchQuery.of(new SearchQuery({ ...query })) })
})

function onSearchKeydown(event: KeyboardEvent) {
  if (!view.value) {
    return
  }

  if (runScopeHandlers(view.value, event, 'search-panel')) {
    event.preventDefault()
  } else if (event.key === 'Enter' && event.target === searchInputRef.value?.inputRef) {
    event.preventDefault()
    ;(event.shiftKey ? findPrevious : findNext)(view.value)
  } else if (event.key === 'Enter' && event.target === replaceInputRef.value?.inputRef) {
    event.preventDefault()
    replaceNext(view.value)
  }
}

function runCommand(command: (editor: EditorView) => boolean) {
  if (view.value) {
    command(view.value)
  }
}

let autofocusTimeoutId: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  view.value = new CodeMirrorView({
    state: createState(modelValue.value ?? ''),
    parent: editorRef.value!
  })

  loadHighlight()

  if (props.autofocus) {
    autofocusTimeoutId = setTimeout(() => view.value?.focus(), props.autofocusDelay)
  }
})

onBeforeUnmount(() => {
  clearTimeout(autofocusTimeoutId)
  view.value?.destroy()
  view.value = undefined
})

watch(modelValue, (value) => {
  if (!view.value) {
    return
  }

  const current = view.value.state.doc.toString()
  const next = value ?? ''
  const same = props.modelModifiers?.trim ? current.trim() === next : current === next
  if (!same) {
    syncing = true
    try {
      view.value.dispatch({ changes: { from: 0, to: current.length, insert: next } })
    } finally {
      syncing = false
    }
  }
})

watch(readonly, () => reconfigure(compartments.editable, editableExtension()))
watch(() => props.lineNumbers, () => reconfigure(compartments.lineNumbers, lineNumbersExtension()))
watch(() => props.lineWrapping, () => reconfigure(compartments.lineWrapping, lineWrappingExtension()))
watch([() => props.tabSize, () => props.indentWithTab], () => reconfigure(compartments.indentation, indentationExtension()))
watch(() => props.placeholder, () => reconfigure(compartments.placeholder, placeholderCompartmentExtension()))
watch([ui, id, ariaAttrs, () => props.required], () => reconfigure(compartments.attributes, attributesExtension()))
watch(() => props.extensions, () => reconfigure(compartments.extensions, extensionsExtension()))
watch([() => props.lang, () => props.theme, () => props.highlighter], loadHighlight, { deep: true })

defineExpose({
  editorRef,
  view
})
</script>

<template>
  <Primitive :as="props.as" :data-slot="($attrs['data-slot'] as string | undefined) ?? 'root'" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div ref="editorRef" data-slot="base" :class="ui.base({ class: props.ui?.base })" :style="rowsStyle">
      <!-- Static replica of the editor, rendered on the server and until CodeMirror mounts -->
      <div v-if="!view" data-slot="fallback" class="cm-editor" :class="ui.fallback({ class: props.ui?.fallback })">
        <div class="cm-scroller">
          <div v-if="props.lineNumbers" class="cm-gutters cm-gutters-before" aria-hidden="true">
            <div class="cm-gutter cm-lineNumbers">
              <div v-for="line in fallbackLines.length" :key="line" class="cm-gutterElement">
                {{ line }}
              </div>
            </div>
          </div>
          <div
            :id="id"
            class="cm-content"
            :class="{ 'cm-lineWrapping': props.lineWrapping }"
            role="textbox"
            aria-multiline="true"
            :aria-readonly="readonly || undefined"
            :aria-required="props.required || undefined"
            :aria-disabled="disabled || undefined"
            v-bind="{ ...omit($attrs, ['data-slot', 'style']), ...ariaAttrs }"
            data-allow-mismatch="children"
          >
            <div v-for="(line, index) in fallbackLines" :key="index" class="cm-line">
              <span v-if="!index && !modelValue && props.placeholder" class="cm-placeholder" aria-hidden="true">{{ props.placeholder }}</span><template v-for="(token, position) in line" :key="position">
                <span v-if="token.style" class="cm-shiki" :style="token.style">{{ token.content }}</span><template v-else>
                  {{ token.content }}
                </template>
              </template><br v-if="!line.length">
            </div>
          </div>
        </div>
      </div>
      <input v-if="name" type="hidden" :name="name" :value="modelValue ?? ''">
    </div>

    <slot :ui="ui" />

    <Teleport v-if="searchPanel" :to="searchPanel">
      <UInput
        ref="searchInputRef"
        v-model="query.search"
        main-field
        :placeholder="t('codeEditor.search')"
        :aria-label="t('codeEditor.search')"
        :size="((props.ui?.searchControlSize || ui.searchControlSize()) as any)"
        color="neutral"
        data-slot="searchInput"
        :class="ui.searchInput({ class: props.ui?.searchInput })"
        :ui="{ trailing: 'pe-0' }"
      >
        <template #trailing>
          <div :class="ui.searchToggles({ class: props.ui?.searchToggles })">
            <UButton
              :icon="appConfig.ui.icons.caseSensitive"
              :aria-label="t('codeEditor.matchCase')"
              :title="t('codeEditor.matchCase')"
              :aria-pressed="query.caseSensitive"
              :active="query.caseSensitive"
              color="neutral"
              variant="ghost"
              active-color="primary"
              active-variant="subtle"
              size="xs"
              square
              @click="query.caseSensitive = !query.caseSensitive"
            />
            <UButton
              :icon="appConfig.ui.icons.regex"
              :aria-label="t('codeEditor.regexp')"
              :title="t('codeEditor.regexp')"
              :aria-pressed="query.regexp"
              :active="query.regexp"
              color="neutral"
              variant="ghost"
              active-color="primary"
              active-variant="subtle"
              size="xs"
              square
              @click="query.regexp = !query.regexp"
            />
            <UButton
              :icon="appConfig.ui.icons.wholeWord"
              :aria-label="t('codeEditor.wholeWord')"
              :title="t('codeEditor.wholeWord')"
              :aria-pressed="query.wholeWord"
              :active="query.wholeWord"
              color="neutral"
              variant="ghost"
              active-color="primary"
              active-variant="subtle"
              size="xs"
              square
              @click="query.wholeWord = !query.wholeWord"
            />
          </div>
        </template>
      </UInput>

      <UFieldGroup :size="((props.ui?.searchControlSize || ui.searchControlSize()) as any)">
        <UButton
          :icon="appConfig.ui.icons.chevronUp"
          :aria-label="t('codeEditor.prev')"
          :title="t('codeEditor.prev')"
          color="neutral"
          variant="outline"
          @click="runCommand(findPrevious)"
        />
        <UButton
          :icon="appConfig.ui.icons.chevronDown"
          :aria-label="t('codeEditor.next')"
          :title="t('codeEditor.next')"
          color="neutral"
          variant="outline"
          @click="runCommand(findNext)"
        />
      </UFieldGroup>

      <UButton
        :label="t('codeEditor.selectAll')"
        :size="((props.ui?.searchControlSize || ui.searchControlSize()) as any)"
        color="neutral"
        variant="outline"
        @click="runCommand(selectMatches)"
      />

      <template v-if="!readonly">
        <UInput
          ref="replaceInputRef"
          v-model="query.replace"
          :placeholder="t('codeEditor.replace')"
          :aria-label="t('codeEditor.replace')"
          :size="((props.ui?.searchControlSize || ui.searchControlSize()) as any)"
          color="neutral"
          data-slot="replaceInput"
          :class="ui.searchInput({ class: props.ui?.searchInput })"
        />

        <UFieldGroup :size="((props.ui?.searchControlSize || ui.searchControlSize()) as any)">
          <UButton
            :icon="appConfig.ui.icons.replace"
            :label="t('codeEditor.replaceNext')"
            color="neutral"
            variant="outline"
            @click="runCommand(replaceNext)"
          />
          <UButton
            :icon="appConfig.ui.icons.replaceAll"
            :label="t('codeEditor.replaceAll')"
            color="neutral"
            variant="outline"
            @click="runCommand(replaceAll)"
          />
        </UFieldGroup>
      </template>

      <UButton
        :icon="appConfig.ui.icons.close"
        :aria-label="t('codeEditor.close')"
        :title="t('codeEditor.close')"
        :size="((props.ui?.searchControlSize || ui.searchControlSize()) as any)"
        color="neutral"
        variant="ghost"
        square
        class="ms-auto"
        @click="runCommand(closeSearchPanel)"
      />
    </Teleport>
  </Primitive>
</template>
