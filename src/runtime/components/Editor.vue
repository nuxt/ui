<script lang="ts">
import type { ShallowRef, VNode } from 'vue'
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

export interface EditorProps<T extends Content = Content, H extends EditorCustomHandlers = EditorCustomHandlers> extends Omit<Partial<EditorOptions>, 'content' | 'element' | 'editorProps'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * Provide an externally created TipTap editor instance to use instead of the built-in one.
   * When set, the component acts as a shell: it renders, styles and wires the editor to child
   * components (toolbar, menus, …), but does not manage extensions nor `v-model`. The external
   * editor owns its content, schema and lifecycle, so the engine props (`starterKit`, `image`,
   * `mention`, `placeholder`, `markdown`, `contentType`, `modelValue`, `extensions`) are ignored.
   * @see https://tiptap.dev/docs/editor/getting-started/install/vue3
   */
  editor?: TiptapEditor | ShallowRef<TiptapEditor | undefined>
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
   * The TipTap [`editorProps`](https://tiptap.dev/docs/editor/api/editor#editorprops) (e.g. `attributes`, `handleDOMEvents`).
   * When using an external `editor`, set to `false` to opt out of Nuxt UI automatically injecting
   * its `editorProps` (including the theme's base classes) into your editor instance.
   */
  editorProps?: EditorOptions['editorProps'] | false
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
   * Rendered while an external `editor` is not yet available (e.g. created asynchronously).
   * Never rendered in the built-in mode, where the editor is ready synchronously.
   */
  fallback?(props: Record<string, never>): VNode[]
}
</script>

<script setup lang="ts" generic="T extends Content, H extends EditorCustomHandlers">
import { computed, provide, unref, useAttrs, watch, watchEffect } from 'vue'
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

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.editor || {}) })({
  placeholderMode: typeof props.placeholder === 'object' ? props.placeholder.mode : undefined
}))

const rootProps = useForwardProps(reactiveOmit(props, 'editor', 'starterKit', 'extensions', 'editorProps', 'contentType', 'class', 'placeholder', 'markdown', 'image', 'mention', 'handlers'))

function baseEditorProps(originalClass?: unknown) {
  return {
    attributes: {
      autocomplete: 'off',
      autocorrect: 'off',
      autocapitalize: 'off',
      ...attrs,
      class: ui.value.base({ class: [originalClass, props.ui?.base] })
    }
  } as EditorOptions['editorProps']
}
// eslint-disable-next-line vue/no-dupe-keys
const editorProps = computed(() => defu(props.editorProps === false ? undefined : props.editorProps, baseEditorProps()))
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

/**
 * Detect external-editor mode from the *presence* of the `editor` prop (not its
 * value), so the component behaves consistently even when the external editor is
 * created asynchronously and starts out `undefined`.
 */
const isExternalEditor = isPropBound('editor')
const externalEditor = computed(() => unref(props.editor) as TiptapEditor | undefined)

if (import.meta.dev && isExternalEditor) {
  const inertProps = (['modelValue', 'contentType', 'starterKit', 'image', 'mention', 'placeholder', 'markdown', 'extensions'] as const)
    .filter(name => isPropBound(name))
  if (inertProps.length) {
    console.warn(`[@nuxt/ui] <UEditor> ignores [${inertProps.join(', ')}] when the \`editor\` prop is provided; the external editor owns its content, schema and lifecycle.`)
  }
}

/**
 * Built-in mode owns the editor instance and its `v-model` sync. External mode
 * skips all of it — no `useEditor` (so no auto-destroy of an editor we don't own).
 */
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

/**
 * In external mode, inject the component's `editorProps` (including the theme's
 * base classes) into the user-owned editor so it inherits Nuxt UI's styling,
 * unless the consumer opted out with `:editor-props="false"`.
 *
 * Two writers touch `editorProps` here: this component and the editor's owner.
 * To coexist, we capture each editor's *pristine* `editorProps` once (WeakMap)
 * and always merge our injection on top of that snapshot — never on top of a
 * previous injection. That keeps re-runs idempotent and avoids reverting
 * `editorProps` the owner sets after creation.
 */
if (isExternalEditor) {
  const originalProps = new WeakMap<TiptapEditor, EditorOptions['editorProps']>()

  watchEffect(() => {
    const instance = externalEditor.value
    if (!instance || props.editorProps === false) {
      return
    }

    if (!originalProps.has(instance)) {
      originalProps.set(instance, instance.options.editorProps)
    }
    const original = originalProps.get(instance)

    instance.setOptions({
      editorProps: defu(
        typeof props.editorProps === 'object' ? props.editorProps : undefined,
        baseEditorProps((original as { attributes?: { class?: unknown } } | undefined)?.attributes?.class),
        original || {}
      ) as EditorOptions['editorProps']
    })
  })
}

watch(() => props.modelValue, (newVal) => {
  // The external editor owns its content, so `v-model` is inert in that mode.
  if (isExternalEditor || !editor.value || newVal == null) {
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
      />
    </template>

    <slot v-else name="fallback" />
  </Primitive>
</template>
