<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/editor-suggestion-menu'
import type { EditorMenuOptions } from '../composables/useEditorMenu'
import type { IconProps } from '../types'
import type { EditorItem, EditorCustomHandlers } from '../types/editor'
import type { ComponentConfig } from '../types/tv'

type EditorSuggestionMenu = ComponentConfig<typeof theme, AppConfig, 'editorSuggestionMenu'>

type EditorSuggestionMenuLabelItem = {
  type: 'label'
  label: string
  class?: any
  [key: string]: any
}

type EditorSuggestionMenuSeparatorItem = {
  type: 'separator'
  class?: any
  [key: string]: any
}

type EditorSuggestionMenuActionItem<H extends EditorCustomHandlers = EditorCustomHandlers> = {
  type?: never
  label: string
  description?: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  disabled?: boolean
  class?: any
  [key: string]: any
} & EditorItem<H>

export type EditorSuggestionMenuItem<H extends EditorCustomHandlers = EditorCustomHandlers>
  = | EditorSuggestionMenuLabelItem
    | EditorSuggestionMenuSeparatorItem
    | EditorSuggestionMenuActionItem<H>

export interface EditorSuggestionMenuProps<T extends EditorSuggestionMenuItem = EditorSuggestionMenuItem> extends Partial<Pick<EditorMenuOptions<T>, 'editor' | 'char' | 'pluginKey' | 'filterFields' | 'limit' | 'options' | 'appendTo'>> {
  /**
   * @defaultValue 'md'
   */
  size?: EditorSuggestionMenu['variants']['size']
  items?: T[] | T[][]
  class?: any
  ui?: EditorSuggestionMenu['slots']
}
</script>

<script setup lang="ts" generic="T extends EditorSuggestionMenuItem">
import { computed, h, inject, onMounted, onBeforeUnmount, nextTick, toRef } from 'vue'
import { useAppConfig } from '#imports'
import { useEditorMenu } from '../composables/useEditorMenu'
import { createHandlers } from '../utils/editor'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<EditorSuggestionMenuProps<T>>(), {
  pluginKey: 'suggestionMenu',
  char: '/'
})

const appConfig = useAppConfig() as EditorSuggestionMenu['AppConfig']

const handlers = inject('editorHandlers', computed(() => createHandlers()))

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.editorSuggestionMenu || {}) })({
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
      // Skip if it's a label (non-interactive)
      if (item.type === 'label' || item.type === 'separator') return

      // Delete the trigger character and query text
      editor.chain().focus().deleteRange(range).run()

      // Execute the actual command using handlers
      const handler = handlers?.value?.[item.kind]
      if (handler) {
        handler.execute(editor, item).run()
      }
    },
    renderItem: (item, styles) => {
      // Render label (just text)
      if (item.type === 'label') {
        return [h('span', {}, item.label)]
      }

      // Render regular item
      return [
        item.icon
          ? h(UIcon, { name: item.icon, class: styles.value.itemLeadingIcon() })
          : null,
        h('span', { class: styles.value.itemWrapper() }, [
          h('span', { class: styles.value.itemLabel() }, item.label),
          item.description
            ? h('span', { class: styles.value.itemDescription() }, item.description)
            : null
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
