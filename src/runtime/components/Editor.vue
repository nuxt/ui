<script lang="ts">
import type { ComputedRef, MaybeRef, VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { Editor as TiptapEditor, EditorOptions, Content } from '@tiptap/vue-3'
import type { StarterKitOptions } from '@tiptap/starter-kit'
import type { PlaceholderOptions } from '@tiptap/extension-placeholder'
import type { MarkdownExtensionOptions } from '@tiptap/markdown'
import type { ImageOptions } from '@tiptap/extension-image'
import type { MentionOptions } from '@tiptap/extension-mention'
import theme from '#build/ui/editor'
import type { EditorHandlers, EditorCustomHandlers } from '../types/editor'
import type { ComponentConfig } from '../types/tv'

type Editor = ComponentConfig<typeof theme, AppConfig, 'editor'>

export type EditorContentType = 'json' | 'html' | 'markdown'

export interface EditorProps<T extends Content = Content, H extends EditorCustomHandlers = EditorCustomHandlers> extends Omit<Partial<EditorOptions>, 'content' | 'element'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * An external TipTap editor instance to use instead of the built-in one.
   * The component renders and styles it and wires it to the child components (toolbar, menus, …),
   * while the instance keeps ownership of its content, schema and lifecycle: `v-model` and the
   * TipTap options props (`starterKit`, `extensions`, `editorProps`, …) are ignored.
   * Bind the prop from the first render (even while still `undefined`, e.g. an editor created
   * asynchronously) — it is detected by presence, not value.
   * @see https://tiptap.dev/docs/editor/getting-started/install/vue3
   */
  editor?: MaybeRef<TiptapEditor | undefined> | ComputedRef<TiptapEditor | undefined>
  modelValue?: T
  /**
   * The content type the content is provided as.
   * When not specified, it's automatically inferred: strings are treated as 'html', objects as 'json'.
   */
  contentType?: EditorContentType
  /**
   * The starter kit options to configure the editor.
   * @defaultValue { horizontalRule: false, link: { openOnClick: false }, dropcursor: { color: 'var(--ui-primary)', width: 2 } }
   * @see https://tiptap.dev/docs/editor/extensions/functionality/starterkit
   */
  starterKit?: Partial<StarterKitOptions>
  /**
   * The placeholder text to show in empty paragraphs. Can be a string or PlaceholderOptions from `@tiptap/extension-placeholder`.
   * @defaultValue { showOnlyWhenEditable: false, showOnlyCurrent: true, mode: 'everyLine' }
   * @see https://tiptap.dev/docs/editor/extensions/functionality/placeholder
   */
  placeholder?: string | (Partial<PlaceholderOptions> & {
    /**
     * Control how placeholders are displayed in the editor.
     * - `firstLine`: Display placeholder only on the first line when the editor is empty.
     * - `everyLine`: Display placeholder on every empty line when focused.
     * @defaultValue 'everyLine'
     */
    mode?: 'firstLine' | 'everyLine'
  })
  /**
   * The markdown extension options to configure markdown parsing and serialization.
   * @defaultValue { markedOptions: { gfm: true } }
   * @see https://tiptap.dev/docs/editor/extensions/functionality/markdown
   */
  markdown?: Partial<MarkdownExtensionOptions>
  /**
   * The image extension options to configure image handling. Set to `false` to disable the extension.
   * @defaultValue {}
   * @see https://tiptap.dev/docs/editor/extensions/nodes/image
   */
  image?: boolean | Partial<ImageOptions>
  /**
   * The mention extension options to configure mention handling. Set to `false` to disable the extension.
   * The `suggestion` and `suggestions` options are omitted as they are managed by the `EditorMentionMenu` component.
   * @defaultValue { HTMLAttributes: { class: 'mention' } }
   * @see https://tiptap.dev/docs/editor/extensions/nodes/mention
   */
  mention?: boolean | Partial<Omit<MentionOptions, 'suggestion' | 'suggestions'>>
  /**
   * Apply the theme's typography to the editor content wrapper, so external editors are styled too.
   * Uses `:where()` selectors, so your own (or an extension's) styling always takes precedence.
   * Set to `false` when the editor brings its own content styling.
   * The built-in editor is always styled through the `base` slot (override `ui.base` to change it).
   * @defaultValue true
   */
  prose?: boolean
  /**
   * Custom item handlers to override or extend the default handlers.
   * These handlers are provided to all child components (toolbar, suggestion menu, etc.).
   */
  handlers?: H
  class?: any
  ui?: Editor['slots']
}

