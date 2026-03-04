<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/editor-mention-menu'
import type { EditorMenuOptions } from '../composables/useEditorMenu'
import type { AvatarProps, IconProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type EditorMentionMenu = ComponentConfig<typeof theme, AppConfig, 'editorMentionMenu'>

export interface EditorMentionMenuItem {
  label: string
  description?: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  avatar?: AvatarProps
  disabled?: boolean
  class?: any
  [key: string]: any
}

export interface EditorMentionMenuProps<T extends EditorMentionMenuItem = EditorMentionMenuItem> extends Partial<Pick<EditorMenuOptions<T>, 'editor' | 'char' | 'pluginKey' | 'filterFields' | 'limit' | 'options' | 'appendTo' | 'ignoreFilter'>> {
  /**
   * @defaultValue 'md'
   */
  size?: EditorMentionMenu['variants']['size']
  items?: T[] | T[][]
  class?: any
  ui?: EditorMentionMenu['slots']
}
</script>

<script setup lang="ts" generic="T extends EditorMentionMenuItem">
import { computed, h, onMounted, onBeforeUnmount, nextTick, toRef } from 'vue'
import { useAppConfig } from '#imports'
import { useEditorMenu } from '../composables/useEditorMenu'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<EditorMentionMenuProps<T>>(), {
  pluginKey: 'mentionMenu',
  char: '@'
})

const searchTerm = defineModel<string>('searchTerm', { default: '' })

const appConfig = useAppConfig() as EditorMentionMenu['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.editorMentionMenu || {}) })({
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
    ignoreFilter: props.ignoreFilter,
    limit: props.limit,
    options: props.options,
    appendTo: props.appendTo,
    searchTerm,
    ui,
    onSelect: (editor, range, item) => {
      // Delete the trigger character and query text, then insert the mention
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'mention',
          attrs: {
            ...item,
            mentionSuggestionChar: props.char
          }
        })
        .run()
    },
    renderItem: (item, styles) => [
      item.avatar
        ? h(UAvatar, { ...item.avatar, size: styles.value.itemLeadingAvatarSize(), class: styles.value.itemLeadingAvatar() })
        : item.icon
          ? h(UIcon, { name: item.icon, class: styles.value.itemLeadingIcon() })
          : null,
      h('span', { class: styles.value.itemWrapper() }, [
        h('span', { class: styles.value.itemLabel() }, item.label),
        item.description
          ? h('span', { class: styles.value.itemDescription() }, item.description)
          : null
      ])
    ]
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
