<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { EditorMenuOptions } from '../composables/useEditorMenu'
import type { ComponentConfig } from '../types/tv'
import theme from '#build/ui/editor-emoji-menu'

type EditorEmojiMenu = ComponentConfig<typeof theme, AppConfig, 'editorEmojiMenu'>

// TipTap's emoji format
export interface TipTapEmojiItem {
  name: string
  emoji?: string
  shortcodes: string[]
  tags: string[]
  group?: string
  fallbackImage?: string
  [key: string]: any
}

// Our custom emoji format
export interface CustomEmojiItem {
  label: string
  emoji: string
  description?: string
  keywords?: string[]
  disabled?: boolean
  class?: any
  [key: string]: any
}

export type EditorEmojiMenuItem = TipTapEmojiItem | CustomEmojiItem

export interface EditorEmojiMenuProps<T extends EditorEmojiMenuItem = EditorEmojiMenuItem> extends Partial<Pick<EditorMenuOptions<T>, 'editor' | 'char' | 'pluginKey' | 'items' | 'limit'>> {
  class?: any
  ui?: EditorEmojiMenu['slots']
}
</script>

<script setup lang="ts" generic="T extends EditorEmojiMenuItem">
import { computed, h, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useAppConfig } from '#imports'
import { useEditorMenu } from '../composables/useEditorMenu'
import { tv } from '../utils/tv'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<EditorEmojiMenuProps<T>>(), {
  pluginKey: 'emojiMenu',
  char: ':',
  items: () => []
})

const appConfig = useAppConfig() as EditorEmojiMenu['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.editorEmojiMenu || {}) })())

let menu: ReturnType<typeof useEditorMenu> | null = null

// Helper to check if item is TipTap format
const isTipTapEmoji = (item: EditorEmojiMenuItem): item is TipTapEmojiItem => {
  return 'name' in item && 'shortcodes' in item
}

// Custom filter that handles both TipTap and custom emoji formats
const filterEmojis = (items: EditorEmojiMenuItem[], query: string) => {
  if (!query) return items
  return items.filter((item) => {
    if (isTipTapEmoji(item)) {
      const searchText = `${item.name} ${item.shortcodes.join(' ')} ${item.tags?.join(' ') || ''}`.toLowerCase()
      return searchText.includes(query.toLowerCase())
    } else {
      const searchText = `${item.label} ${item.description || ''} ${item.keywords?.join(' ') || ''}`.toLowerCase()
      return searchText.includes(query.toLowerCase())
    }
  })
}

onMounted(async () => {
  await nextTick()

  if (!props.editor || props.editor.isDestroyed) {
    return
  }

  menu = useEditorMenu({
    editor: props.editor,
    char: props.char,
    pluginKey: props.pluginKey,
    items: props.items,
    filter: filterEmojis,
    limit: props.limit,
    ui,
    onSelect: (editor, range, item) => {
      // Get the emoji character based on format
      const emojiChar = isTipTapEmoji(item) ? item.emoji : item.emoji

      // Delete the trigger character and query text, then insert the emoji
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent(emojiChar || '')
        .run()
    },
    renderItem: (item, styles) => {
      const isTipTap = isTipTapEmoji(item)
      const emoji = isTipTap ? item.emoji : item.emoji
      const label = isTipTap ? item.name : item.label
      // const description = isTipTap ? item.shortcodes[0] : item.description

      return [
        h('span', { class: styles.value.itemLeadingIcon() }, emoji),
        h('span', { class: styles.value.itemWrapper() }, [
          h('span', { class: styles.value.itemLabel() }, label)
          // description
          //   ? h('span', { class: styles.value.itemDescription() }, description)
          //   : null
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
