<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/editor-toolbar'
import type { ButtonProps, DropdownMenuProps, DropdownMenuItem } from '../types'
import type { ArrayOrNested, DynamicSlots, NestedItem } from '../types/utils'
import type { ComponentConfig } from '../types/tv'
import { reactivePick } from '@vueuse/core'
import defu from 'defu'

type EditorToolbar = ComponentConfig<typeof theme, AppConfig, 'editorToolbar'>

type BaseItem = Pick<ButtonProps, 'label' | 'color' | 'activeColor' | 'variant' | 'activeVariant' | 'size' | 'icon' | 'leadingIcon' | 'trailingIcon' | 'loading' | 'loadingIcon' | 'disabled' | 'active' | 'class' | 'ui'> & {
  slot?: string
}

type EditorActionType
  = | { kind: 'mark', mark: 'bold' | 'italic' | 'strike' | 'code' | 'underline' }
    | { kind: 'textAlign', align: 'left' | 'center' | 'right' | 'justify' }
    | { kind: 'heading', level: 1 | 2 | 3 | 4 | 5 | 6 }
    | { kind: 'blockquote' | 'bulletList' | 'orderedList' | 'codeBlock' | 'horizontalRule' | 'paragraph' }

type EditorToolbarDropdownItem = (DropdownMenuItem & EditorActionType) | DropdownMenuItem

export type EditorToolbarItem
  = | (BaseItem & EditorActionType)
    | (BaseItem & DropdownMenuProps<ArrayOrNested<EditorToolbarDropdownItem>>) & {
      kind: 'dropdown'
    }

export interface EditorToolbarProps<T extends ArrayOrNested<EditorToolbarItem> = ArrayOrNested<EditorToolbarItem>> {
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
  /**
   * @defaultValue 'fixed'
   */
  variant?: EditorToolbar['variants']['variant']
  editor: TiptapEditor
  class?: any
  ui?: EditorToolbar['slots']
}

type SlotProps<T extends EditorToolbarItem> = (props: { command: T, active?: boolean }) => any

export type EditorToolbarSlots<A extends ArrayOrNested<EditorToolbarItem> = ArrayOrNested<EditorToolbarItem>, T extends NestedItem<A> = NestedItem<A>> = {
  default(props?: {}): any
} & DynamicSlots<T, 'command', SlotProps<T>>

</script>

<script setup lang="ts" generic="T extends ArrayOrNested<EditorToolbarItem>">
import { computed } from 'vue'
import { Primitive, Separator } from 'reka-ui'
// import { createReusableTemplate } from '@vueuse/core'
import { BubbleMenu, FloatingMenu } from '@tiptap/vue-3/menus'
import { useAppConfig } from '#imports'
import { isArrayOfArray, pick } from '../utils'
import { isExtensionAvailable, isMarkInSchema, isNodeTypeSelected } from '../utils/editor'
import { tv } from '../utils/tv'
import UDropdownMenu from './DropdownMenu.vue'
import UButton from './Button.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<EditorToolbarProps<T>>()
defineSlots<EditorToolbarSlots<T>>()

const appConfig = useAppConfig() as EditorToolbar['AppConfig']

// const [DefineCommandButtonTemplate, ReuseCommandButtonTemplate] = createReusableTemplate<EditorToolbarCommand>()

const Component = computed(() => {
  return ({
    bubble: BubbleMenu,
    floating: FloatingMenu,
    fixed: 'template'
  }[props.variant || 'fixed'])
})

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.editorToolbar || {}) })({
  variant: props.variant
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
  paragraph: 'setParagraph'
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

  // For other node types (blockquote, bulletList, etc.)
  return props.editor.isActive(command.kind)
}

function isCommandDisabled(command: EditorToolbarItem) {
  if (!props.editor?.isEditable) {
    return true
  }

  // Dropdown commands are never disabled (their items might be)
  if (command.kind === 'dropdown') {
    return false
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

  // For node commands that use toggle
  if (['blockquote', 'bulletList', 'orderedList', 'codeBlock'].includes(command.kind)) {
    const canFunction = functionMap[command.kind] as keyof typeof props.editor.can
    return !(props.editor.can() as any)[canFunction]()
  }

  // For commands that use set (horizontalRule, paragraph)
  if (['horizontalRule', 'paragraph'].includes(command.kind)) {
    const canFunction = functionMap[command.kind] as keyof typeof props.editor.can
    return !(props.editor.can() as any)[canFunction]()
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

  const chain = props.editor.chain().focus() as any
  const chainFunction = functionMap[command.kind]

  // Handle different command types with their specific arguments
  if (command.kind === 'mark' && command.mark) {
    chain[chainFunction](command.mark).run()
  } else if (command.kind === 'textAlign' && command.align) {
    chain[chainFunction](command.align).run()
  } else if (command.kind === 'heading' && command.level) {
    chain[chainFunction]({ level: command.level }).run()
  } else {
    // For commands without arguments (blockquote, bulletList, etc.)
    chain[chainFunction]().run()
  }
}

function getButtonProps(command: EditorToolbarItem) {
  return defu(pick(command, ['label', 'color', 'activeColor', 'variant', 'activeVariant', 'size', 'icon', 'leadingIcon', 'trailingIcon', 'loading', 'loadingIcon', 'disabled', 'active', 'class', 'ui']), {
    color: 'neutral' as const,
    activeColor: 'primary' as const,
    variant: 'ghost' as const,
    activeVariant: 'soft' as const,
    size: 'sm' as const
  })
}

function getDropdownProps(command: EditorToolbarItem & { kind: 'dropdown' }) {
  return reactivePick(command, ['checkedIcon', 'loadingIcon', 'externalIcon', 'content', 'arrow', 'portal', 'modal'])
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
  <Primitive :as="Component" :editor="editor" style="z-index: 100;">
    <div role="toolbar" :data-variant="variant" v-bind="$attrs" :class="ui.root({ class: [props.ui?.root, props.class] })">
      <!-- <DefineCommandButtonTemplate v-slot="{ active, onClick, ...command }" /> -->

      <template v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`">
        <div role="group" :class="ui.group({ class: props.ui?.group })">
          <template v-for="(command, index) in group" :key="`group-${groupIndex}-${index}`">
            <!-- <slot :name="`command-${command.slot}`" v-bind="{ command, index }"> -->
            <UDropdownMenu v-if="command.kind === 'dropdown'" v-bind="getDropdownProps(command as EditorToolbarItem & { kind: 'dropdown' })" :items="getDropdownItems(command)">
              <UButton
                :active="isCommandActive(command)"
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
    </div>
  </Primitive>
</template>