export interface EditorEmits<T extends Content = Content> {
  'update:modelValue': [value: T]
}

export interface EditorSlots<H extends EditorCustomHandlers = EditorCustomHandlers> {
  default?(props: { editor: TiptapEditor, handlers: EditorHandlers<H>, ui: Editor['ui'] }): VNode[]
  /**
   * Rendered while the editor is not yet available: during SSR and before mount,
   * or while an asynchronously created external `editor` is still `undefined`.
   */
  fallback?(props: Record<string, never>): VNode[]
}
</script>

<script setup lang="ts" generic="T extends Content, H extends EditorCustomHandlers">
import { computed, provide, unref, useAttrs, watch } from 'vue'
import { defu } from 'defu'
import { Primitive } from 'reka-ui'
import { mergeAttributes } from '@tiptap/core'
import Code from '@tiptap/extension-code'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Image from '@tiptap/extension-image'
import Mention from '@tiptap/extension-mention'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from '@tiptap/markdown'
import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { reactiveOmit } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { isPropBound, useComponentProps } from '../composables/useComponentProps'
import { useForwardProps } from '../composables/useForwardProps'
import { createHandlers } from '../utils/editor'
import { tv } from '../utils/tv'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<EditorProps<T, H>>(), {
  image: true,
  mention: true
})
const emits = defineEmits<EditorEmits<T>>()

defineSlots<EditorSlots<H>>()

const props = useComponentProps<EditorProps<T, H>>('editor', _props)

const attrs = useAttrs()

const appConfig = useAppConfig() as Editor['AppConfig']

// External mode is detected from the presence of the `editor` prop, not its value,
// so an editor created asynchronously (`undefined` on first render) is still recognized.
const isExternalEditor = isPropBound('editor')

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.editor || {}) })({
  // Built-in editors are styled via `editorProps` on the editable element; only external editors
  // need the content-wrapper copy, so the variant is disabled otherwise.
  prose: isExternalEditor ? props.prose : false,
  placeholderMode: typeof props.placeholder === 'object' ? props.placeholder.mode : undefined
}))

const rootProps = useForwardProps(reactiveOmit(props, 'editor', 'starterKit', 'extensions', 'editorProps', 'contentType', 'class', 'placeholder', 'markdown', 'image', 'mention', 'prose', 'handlers'))

const editorProps = computed(() => defu(props.editorProps, {
  attributes: {
    autocomplete: 'off',
    autocorrect: 'off',
    autocapitalize: 'off',
    ...attrs,
    class: ui.value.base({ class: props.ui?.base })
  }
} as EditorOptions['editorProps']))
// eslint-disable-next-line vue/no-dupe-keys
const contentType = computed(() => props.contentType || (typeof props.modelValue === 'string' ? 'html' : 'json'))
// eslint-disable-next-line vue/no-dupe-keys
const starterKit = computed(() => defu(props.starterKit, {
  code: false,
  horizontalRule: false,
  dropcursor: {
    color: 'var(--ui-primary)',
    width: 2
  },
  link: {
    openOnClick: false
  }
} as Partial<StarterKitOptions>))
// eslint-disable-next-line vue/no-dupe-keys
const placeholder = computed(() => {
  const options = typeof props.placeholder === 'string' ? { placeholder: props.placeholder } : props.placeholder
  const { mode, ...rest } = options || {}

  return defu(rest, {
    showOnlyWhenEditable: false,
    showOnlyCurrent: true
  } as Partial<PlaceholderOptions>)
})
// eslint-disable-next-line vue/no-dupe-keys
const markdown = computed(() => defu(props.markdown, {
  markedOptions: {
    gfm: true
  }
} as Partial<MarkdownExtensionOptions>))
// eslint-disable-next-line vue/no-dupe-keys
const image = computed(() => typeof props.image === 'boolean' ? {} : props.image)
// eslint-disable-next-line vue/no-dupe-keys
const mention = computed(() => defu(typeof props.mention === 'boolean' ? {} : props.mention, {
  HTMLAttributes: {
    class: 'mention'
  },
  renderText({ node }: { node: any }) {
    return `${node.attrs.mentionSuggestionChar ?? '@'}${node.attrs.label ?? node.attrs.id}`
  },
  renderHTML({ options, node }: { options: any, node: any }) {
    return [
      'span',
      mergeAttributes({ 'data-type': 'mention' }, options.HTMLAttributes),
      `${node.attrs.mentionSuggestionChar ?? '@'}${node.attrs.label ?? node.attrs.id}`
    ]
  }
} as Partial<MentionOptions>))

