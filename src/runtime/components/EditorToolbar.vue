<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { Editor } from '@tiptap/vue-3'
import type { BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu'
import type { FloatingMenuPluginProps } from '@tiptap/extension-floating-menu'
import theme from '#build/ui/editor-toolbar'
import type { ButtonProps, DropdownMenuProps, DropdownMenuItem, TooltipProps, LinkPropsKeys } from '../types'
import type { EditorItem, EditorCustomHandlers } from '../types/editor'
import type { ArrayOrNested, DynamicSlots, MergeTypes, NestedItem } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type EditorToolbar = ComponentConfig<typeof theme, AppConfig, 'editorToolbar'>

type ButtonItem = Omit<ButtonProps, 'type'> & {
  'slot'?: string
  'tooltip'?: TooltipProps
  'aria-label'?: string
}

type EditorToolbarButtonItem<H extends EditorCustomHandlers = EditorCustomHandlers> = Omit<ButtonItem, LinkPropsKeys> & EditorItem<H>

type EditorToolbarDropdownChildItem<H extends EditorCustomHandlers = EditorCustomHandlers>
  = | DropdownMenuItem
    | (Omit<DropdownMenuItem, 'type'> & EditorItem<H>)

type EditorToolbarDropdownItem<H extends EditorCustomHandlers = EditorCustomHandlers> = ButtonItem & DropdownMenuProps<ArrayOrNested<EditorToolbarDropdownChildItem<H>>>

export type EditorToolbarItem<H extends EditorCustomHandlers = EditorCustomHandlers>
  = | ButtonItem
    | EditorToolbarButtonItem<H>
    | EditorToolbarDropdownItem<H>

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
  editor: Editor
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
  onClick: (e: MouseEvent, item: EditorToolbarItem) => void
}
type SlotProps<T extends EditorToolbarItem> = (props: { item: T } & SlotPropsProps) => any

export type EditorToolbarSlots<
  A extends ArrayOrNested<EditorToolbarItem> = ArrayOrNested<EditorToolbarItem>,
  T extends NestedItem<A> = NestedItem<A>
> = {
  item: SlotProps<T>
} & DynamicSlots<MergeTypes<T>, undefined, SlotPropsProps>

</script>

<script setup lang="ts" generic="T extends ArrayOrNested<EditorToolbarItem>">
import { computed, inject } from 'vue'
import { Primitive, Separator, useForwardProps } from 'reka-ui'
import { defu } from 'defu'
import { BubbleMenu, FloatingMenu } from '@tiptap/vue-3/menus'
import { reactiveOmit } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { isArrayOfArray, pick, omit } from '../utils'
import { createHandlers } from '../utils/editor'
import { tv } from '../utils/tv'
import UButton from './Button.vue'
import UDropdownMenu from './DropdownMenu.vue'
import UTooltip from './Tooltip.vue'

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
const uiProp = useComponentUI('editorToolbar', props)

const handlers = inject('editorHandlers', computed(() => createHandlers()))

const Component = computed(() => {
  return ({
    bubble: BubbleMenu,
    floating: FloatingMenu,
    fixed: 'template'
  }[props.layout])
})

const rootProps = useForwardProps(reactiveOmit(props, 'as', 'color', 'variant', 'activeColor', 'activeVariant', 'size', 'items', 'layout', 'editor', 'class', 'ui'))

const options = computed(() => defu((props as any).options, {
  offset: 8,
  shift: { padding: 8 }
}))

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

function isActive(item: EditorToolbarItem): boolean {
  if (!props.editor?.isEditable) {
    return false
  }

  // Check for dropdown (has items property)
  if (('items' in item) && item.items?.length) {
    return item.items?.some((item): boolean => isActive(item as EditorToolbarItem)) || false
  }

  // Check for plain button (no kind property)
  if (!('kind' in item)) {
    return item.active ?? false
  }

  // Check for editor item (has kind property)
  const handler = handlers?.value?.[item.kind]
  return handler?.isActive(props.editor, item as any) || false
}

