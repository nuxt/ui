<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { Content, EditorOptions } from '@tiptap/core'
import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import type { StarterKitOptions } from '@tiptap/starter-kit'
import type { PlaceholderOptions } from '@tiptap/extension-placeholder'
import theme from '#build/ui/editor'
import type { ComponentConfig } from '../types/tv'

type Editor = ComponentConfig<typeof theme, AppConfig, 'editor'>

export type { Editor } from '@tiptap/vue-3'

export type EditorContent = Content
export type EditorContentType = 'json' | 'html' | 'markdown'

export interface EditorProps extends Omit<Partial<EditorOptions>, 'content'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The starter kit options to configure the editor.
   * @defaultValue { headings: { levels: [1, 2, 3, 4] }, link: { openOnClick: false }, dropcursor: { color: 'var(--ui-primary)', width: 2 } }
   */
  starterKit?: Partial<StarterKitOptions>
  /**
   * The content type the content is provided as.
   * @defaultValue 'json'
   */
  contentType?: EditorContentType
  /**
   * The placeholder text to show in empty paragraphs.
   * Can be a string or PlaceholderOptions from @tiptap/extension-placeholder.
   * @defaultValue { showOnlyWhenEditable: false, showOnlyCurrent: true }
   */
  placeholder?: string | PlaceholderOptions
  class?: any
  ui?: Editor['slots']
}

export interface EditorSlots {
  default(props: { editor: TiptapEditor }): any
}
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { defu } from 'defu'
import { Primitive, useForwardProps } from 'reka-ui'
import { mergeAttributes } from '@tiptap/core'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Placeholder from '@tiptap/extension-placeholder'
import Mention from '@tiptap/extension-mention'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { Markdown } from '@tiptap/markdown'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { reactiveOmit } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<EditorProps>(), {
  contentType: 'json'
})
defineSlots<EditorSlots>()

const attrs = useAttrs()

const content = defineModel<Content>({ default: '' })

const appConfig = useAppConfig() as Editor['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.editor || {}) })())

const rootProps = useForwardProps(reactiveOmit(props, 'starterKit', 'extensions', 'editorProps', 'contentType', 'class', 'placeholder'))
const editorProps = computed(() => defu(props.editorProps, {
  attributes: {
    autocomplete: 'off',
    autocorrect: 'off',
    autocapitalize: 'off',
    ...attrs,
    class: ui.value.base({ class: [props.ui?.base, props.class] })
  }
} as EditorOptions['editorProps']))
const contentType = computed(() => props.contentType || (typeof content.value === 'string' ? 'html' : 'json'))
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
    },
    renderText({ node }) {
      return `@${node.attrs.id ?? node.attrs.label}`
    }
  }),
  ...(props.extensions || [])
].filter(extension => !!extension))

const editor = useEditor({
  ...rootProps.value,
  content: content.value,
  contentType: contentType.value,
  extensions: extensions.value,
  editorProps: editorProps.value,
  onUpdate: ({ editor }) => {
    try {
      if (contentType.value === 'html') {
        content.value = editor.getHTML()
      } else if (contentType.value === 'json') {
        content.value = editor.getJSON()
      } else if (contentType.value === 'markdown') {
        content.value = editor.getMarkdown()
      }
    } catch (error) {
      content.value = editor.getText()
    }
  }
})

defineExpose({
  editor
})
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <template v-if="editor">
      <slot :editor="editor" />
    </template>

    <EditorContent role="presentation" :editor="editor" :class="ui.content({ class: props.ui?.content })" />
  </Primitive>
</template>
