<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import type { BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu'
import type { FloatingMenuPluginProps } from '@tiptap/extension-floating-menu'
import theme from '#build/ui/editor-toolbar'
import type { ButtonProps, DropdownMenuProps, DropdownMenuItem } from '../types'
import type { ArrayOrNested, DynamicSlots, NestedItem } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type EditorToolbar = ComponentConfig<typeof theme, AppConfig, 'editorToolbar'>

type BaseItem = Pick<ButtonProps, 'label' | 'color' | 'activeColor' | 'variant' | 'activeVariant' | 'size' | 'icon' | 'leadingIcon' | 'trailingIcon' | 'loading' | 'loadingIcon' | 'disabled' | 'active' | 'class' | 'ui'> & {
  slot?: string
}

type EditorActionType
  = | { kind: 'mark', mark: 'bold' | 'italic' | 'strike' | 'code' | 'underline' }
    | { kind: 'textAlign', align: 'left' | 'center' | 'right' | 'justify' }
    | { kind: 'heading', level: 1 | 2 | 3 | 4 | 5 | 6 }
    | { kind: 'blockquote' | 'bulletList' | 'orderedList' | 'codeBlock' | 'horizontalRule' | 'paragraph' | 'undo' | 'redo' }

type EditorToolbarDropdownItem = (DropdownMenuItem & EditorActionType) | DropdownMenuItem

export type EditorToolbarItem
  = | (BaseItem & EditorActionType)
    | (BaseItem & DropdownMenuProps<ArrayOrNested<EditorToolbarDropdownItem>>) & {
      kind: 'dropdown'
    }

type EditorToolbarBaseProps<T extends ArrayOrNested<EditorToolbarItem> = ArrayOrNested<EditorToolbarItem>> = {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The items to display in the toolbar.
   * `{ color: 'neutral', activeColor: 'primary', variant: 'ghost', activeVariant: 'soft', size: 'sm' }`{lang="ts-type"}
   */
  items?: T
  editor: TiptapEditor
  class?: any
  ui?: EditorToolbar['slots']
}

export type EditorToolbarProps<T extends ArrayOrNested<EditorToolbarItem> = ArrayOrNested<EditorToolbarItem>>
  = | (EditorToolbarBaseProps<T> & {

    layout?: 'fixed'
  })
  | (EditorToolbarBaseProps<T> & Partial<Omit<BubbleMenuPluginProps, 'pluginKey' | 'editor' | 'element'>> & {
    layout?: 'bubble'
  })
  | (EditorToolbarBaseProps<T> & Partial<Omit<FloatingMenuPluginProps, 'pluginKey' | 'editor' | 'element'>> & {
    layout?: 'floating'
  })

type SlotProps<T extends EditorToolbarItem> = (props: { command: T, active?: boolean }) => any

export type EditorToolbarSlots<A extends ArrayOrNested<EditorToolbarItem> = ArrayOrNested<EditorToolbarItem>, T extends NestedItem<A> = NestedItem<A>> = {
  default(props?: {}): any
} & DynamicSlots<T, 'command', SlotProps<T>>

</script>

<script setup lang="ts" generic="T extends ArrayOrNested<EditorToolbarItem>">
import { computed } from 'vue'
import { Primitive, Separator, useForwardProps } from 'reka-ui'
import { defu } from 'defu'
import { BubbleMenu, FloatingMenu } from '@tiptap/vue-3/menus'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { isArrayOfArray, pick } from '../utils'
import { isExtensionAvailable, isMarkInSchema, isNodeTypeSelected } from '../utils/editor'
import { tv } from '../utils/tv'
import UDropdownMenu from './DropdownMenu.vue'
import UButton from './Button.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<EditorToolbarProps<T>>(), {
  layout: 'fixed'
})
defineSlots<EditorToolbarSlots<T>>()

const appConfig = useAppConfig() as EditorToolbar['AppConfig']

const Component = computed(() => {
  return ({
    bubble: BubbleMenu,
    floating: FloatingMenu,
    fixed: 'template'
  }[props.layout])
})
const ComponentProps = useForwardProps(reactivePick(props as any, 'appendTo', 'updateDelay', 'resizeDelay', 'shouldShow', 'options'))

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.editorToolbar || {}) })({
  layout: props.layout
}))

const groups = computed<EditorToolbarItem[][]>(() =>
  props.items?.length
    ? isArrayOfArray(props.items)
      ? props.items
      : [props.items]
    : []
)

