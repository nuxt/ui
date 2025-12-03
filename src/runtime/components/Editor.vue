<script lang="ts">
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
  modelValue?: T
  /**
   * The content type the content is provided as.
   * When not specified, it's automatically inferred: strings are treated as 'html', objects as 'json'.
   */
  contentType?: EditorContentType
  /**
   * The starter kit options to configure the editor.
   * @defaultValue { headings: { levels: [1, 2, 3, 4] }, link: { openOnClick: false }, dropcursor: { color: 'var(--ui-primary)', width: 2 } }
   * @see https://tiptap.dev/docs/editor/extensions/functionality/starterkit
   */
  starterKit?: Partial<StarterKitOptions>
  /**
   * The placeholder text to show in empty paragraphs.
   * `{ showOnlyWhenEditable: false, showOnlyCurrent: true }`{lang="ts-type"}
   * Can be a string or PlaceholderOptions from `@tiptap/extension-placeholder`.
   * @see https://tiptap.dev/docs/editor/extensions/functionality/placeholder
   */
  placeholder?: string | Partial<PlaceholderOptions>
  /**
   * The markdown extension options to configure markdown parsing and serialization.
   * @see https://tiptap.dev/docs/editor/extensions/functionality/markdown
   */
  markdown?: Partial<MarkdownExtensionOptions>
  /**
   * The image extension options to configure image handling.
   * @see https://tiptap.dev/docs/editor/extensions/nodes/image
   */
  image?: Partial<ImageOptions>
  /**
   * The mention extension options to configure mention handling.
   * @see https://tiptap.dev/docs/editor/extensions/nodes/mention
   */
  mention?: Partial<MentionOptions>
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
  default(props: { editor: TiptapEditor, handlers: EditorHandlers<H> }): any
}
</script>

<script setup lang="ts" generic="T extends Content, H extends EditorCustomHandlers">
import { computed, provide, useAttrs, watch } from 'vue'
import { defu } from 'defu'
import { Primitive, useForwardProps } from 'reka-ui'
import { mergeAttributes } from '@tiptap/core'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Image from '@tiptap/extension-image'
import Mention from '@tiptap/extension-mention'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from '@tiptap/markdown'
import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { reactiveOmit } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { createHandlers } from '../utils/editor'
import { tv } from '../utils/tv'

defineOptions({ inheritAttrs: false })

const props = defineProps<EditorProps<T, H>>()
const emits = defineEmits<EditorEmits<T>>()
defineSlots<EditorSlots<H>>()

const attrs = useAttrs()

const appConfig = useAppConfig() as Editor['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.editor || {}) })())

const rootProps = useForwardProps(reactiveOmit(props, 'starterKit', 'extensions', 'editorProps', 'contentType', 'class', 'placeholder', 'markdown', 'image', 'mention', 'handlers'))

const editorProps = computed(() => defu(props.editorProps, {
  attributes: {
    autocomplete: 'off',
    autocorrect: 'off',
    autocapitalize: 'off',
    ...attrs,
    class: ui.value.base({ class: props.ui?.base })
  }
} as EditorOptions['editorProps']))
const contentType = computed(() => props.contentType || (typeof props.modelValue === 'string' ? 'html' : 'json'))
const starterKit = computed(() => defu(props.starterKit, {
  horizontalRule: false,
  headings: {
    levels: [1, 2, 3, 4]
  },
  dropcursor: {
    color: 'var(--ui-primary)',
    width: 2
  },
  link: {
    openOnClick: false
  }
} as Partial<StarterKitOptions>))
const placeholder = computed(() => defu(typeof props.placeholder === 'string' ? { placeholder: props.placeholder } : props.placeholder, {
  showOnlyWhenEditable: false,
  showOnlyCurrent: true
} as Partial<PlaceholderOptions>))
const markdown = computed(() => defu(props.markdown, {
  markedOptions: {
    gfm: true
  }
} as Partial<MarkdownExtensionOptions>))
const image = computed(() => defu(props.image, {} as Partial<ImageOptions>))
const mention = computed(() => defu(props.mention, {
  HTMLAttributes: {
    class: 'mention'
  }
} as Partial<MentionOptions>))

const extensions = computed(() => [
  contentType.value === 'markdown' && Markdown.configure(markdown.value),
  StarterKit.configure(starterKit.value),
  HorizontalRule.extend({
    renderHTML() {
      return [
        'div',
        mergeAttributes(this.options.HTMLAttributes, { 'data-type': this.name }),
        ['hr']
      ]
    }
  }),
  Image.configure(image.value),
  props.placeholder && Placeholder.configure(placeholder.value),
  Mention.configure(mention.value),
  ...(props.extensions || [])
].filter(extension => !!extension))

const editor = useEditor({
  ...rootProps.value,
  content: props.modelValue,
  contentType: contentType.value,
  extensions: extensions.value,
  editorProps: editorProps.value,
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
    editor.value.commands.setContent(newVal)

    // Restore cursor position if the position is still valid in the new content
    const newDoc = editor.value.state.doc
    if (currentPos <= newDoc.content.size) {
      editor.value.commands.setTextSelection(currentPos)
    }
  }
})

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
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <template v-if="editor">
      <slot :editor="editor" :handlers="handlers" />

      <EditorContent
        role="presentation"
        :editor="editor"
        data-slot="content"
        :class="ui.content({ class: props.ui?.content })"
      />
    </template>
  </Primitive>
</template>
