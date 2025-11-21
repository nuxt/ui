<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { Content, EditorOptions } from '@tiptap/core'
import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import type { StarterKitOptions } from '@tiptap/starter-kit'
import type { PlaceholderOptions } from '@tiptap/extension-placeholder'
import theme from '#build/ui/editor'
import type { EditorHandlers } from '../types/editor'
import type { ComponentConfig } from '../types/tv'

type Editor = ComponentConfig<typeof theme, AppConfig, 'editor'>

export type EditorContent = Content
export type EditorContentType = 'json' | 'html' | 'markdown'

export interface EditorProps<T extends Content = Content> extends Omit<Partial<EditorOptions>, 'content' | 'element'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  modelValue?: T
  /**
   * The content type the content is provided as.
   * @defaultValue 'json'
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
  placeholder?: string | PlaceholderOptions
  /**
   * Custom item handlers to override or extend the default handlers.
   * These handlers are provided to all child components (toolbar, suggestion menu, etc.).
   */
  handlers?: Partial<EditorHandlers>
  class?: any
  ui?: Editor['slots']
}

export interface EditorEmits<T extends Content = Content> {
  'update:modelValue': [value: T]
}

export interface EditorSlots {
  default(props: { editor: TiptapEditor, handlers: EditorHandlers }): any
}
</script>

<script setup lang="ts" generic="T extends Content">
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

const props = withDefaults(defineProps<EditorProps<T>>(), {
  contentType: 'json'
})
const emits = defineEmits<EditorEmits<T>>()
defineSlots<EditorSlots>()

const attrs = useAttrs()

const appConfig = useAppConfig() as Editor['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.editor || {}) })())

const rootProps = useForwardProps(reactiveOmit(props, 'starterKit', 'extensions', 'editorProps', 'contentType', 'class', 'placeholder', 'handlers'))

const editorProps = computed(() => defu(props.editorProps, {
  attributes: {
    autocomplete: 'off',
    autocorrect: 'off',
    autocapitalize: 'off',
    ...attrs,
    class: ui.value.base({ class: [props.ui?.base, props.class] })
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

const extensions = computed(() => [
  contentType.value === 'markdown' && Markdown,
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
  Image,
  props.placeholder && Placeholder.configure(defu(
    typeof props.placeholder === 'string' ? { placeholder: props.placeholder } : props.placeholder,
    { showOnlyWhenEditable: false, showOnlyCurrent: true } as PlaceholderOptions
  )),
  Mention.configure({
    HTMLAttributes: {
      class: 'mention'
    }
  }),
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
  if (!editor.value || !newVal) {
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
    editor.value.commands.setContent(newVal)
  }
})

const handlers = computed<EditorHandlers>(() => ({
  ...createHandlers(),
  ...props.handlers
}))

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