const functionMap = {
  mark: 'toggleMark',
  textAlign: 'setTextAlign',
  heading: 'toggleHeading',
  blockquote: 'toggleBlockquote',
  bulletList: 'toggleBulletList',
  orderedList: 'toggleOrderedList',
  codeBlock: 'toggleCodeBlock',
  horizontalRule: 'setHorizontalRule',
  paragraph: 'setParagraph',
  undo: 'undo',
  redo: 'redo'
}

function isCommandActive(command: EditorToolbarItem): boolean {
  if (!props.editor?.isEditable) {
    return false
  }

  if (!('kind' in command)) {
    return false
  }

  // Dropdown commands are active if any of their items are active
  if (command.kind === 'dropdown') {
    return command.items?.some((item): boolean => isCommandActive(item as EditorToolbarItem)) || false
  }

  // For textAlign commands, check with the align parameter
  if (command.kind === 'textAlign' && command.align) {
    return props.editor.isActive({ textAlign: command.align })
  }

  // For heading commands, check with the level parameter
  if (command.kind === 'heading' && command.level) {
    return props.editor.isActive('heading', { level: command.level })
  }

  // For mark commands, check the mark
  if (command.kind === 'mark' && command.mark) {
    return props.editor.isActive(command.mark)
  }

  // Undo/redo commands don't have an active state
  if (command.kind === 'undo' || command.kind === 'redo') {
    return false
  }

  // For other node types (blockquote, bulletList, etc.)
  return props.editor.isActive(command.kind)
}

function isCommandDisabled(command: EditorToolbarItem): boolean {
  if (!props.editor?.isEditable) {
    return true
  }

  // Dropdown commands are disabled if all their items are disabled
  if (command.kind === 'dropdown') {
    if (!command.items || command.items.length === 0) {
      return true
    }

    const items = isArrayOfArray(command.items) ? command.items.flat() : command.items

    // Check if all items are disabled (skipping separators and labels)
    const commandItems = items.filter((item): item is EditorToolbarItem => 'kind' in item)
    if (commandItems.length === 0) {
      return true
    }

    return commandItems.every(item => isCommandDisabled(item))
  }

  // For mark commands, check if mark is in schema and if a restricted node is selected
  if (command.kind === 'mark' && command.mark) {
    if (!isMarkInSchema(command.mark, props.editor) || isNodeTypeSelected(props.editor, ['image'])) {
      return true
    }
    return !(props.editor.can() as any).toggleMark(command.mark)
  }

  // For textAlign commands, check extension availability and restricted nodes
  if (command.kind === 'textAlign' && command.align) {
    if (!isExtensionAvailable(props.editor, 'textAlign') || isNodeTypeSelected(props.editor, ['image', 'horizontalRule'])) {
      return true
    }
    return !(props.editor.can() as any).setTextAlign(command.align)
  }

  // For heading commands, check with level
  if (command.kind === 'heading' && command.level) {
    return !(props.editor.can() as any).toggleHeading({ level: command.level })
  }

  // For list commands, always allow switching between list types
  if (command.kind === 'bulletList' || command.kind === 'orderedList') {
    return false
  }

  // For other node commands that use toggle
  if (['blockquote', 'codeBlock'].includes(command.kind)) {
    const canFunction = functionMap[command.kind] as keyof typeof props.editor.can
    return !(props.editor.can() as any)[canFunction]()
  }

  // For commands that use set (horizontalRule, paragraph)
  if (['horizontalRule', 'paragraph'].includes(command.kind)) {
    const canFunction = functionMap[command.kind] as keyof typeof props.editor.can
    return !(props.editor.can() as any)[canFunction]()
  }

  // For undo/redo commands, check if there's history
  if (command.kind === 'undo' || command.kind === 'redo') {
    return !(props.editor.can() as any)[command.kind]()
  }

  return false
}

function onCommandClick(_: Event, command: EditorToolbarItem) {
  if (!props.editor?.isEditable) {
    return
  }

  // Dropdown commands don't have actions
  if (command.kind === 'dropdown') {
    return
  }

  if (isCommandDisabled(command)) {
    return
  }

  const chain = props.editor.chain() as any
  const chainFunction = functionMap[command.kind]

  // Handle different command types with their specific arguments
  if (command.kind === 'mark' && command.mark) {
    chain.focus()[chainFunction](command.mark).run()
  } else if (command.kind === 'textAlign' && command.align) {
    chain.focus()[chainFunction](command.align).run()
  } else if (command.kind === 'heading' && command.level) {
    chain.focus()[chainFunction]({ level: command.level }).run()
  } else if (command.kind === 'undo' || command.kind === 'redo') {
    // Undo/redo don't need focus
    chain[chainFunction]().run()
  } else {
    // For commands without arguments (blockquote, bulletList, etc.)
    chain.focus()[chainFunction]().run()
  }
}

