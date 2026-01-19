<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { EditorMenuOptions } from '../composables/useEditorMenu'
import type { ComponentConfig } from '../types/tv'
import theme from '#build/ui/editor-emoji-menu'

type EditorEmojiMenu = ComponentConfig<typeof theme, AppConfig, 'editorEmojiMenu'>

export interface EditorEmojiMenuItem {
  name: string
  emoji?: string
  shortcodes: string[]
  tags: string[]
  group?: string
  fallbackImage?: string
  [key: string]: any
}

export interface EditorEmojiMenuProps<T extends EditorEmojiMenuItem = EditorEmojiMenuItem> extends Partial<Pick<EditorMenuOptions<T>, 'editor' | 'char' | 'pluginKey' | 'filterFields' | 'limit' | 'options' | 'appendTo'>> {
  /**
   * @defaultValue 'md'
   */
  size?: EditorEmojiMenu['variants']['size']
  items?: T[] | T[][]
  class?: any
  ui?: EditorEmojiMenu['slots']
}
</script>

<script setup lang="ts" generic="T extends EditorEmojiMenuItem">
import { computed, h, onMounted, onBeforeUnmount, nextTick, toRef } from 'vue'
import { useAppConfig } from '#imports'
import { useEditorMenu } from '../composables/useEditorMenu'
import { tv } from '../utils/tv'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<EditorEmojiMenuProps<T>>(), {
  pluginKey: 'emojiMenu',
  char: ':',
  filterFields: () => ['name', 'shortcodes', 'tags']
})

const appConfig = useAppConfig() as EditorEmojiMenu['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.editorEmojiMenu || {}) })({
  size: props.size
}))

let menu: ReturnType<typeof useEditorMenu> | null = null

onMounted(async () => {
  await nextTick()

  if (!props.editor || props.editor.isDestroyed) {
    return
  }

  menu = useEditorMenu({
    editor: props.editor,
    char: props.char,
    pluginKey: props.pluginKey,
    items: toRef(() => props.items),
    filterFields: props.filterFields,
    limit: props.limit,
    options: props.options,
    appendTo: props.appendTo,
    ui,
    onSelect: (editor, range, item) => {
      if (!item.emoji) return

      // Delete the trigger character and query text, then insert the emoji
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent(item.emoji)
        .run()
    },
    renderItem: (item, styles) => {
      const content = item.emoji || item.shortcodes[0] || item.name
      return [
        h('span', { class: styles.value.itemLeadingIcon() }, content),
        h('span', { class: styles.value.itemWrapper() }, [
          h('span', { class: styles.value.itemLabel() }, item.name)
        ])
      ]
    }
  })

  props.editor.registerPlugin(menu.plugin)
})

onBeforeUnmount(() => {
  if (menu) {
    menu.destroy()
    menu = null
  }

  if (props.editor && !props.editor.isDestroyed) {
    props.editor.unregisterPlugin(props.pluginKey)
  }
})
</script>

<template>
  <div />
</template>
