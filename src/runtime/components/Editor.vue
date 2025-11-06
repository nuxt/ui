<script lang="ts">
import type { Content, EditorOptions } from '@tiptap/core'
import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import type { StarterKitOptions } from '@tiptap/starter-kit'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/editor'
import type { ComponentConfig } from '../types/tv'

type Editor = ComponentConfig<typeof theme, AppConfig, 'editor'>

export type EditorFormat = 'json' | 'html' | 'text'
export type EditorContent = Content

export interface EditorProps<T extends EditorFormat = EditorFormat> extends Omit<Partial<EditorOptions>, 'content'> {
  /**
   * The starter kit options to configure the editor.
   * @defaultValue `{ headings: { levels: [1, 2, 3, 4] } }`
   */
  starterKit?: Partial<StarterKitOptions>
  /**
   * The format for the content output
   * - 'json': Returns ProseMirror JSON document
   * - 'html': Returns HTML string
   * - 'text': Returns plain text string
   * If not specified, auto-detects from the initial content type
   * @defaultValue undefined (auto-detect)
   */
  format?: T
  class?: any
  ui?: Editor['ui']
}

export interface EditorSlots {
  default(props: { editor: TiptapEditor }): any
}
</script>

<script setup lang="ts" generic="T extends EditorFormat">
import { computed, ref } from 'vue'
import { defu } from 'defu'
import { useForwardProps } from 'reka-ui'
import { reactiveOmit } from '@vueuse/core'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = defineProps<EditorProps>()
defineSlots<EditorSlots>()

const content = defineModel<Content>({ default: '' })

const appConfig = useAppConfig() as Editor['AppConfig']

const editorProps = useForwardProps(reactiveOmit(props, 'starterKit', 'extensions', 'class', 'format'))

const detectedFormat = ref<EditorFormat>(props.format || (typeof content.value === 'string' ? 'html' : 'json'))

const editor = useEditor({
  ...editorProps.value,
  content: content.value,
  extensions: [
    StarterKit.configure(defu(props.starterKit, {
      headings: {
        levels: [1, 2, 3, 4, 5, 6]
      }
    })),
    ...(props.extensions || [])
  ],
  onUpdate: ({ editor }) => {
    const format = props.format || detectedFormat.value

    if (format === 'html') {
      content.value = editor.getHTML()
    } else if (format === 'text') {
      content.value = editor.getText()
    } else {
      content.value = editor.getJSON()
    }
  }
})

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.editor || {}) })())

defineExpose({
  editor
})
</script>

<template>
  <div :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot v-if="editor" :editor="editor" />

    <EditorContent role="presentation" :editor="editor" :class="ui.base({ class: props.ui?.base })" />
  </div>
</template>