function getActiveChildItem(command: EditorToolbarItem & { kind: 'dropdown' }): EditorToolbarItem | undefined {
  if (!command.items) {
    return undefined
  }

  const items = isArrayOfArray(command.items) ? command.items.flat() : command.items

  return items.find((item): item is EditorToolbarItem => {
    if (!('kind' in item)) {
      return false
    }
    return isCommandActive(item as EditorToolbarItem)
  }) as EditorToolbarItem | undefined
}

function getButtonProps(command: EditorToolbarItem) {
  const baseProps = pick(command, ['label', 'color', 'activeColor', 'variant', 'activeVariant', 'size', 'icon', 'leadingIcon', 'trailingIcon', 'loading', 'loadingIcon', 'disabled', 'active', 'class', 'ui'])

  // For dropdown commands, use the active child's icon if available
  if (command.kind === 'dropdown') {
    const activeChild = getActiveChildItem(command)
    if (activeChild?.icon) {
      baseProps.icon = activeChild.icon
    }
  }

  return defu(baseProps, {
    color: 'neutral' as const,
    activeColor: 'primary' as const,
    variant: 'ghost' as const,
    activeVariant: 'soft' as const,
    size: 'sm' as const
  })
}

function getDropdownProps(command: EditorToolbarItem & { kind: 'dropdown' }) {
  const baseProps = pick(command, ['checkedIcon', 'loadingIcon', 'externalIcon', 'content', 'arrow', 'portal', 'modal'])

  return defu(baseProps, {
    content: {
      // onCloseAutoFocus: (e: Event) => e.preventDefault()
    }
  })
}

function mapDropdownItem(item: EditorToolbarItem | DropdownMenuItem) {
  // If it's a separator or label (no 'kind' property), return as is
  if (!('kind' in item)) {
    return item
  }
  // Otherwise it's an EditorToolbarItem, add computed props
  return {
    ...item,
    active: isCommandActive(item as EditorToolbarItem),
    disabled: isCommandDisabled(item as EditorToolbarItem),
    onClick: (e: Event) => onCommandClick(e, item as EditorToolbarItem)
  }
}

function getDropdownItems(command: EditorToolbarItem & { kind: 'dropdown' }) {
  if (!command.items) {
    return []
  }

  return isArrayOfArray(command.items)
    ? command.items.map(group => group.map(mapDropdownItem))
    : [command.items.map(mapDropdownItem)]
}
</script>

<template>
  <Primitive
    :as="Component"
    v-bind="Component !== 'template' ? {
      editor,
      class: ui.root({ class: props.ui?.root }),
      ...ComponentProps,
      ...$attrs
    } : {
      ...$attrs
    }"
  >
    <Primitive :as="as" role="toolbar" :class="ui.base({ class: [props.ui?.base, props.class] })">
      <template v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`">
        <div role="group" :class="ui.group({ class: props.ui?.group })">
          <template v-for="(command, index) in group" :key="`group-${groupIndex}-${index}`">
            <!-- <slot :name="`command-${command.slot}`" v-bind="{ command, index }"> -->
            <UDropdownMenu
              v-if="command.kind === 'dropdown' && command.items?.length"
              v-bind="getDropdownProps(command as EditorToolbarItem & { kind: 'dropdown' })"
              :items="getDropdownItems(command)"
            >
              <UButton
                :active="isCommandActive(command)"
                :disabled="isCommandDisabled(command)"
                v-bind="getButtonProps(command)"
              />
            </UDropdownMenu>

            <UButton
              v-else
              :active="isCommandActive(command)"
              :disabled="isCommandDisabled(command)"
              v-bind="getButtonProps(command)"
              @click="onCommandClick($event, command)"
            />
            <!-- </slot> -->
          </template>
        </div>

        <Separator
          v-if="groupIndex < groups.length - 1"
          :class="ui.separator({ class: props.ui?.separator })"
          orientation="vertical"
        />
      </template>
    </Primitive>
  </Primitive>
</template>
