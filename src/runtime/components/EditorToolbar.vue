<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import type { BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu'
import type { FloatingMenuPluginProps } from '@tiptap/extension-floating-menu'
import theme from '#build/ui/editor-toolbar'
import type { ButtonProps, DropdownMenuProps, DropdownMenuItem } from '../types'
import type { ArrayOrNested, DynamicSlots, MergeTypes, NestedItem } from '../types/utils'
import type { EditorHandler, EditorActionItem } from '../utils/editor'
import type { ComponentConfig } from '../types/tv'

export type { EditorHandler, EditorActionItem } from '../utils/editor'

type EditorToolbar = ComponentConfig<typeof theme, AppConfig, 'editorToolbar'>

type ButtonItem = Pick<ButtonProps, 'label' | 'color' | 'activeColor' | 'variant' | 'activeVariant' | 'size' | 'icon' | 'leadingIcon' | 'trailingIcon' | 'loading' | 'loadingIcon' | 'disabled' | 'active' | 'class' | 'ui'> & {
  slot?: string
}

type EditorToolbarDropdownItem = (DropdownMenuItem & EditorActionItem) | DropdownMenuItem

export type EditorToolbarItem
  = | (ButtonItem & EditorActionItem)
    | (ButtonItem & DropdownMenuProps<ArrayOrNested<EditorToolbarDropdownItem>>) & {
      kind: 'dropdown'
    }
    | ButtonItem & {
      kind: 'slot'
      slot: string
    }

export type EditorToolbarHandlers = Record<string, EditorHandler>

type EditorToolbarBaseProps<T extends ArrayOrNested<EditorToolbarItem> = ArrayOrNested<EditorToolbarItem>> = {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The color of the toolbar controls.
   * @defaultValue 'neutral'
   */
  color?: ButtonProps['color']
  /**
   * The variant of the toolbar controls.
   * @defaultValue 'ghost'
   */
  variant?: ButtonProps['variant']
  /**
   * The color of the active toolbar control.
   * @defaultValue 'primary'
   */
  activeColor?: ButtonProps['color']
  /**
   * The variant of the active toolbar control.
   * @defaultValue 'soft'
   */
  activeVariant?: ButtonProps['variant']
  /**
   * The size of the toolbar controls.
   * @defaultValue 'sm'
   */
  size?: ButtonProps['size']
  items?: T
  /**
   * Custom item handlers to override or extend the default handlers.
   */
  handlers?: EditorToolbarHandlers
  editor: TiptapEditor
  class?: any
  ui?: EditorToolbar['slots']
}

export type EditorToolbarProps<T extends ArrayOrNested<EditorToolbarItem> = ArrayOrNested<EditorToolbarItem>>
  = | (EditorToolbarBaseProps<T> & { layout?: 'fixed' })
    | (EditorToolbarBaseProps<T> & Partial<Omit<BubbleMenuPluginProps, 'editor' | 'element'>> & {
      layout?: 'bubble'
    })
    | (EditorToolbarBaseProps<T> & Partial<Omit<FloatingMenuPluginProps, 'editor' | 'element'>> & {
      layout?: 'floating'
    })

type SlotPropsProps = {
  index: number
  isActive: (item: EditorToolbarItem) => boolean
  isDisabled: (item: EditorToolbarItem) => boolean
  onClick: (e: Event, item: EditorToolbarItem) => void
}
type SlotProps<T extends EditorToolbarItem> = (props: { item: T } & SlotPropsProps) => any

export type EditorToolbarSlots<
  A extends ArrayOrNested<EditorToolbarItem> = ArrayOrNested<EditorToolbarItem>,
  T extends NestedItem<A> = NestedItem<A>
> = {
  default(props?: {}): any
  item: SlotProps<T>
} & DynamicSlots<MergeTypes<T>, undefined, SlotPropsProps>

</script>

<script setup lang="ts" generic="T extends ArrayOrNested<EditorToolbarItem>">
import { computed } from 'vue'
import { Primitive, Separator, useForwardProps } from 'reka-ui'
import { defu } from 'defu'
import { BubbleMenu, FloatingMenu } from '@tiptap/vue-3/menus'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { isArrayOfArray, pick } from '../utils'
import { createHandlers } from '../utils/editor'
import { tv } from '../utils/tv'
import UDropdownMenu from './DropdownMenu.vue'
import UButton from './Button.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<EditorToolbarProps<T>>(), {
  layout: 'fixed',
  color: 'neutral',
  variant: 'ghost',
  activeColor: 'primary',
  activeVariant: 'soft',
  size: 'sm'
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
const ComponentProps = useForwardProps(reactivePick(props as any, 'pluginKey', 'appendTo', 'updateDelay', 'resizeDelay', 'shouldShow', 'options'))

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

const handlers = computed<EditorToolbarHandlers>(() => ({
  ...createHandlers(),
  ...props.handlers
}))

function isActive(item: EditorToolbarItem): boolean {
  if (!props.editor?.isEditable || !('kind' in item)) {
    return false
  }

  if (item.kind === 'dropdown') {
    return item.items?.some((item): boolean => isActive(item as EditorToolbarItem)) || false
  }

  const handler = handlers.value[item.kind]
  return handler?.isActive(props.editor, item) || false
}

function isDisabled(item: EditorToolbarItem): boolean {
  if (!props.editor?.isEditable) {
    return true
  }

  if (item.kind === 'dropdown') {
    if (!item.items || item.items.length === 0) {
      return true
    }

    const items = isArrayOfArray(item.items) ? item.items.flat() : item.items
    const itemItems = items.filter((item): item is EditorToolbarItem => 'kind' in item)

    if (itemItems.length === 0) {
      return true
    }

    return itemItems.every(item => isDisabled(item))
  }

  const handler = handlers.value[item.kind]
  if (!handler) {
    return false
  }

  // Check item-specific disabled state
  if (handler.isDisabled?.(props.editor, item)) {
    return true
  }

  // Check if item can be executed
  return !handler.canExecute(props.editor, item)
}

function onClick(_: Event, item: EditorToolbarItem) {
  if (!props.editor?.isEditable || item.kind === 'dropdown' || isDisabled(item)) {
    return
  }

  const handler = handlers.value[item.kind]
  if (handler && props.editor) {
    handler.execute(props.editor, item).run()
  }
}

function getActiveChildItem(item: EditorToolbarItem & { kind: 'dropdown' }): EditorToolbarItem | undefined {
  if (!item.items) {
    return undefined
  }

  const items = isArrayOfArray(item.items) ? item.items.flat() : item.items

  return items.find((item): item is EditorToolbarItem => {
    if (!('kind' in item)) {
      return false
    }
    return isActive(item as EditorToolbarItem)
  }) as EditorToolbarItem | undefined
}

function getButtonProps(item: EditorToolbarItem) {
  const baseProps = pick(item, ['label', 'color', 'activeColor', 'variant', 'activeVariant', 'size', 'icon', 'leadingIcon', 'trailingIcon', 'loading', 'loadingIcon', 'disabled', 'active', 'class', 'ui'])

  // For dropdown items, use the active child's icon if available
  if (item.kind === 'dropdown') {
    const activeChild = getActiveChildItem(item)
    if (activeChild?.icon) {
      baseProps.icon = activeChild.icon
    }
  }

  return defu(baseProps, {
    color: props.color,
    activeColor: props.activeColor,
    activeVariant: props.activeVariant,
    variant: props.variant,
    size: props.size
  })
}

function getDropdownProps(item: EditorToolbarItem & { kind: 'dropdown' }) {
  const baseProps = pick(item, ['checkedIcon', 'loadingIcon', 'externalIcon', 'content', 'arrow', 'portal', 'modal'])

  return defu(baseProps, {
    modal: false
  })
}

function mapDropdownItem(item: EditorToolbarItem | DropdownMenuItem) {
  // If it's a separator or label (no 'kind' property), return as is
  if (!('kind' in item)) {
    return item
  }

  const editorToolbarItem = item as EditorToolbarItem
  return {
    ...editorToolbarItem,
    active: isActive(editorToolbarItem),
    disabled: isDisabled(editorToolbarItem),
    onClick: (e: Event) => onClick(e, editorToolbarItem)
  }
}

function getDropdownItems(item: EditorToolbarItem & { kind: 'dropdown' }) {
  if (!item.items) {
    return []
  }

  return isArrayOfArray(item.items)
    ? item.items.map(group => group.map(mapDropdownItem))
    : [item.items.map(mapDropdownItem)]
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
    <Primitive :as="as" role="toolbar" data-slot="base" :class="ui.base({ class: [props.ui?.base, props.class] })">
      <template v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`">
        <div role="group" data-slot="group" :class="ui.group({ class: props.ui?.group })">
          <template v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`">
            <slot
              :name="((item.slot || 'item') as keyof EditorToolbarSlots<T>)"
              :item="(item as any)"
              :index="index"
              :is-active="isActive"
              :is-disabled="isDisabled"
              :on-click="onClick"
            >
              <UDropdownMenu
                v-if="item.kind === 'dropdown' && item.items?.length"
                v-bind="getDropdownProps(item as EditorToolbarItem & { kind: 'dropdown' })"
                :items="getDropdownItems(item)"
              >
                <UButton
                  :active="isActive(item)"
                  :disabled="isDisabled(item)"
                  v-bind="getButtonProps(item)"
                />
              </UDropdownMenu>

              <UButton
                v-else
                :active="isActive(item)"
                :disabled="isDisabled(item)"
                v-bind="getButtonProps(item)"
                @click="onClick($event, item)"
              />
            </slot>
          </template>
        </div>

        <Separator
          v-if="groupIndex < groups.length - 1"
          data-slot="separator"
          :class="ui.separator({ class: props.ui?.separator })"
          orientation="vertical"
        />
      </template>
    </Primitive>
  </Primitive>
</template>