const extensions = computed(() => [
  contentType.value === 'markdown' && Markdown.configure(markdown.value),
  StarterKit.configure(starterKit.value),
  Code.extend({
    excludes: 'code'
  }),
  HorizontalRule.extend({
    renderHTML() {
      return [
        'div',
        mergeAttributes(this.options.HTMLAttributes, { 'data-type': this.name }),
        ['hr']
      ]
    }
  }),
  props.image !== false && Image.configure(image.value),
  props.mention !== false && Mention.configure(mention.value),
  props.placeholder && Placeholder.configure(placeholder.value),
  ...(props.extensions || [])
].filter(extension => !!extension))

const externalEditor = computed(() => unref(props.editor) as TiptapEditor | undefined)

if (import.meta.dev) {
  if (isExternalEditor) {
    // Every prop not listed here only configures the built-in editor.
    const shellProps = ['editor', 'as', 'class', 'ui', 'handlers', 'prose']
    const inertProps = Object.keys(_props).filter(name => !shellProps.includes(name) && isPropBound(name))
    if (inertProps.length) {
      console.warn(`[@nuxt/ui] <UEditor> ignores [${inertProps.join(', ')}] when the \`editor\` prop is provided; the external editor owns its content, schema and lifecycle.`)
    }
  } else {
    // The mode is fixed at setup, so an `editor` bound after the first render is inert.
    const stop = watch(() => unref(props.editor), (value) => {
      if (value) {
        console.warn('[@nuxt/ui] <UEditor> received an `editor` after its first render and will keep using the built-in editor; bind the `editor` prop from the start (even while `undefined`) to use an external editor.')
        stop()
      }
    })
  }
}

// No `useEditor` in external mode: it creates its own instance and destroys it on unmount.
const internalEditor = isExternalEditor
  ? undefined
  : useEditor({
      ...rootProps.value,
      content: props.modelValue,
      contentType: contentType.value,
      extensions: extensions.value,
      editorProps: editorProps.value,
      onCreate: ({ editor }) => {
        // Force placeholder decorations to render immediately without needing focus
        if (props.placeholder) {
          editor.view.dispatch(editor.state.tr)
        }
      },
      onUpdate: ({ editor }) => {
        let value
        try {
          if (contentType.value === 'html') {
            value = editor.getHTML()
          } else if (contentType.value === 'json') {
            value = editor.getJSON()
          } else if (contentType.value === 'markdown') {
            value = editor.getMarkdown()
          }
        } catch (error) {
          value = editor.getText()
        }

        emits('update:modelValue', value as T)
      }
    })

// eslint-disable-next-line vue/no-dupe-keys
const editor = computed(() => isExternalEditor ? externalEditor.value : internalEditor?.value)

// `v-model` only syncs the built-in editor; an external editor owns its content.
if (!isExternalEditor) {
  watch(() => props.modelValue, (newVal) => {
    if (!editor.value || newVal == null) {
      return
    }

    const currentContent = contentType.value === 'html'
      ? editor.value.getHTML()
      : contentType.value === 'json'
        ? JSON.stringify(editor.value.getJSON())
        : contentType.value === 'markdown'
          ? editor.value.getMarkdown()
          : editor.value.getText()

    const newContent = contentType.value === 'json' && typeof newVal === 'object'
      ? JSON.stringify(newVal)
      : String(newVal)

    if (currentContent !== newContent) {
      // Store current cursor position
      const currentSelection = editor.value.state.selection
      const currentPos = currentSelection.from

      // Set the new content
      editor.value.commands.setContent(newVal, { contentType: contentType.value })

      // Restore cursor position if the position is still valid in the new content
      const newDoc = editor.value.state.doc
      if (currentPos <= newDoc.content.size) {
        editor.value.commands.setTextSelection(currentPos)
      }
    }
  })
}

// eslint-disable-next-line vue/no-dupe-keys
const handlers = computed(() => ({
  ...createHandlers(),
  ...props.handlers
}) as EditorHandlers<H>)

provide('editorHandlers', handlers)

defineExpose({
  editor
})
</script>

<template>
  <Primitive :as="props.as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <template v-if="editor">
      <slot :editor="editor" :handlers="handlers" :ui="ui" />

      <EditorContent
        role="presentation"
        :editor="editor"
        data-slot="content"
        :class="ui.content({ class: props.ui?.content })"
        v-bind="isExternalEditor ? $attrs : undefined"
      />
    </template>

    <slot v-else name="fallback" />
  </Primitive>
</template>