function isDisabled(item: EditorToolbarItem): boolean {
  if (!props.editor?.isEditable) {
    return true
  }

  if ('items' in item && item.items?.length) {
    const items = isArrayOfArray(item.items) ? item.items.flat() : item.items
    // Filter out structural elements (separators, labels)
    const actionableItems = items.filter((item: any) => item.type !== 'separator' && item.type !== 'label')

    if (actionableItems.length === 0) {
      return true
    }

    return actionableItems.every((item: any) => isDisabled(item))
  }

  if (!('kind' in item)) {
    return item.disabled ?? false
  }

  const handler = handlers?.value?.[item.kind]
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

function onClick(e: MouseEvent, item: EditorToolbarItem) {
  if (!props.editor?.isEditable || isDisabled(item)) {
    return
  }

  if (('items' in item) || !('kind' in item)) {
    if ('onClick' in item) {
      for (const onClick of Array.isArray(item.onClick) ? item.onClick : [item.onClick]) {
        onClick?.(e)
      }
    }
    return
  }

  const handler = handlers?.value?.[item.kind]
  if (handler) {
    handler.execute(props.editor, item).run()
  }
}

function getActiveChildItem(item: EditorToolbarDropdownItem): EditorToolbarItem | undefined {
  if (!item.items) {
    return undefined
  }

  const items = isArrayOfArray(item.items) ? item.items.flat() : item.items

  return items.find((childItem: any): childItem is EditorToolbarItem => {
    if (!('kind' in childItem)) {
      return false
    }
    return isActive(childItem as EditorToolbarItem)
  }) as EditorToolbarItem | undefined
}

function getButtonProps(item: EditorToolbarItem) {
  const baseProps = omit(item as any, ['kind', 'mark', 'align', 'level', 'href', 'src', 'pos', 'items', 'slot', 'checkedIcon', 'loadingIcon', 'externalIcon', 'content', 'arrow', 'portal', 'modal', 'tooltip', 'onClick'])

  // For dropdown items, use the active child's icon if available
  if ('items' in item && item.items?.length) {
    const activeChild = getActiveChildItem(item)
    if (activeChild?.icon) {
      baseProps.icon = activeChild.icon
    }
    if (activeChild?.label && baseProps.label !== undefined) {
      baseProps.label = activeChild.label
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

function getDropdownProps(item: EditorToolbarDropdownItem) {
  const baseProps = pick(item as any, ['size', 'checkedIcon', 'loadingIcon', 'externalIcon', 'content', 'arrow', 'portal', 'modal', 'ui'])

  return defu(baseProps, {
    modal: false,
    size: props.size
  })
}

function mapDropdownItem(item: EditorToolbarDropdownChildItem): any {
  // Recursively map children if present
  const children = 'children' in item && Array.isArray(item.children)
    ? item.children.map(mapDropdownItem)
    : undefined

  // If it's a separator or label (no 'kind' property), return with mapped children
  if (!('kind' in item)) {
    return children ? { ...item, children } : item
  }

  const editorToolbarItem = item as EditorToolbarDropdownChildItem
  return {
    ...editorToolbarItem,
    ...(children && { children }),
    active: isActive(editorToolbarItem),
    disabled: isDisabled(editorToolbarItem),
    onSelect: (e: Event) => onClick(e as MouseEvent, editorToolbarItem)
  }
}

function getDropdownItems(item: EditorToolbarDropdownItem) {
  if (!item.items) {
    return []
  }

  return isArrayOfArray(item.items)
    ? item.items.map((group: any) => group.map(mapDropdownItem))
    : [item.items.map(mapDropdownItem)]
}
</script>

<template>
  <Primitive
    :as="Component"
    v-bind="Component !== 'template' ? {
      editor,
      tabindex: -1,
      class: ui.root({ class: uiProp?.root }),
      ...rootProps,
      options,
      ...$attrs
    } : {
      ...$attrs
    }"
  >
    <Primitive :as="as" role="toolbar" data-slot="base" :class="ui.base({ class: [uiProp?.base, props.class] })">
      <template v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`">
        <div role="group" data-slot="group" :class="ui.group({ class: uiProp?.group })">
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
                v-if="('items' in item && item.items?.length)"
                v-bind="getDropdownProps(item as EditorToolbarDropdownItem)"
                :items="getDropdownItems(item as EditorToolbarDropdownItem)"
              >
                <UTooltip v-if="item.tooltip" :disabled="isDisabled(item)" v-bind="{ ...(item.tooltip || {}) }">
                  <UButton :active="isActive(item)" :disabled="isDisabled(item)" v-bind="getButtonProps(item)" @click="onClick($event, item)" />
                </UTooltip>

                <UButton v-else :active="isActive(item)" :disabled="isDisabled(item)" v-bind="getButtonProps(item)" @click="onClick($event, item)" />
              </UDropdownMenu>

              <UTooltip v-else-if="item.tooltip" :disabled="isDisabled(item)" v-bind="{ ...(item.tooltip || {}) }">
                <UButton
                  :active="isActive(item)"
                  :disabled="isDisabled(item)"
                  v-bind="getButtonProps(item)"
                  :ui="item.ui"
                  @click="onClick($event, item)"
                />
              </UTooltip>

              <UButton
                v-else
                :active="isActive(item)"
                :disabled="isDisabled(item)"
                v-bind="getButtonProps(item)"
                :ui="item.ui"
                @click="onClick($event, item)"
              />
            </slot>
          </template>
        </div>

        <Separator
          v-if="groupIndex < groups.length - 1"
          data-slot="separator"
          :class="ui.separator({ class: uiProp?.separator })"
          orientation="vertical"
        />
      </template>
    </Primitive>
  </Primitive>
</template>
