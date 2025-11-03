<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/editor'
import type { ComponentConfig } from '../types/tv'
import * as prose from '#build/ui/prose'

type Editor = ComponentConfig<typeof theme, AppConfig, 'editor'>

export interface EditorProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  starterKit?: Partial<StarterKitOptions>
  class?: any
  ui?: Editor['slots']
}

export interface EditorSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit, { type StarterKitOptions } from '@tiptap/starter-kit'
import { defu } from 'defu'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = defineProps<EditorProps>()
defineSlots<EditorSlots>()

const content = defineModel<string>({ default: '' })

const appConfig = useAppConfig() as Editor['AppConfig']

const editor = useEditor({
  content: content.value,
  extensions: [StarterKit.configure(defu(props.starterKit, {
    heading: {
      levels: [2, 3, 4]
    },
    paragraph: {
      HTMLAttributes: {
        class: prose.p.base
      }
    },
    link: false,
    blockquote: {
      HTMLAttributes: {
        class: prose.blockquote.base
      }
    }
  })), ...props.extensions],
  onUpdate: ({ editor }) => {
    content.value = editor.getHTML()
  }
})

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.editor || {}) })())
</script>

<template>
  <EditorContent :editor="editor" :class="ui.root({ class: [props.ui?.root, props.class] })" />
</template>
