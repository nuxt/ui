<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { VNode } from 'vue'
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
type SlotProps<T extends EditorToolbarItem> = (props: { item: T } & SlotPropsProps) => VNode[]

export type EditorToolbarSlots<
  A extends ArrayOrNested<EditorToolbarItem> = ArrayOrNested<EditorToolbarItem>,
  T extends NestedItem<A> = NestedItem<A>
> = {
  item?: SlotProps<T>
} & DynamicSlots<MergeTypes<T>, undefined, SlotPropsProps>

</script>

<script setup lang="ts" generic="T extends ArrayOrNested<EditorToolbarItem>">
import { computed, inject, shallowRef, watch, type ShallowRef } from 'vue'
import { Primitive, Separator, useForwardProps } from 'reka-ui'
import { defu } from 'defu'
import { BubbleMenu, FloatingMenu } from '@tiptap/vue-3/menus'
import { reactiveOmit } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { isArrayOfArray, pick, omit } from '../utils'
import { createHandlers } from '../utils/editor'
import { tv } from '../utils/tv'
import EditorToolbarItemRenderer from './EditorToolbarItemRenderer.vue'

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

type ToolbarItemState = {
  active: boolean
  disabled: boolean
}

type ToolbarDropdownState = {
  activeChildIcon?: string
  activeChildLabel?: string
  items: DropdownMenuItem[][]
}

type ToolbarGroupEntry = {
  item: EditorToolbarItem
  key: string
  index: number
}

type ToolbarRenderEntry = ToolbarGroupEntry & {
  buttonProps: ShallowRef<Record<string, any>>
  dropdownState: ShallowRef<ToolbarDropdownState | undefined>
  dropdownItems: ShallowRef<DropdownMenuItem[][]>
  dropdownProps?: ShallowRef<Record<string, any> | undefined>
  slotName: string
  state: ShallowRef<ToolbarItemState>
  tooltip?: TooltipProps
}

function createItemKey(groupIndex: number, path: number[]) {
  return `${groupIndex}-${path.join('-')}`
}

function normalizeGroups(items: T | undefined): EditorToolbarItem[][] {
  if (!items?.length) {
    return []
  }

  return isArrayOfArray(items)
    ? items as EditorToolbarItem[][]
    : [items as EditorToolbarItem[]]
}

function normalizeDropdownGroups(items: ArrayOrNested<EditorToolbarDropdownChildItem> | undefined): EditorToolbarDropdownChildItem[][] {
  if (!items?.length) {
    return []
  }

  return isArrayOfArray(items)
    ? items as EditorToolbarDropdownChildItem[][]
    : [items as EditorToolbarDropdownChildItem[]]
}

const groups = computed<ToolbarGroupEntry[][]>(() =>
  normalizeGroups(props.items).map((group, groupIndex) =>
    group.map((item, index) => ({
      item,
      index,
      key: createItemKey(groupIndex, [index])
    }))
  )
)

const itemKeyMap = computed(() => {
  const map = new WeakMap<object, string>()

  for (const group of groups.value) {
    for (const entry of group) {
      map.set(entry.item as object, entry.key)
    }
  }

  return map
})

function resolveBaseItemState(item: EditorToolbarItem): ToolbarItemState {
  if (!props.editor?.isEditable) {
    return {
      active: false,
      disabled: true
    }
  }

  if (!('kind' in item)) {
    return {
      active: item.active ?? false,
      disabled: item.disabled ?? false
    }
  }

  const handler = handlers?.value?.[item.kind]
  if (!handler) {
    return {
      active: false,
      disabled: false
    }
  }

  return {
    active: handler.isActive(props.editor, item as any),
    disabled: !!handler.isDisabled?.(props.editor, item as any) || !handler.canExecute(props.editor, item as any)
  }
}

function resolveDropdownChildren(children: DropdownMenuItem['children']): DropdownMenuItem['children'] {
  if (!Array.isArray(children)) {
    return children
  }

  return isArrayOfArray(children)
    ? children.map(group => group.map(child => resolveDropdownChild(child as EditorToolbarDropdownChildItem).item))
    : children.map(child => resolveDropdownChild(child as EditorToolbarDropdownChildItem).item)
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

function resolveDropdownChild(item: EditorToolbarDropdownChildItem): { item: DropdownMenuItem, state: ToolbarItemState, actionable: boolean } {
  const children: DropdownMenuItem['children'] = 'children' in item
    ? resolveDropdownChildren(item.children)
    : undefined

  const state = resolveBaseItemState(item as EditorToolbarItem)

  if (!('kind' in item)) {
    return {
      item: children ? { ...item, children } : item,
      state,
      actionable: item.type !== 'separator' && item.type !== 'label'
    }
  }

  return {
    item: {
      ...item,
      ...(children && { children }),
      active: state.active,
      disabled: state.disabled,
      onSelect: (e: Event) => onClick(e as MouseEvent, item as EditorToolbarItem)
    },
    state,
    actionable: true
  }
}

function resolveToolbarItem(item: EditorToolbarItem): { state: ToolbarItemState, dropdown?: ToolbarDropdownState } {
  if (!('items' in item) || !item.items?.length) {
    return { state: resolveBaseItemState(item) }
  }

  const dropdownGroups = normalizeDropdownGroups(item.items)
  const resolvedGroups = dropdownGroups.map(group => group.map(child => resolveDropdownChild(child)))
  const resolvedItems = resolvedGroups.flat()
  const actionableItems = resolvedItems.filter(({ actionable }) => actionable)
  const activeChild = resolvedItems.find(({ item, state }) => {
    return 'kind' in item && state.active
  })?.item as EditorToolbarItem | undefined

  return {
    state: {
      active: resolvedItems.some(({ state }) => state.active),
      disabled: actionableItems.length === 0 || actionableItems.every(({ state }) => state.disabled)
    },
    dropdown: {
      activeChildIcon: activeChild?.icon,
      activeChildLabel: activeChild?.label,
      items: resolvedGroups.map(group => group.map(({ item }) => item))
    }
  }
}

function sameToolbarItemState(a: ToolbarItemState, b: ToolbarItemState) {
  return a.active === b.active && a.disabled === b.disabled
}

function sameDropdownButtonProps(a: ToolbarDropdownState | undefined, b: ToolbarDropdownState | undefined) {
  return a?.activeChildIcon === b?.activeChildIcon
    && a?.activeChildLabel === b?.activeChildLabel
}

function buildButtonProps(item: EditorToolbarItem, dropdownState?: ToolbarDropdownState) {
  const baseProps = omit(item as any, ['kind', 'mark', 'align', 'level', 'href', 'src', 'pos', 'items', 'slot', 'checkedIcon', 'loadingIcon', 'externalIcon', 'content', 'arrow', 'portal', 'modal', 'tooltip', 'onClick'])

  if (dropdownState?.activeChildIcon) {
    baseProps.icon = dropdownState.activeChildIcon
  }
  if (dropdownState?.activeChildLabel && baseProps.label !== undefined) {
    baseProps.label = dropdownState.activeChildLabel
  }

  return defu(baseProps, {
    color: props.color,
    activeColor: props.activeColor,
    activeVariant: props.activeVariant,
    variant: props.variant,
    size: props.size
  })
}

function buildRenderGroups(): ToolbarRenderEntry[][] {
  return groups.value.map(group =>
    group.map((entry) => {
      const resolved = resolveToolbarItem(entry.item)
      const hasDropdown = 'items' in entry.item && entry.item.items?.length

      return {
        ...entry,
        buttonProps: shallowRef(buildButtonProps(entry.item, resolved.dropdown)),
        dropdownState: shallowRef(resolved.dropdown),
        dropdownItems: shallowRef(resolved.dropdown?.items || []),
        dropdownProps: shallowRef(hasDropdown ? getDropdownProps(entry.item as EditorToolbarDropdownItem) : undefined),
        slotName: entry.item.slot || 'item',
        state: shallowRef(resolved.state),
        tooltip: entry.item.tooltip
      }
    })
  )
}

const renderGroups = shallowRef<ToolbarRenderEntry[][]>(buildRenderGroups())

function refreshState(force = false) {
  for (const group of renderGroups.value) {
    for (const entry of group) {
      const resolved = resolveToolbarItem(entry.item)
      const stateChanged = force || !sameToolbarItemState(entry.state.value, resolved.state)

      if (stateChanged) {
        entry.state.value = resolved.state
      }

      if ('items' in entry.item && entry.item.items?.length) {
        const previousDropdownState = entry.dropdownState.value

        // Always update dropdown items since child active/disabled states may change
        entry.dropdownState.value = resolved.dropdown
        entry.dropdownItems.value = resolved.dropdown?.items || []

        // Only rebuild button props when activeChild icon/label changes
        if (stateChanged || force || !sameDropdownButtonProps(previousDropdownState, resolved.dropdown)) {
          entry.buttonProps.value = buildButtonProps(entry.item, resolved.dropdown)
        }
      }
    }
  }
}

watch(() => props.items, () => {
  renderGroups.value = buildRenderGroups()
}, { deep: true })

watch(() => [props.color, props.variant, props.activeColor, props.activeVariant, props.size], () => {
  renderGroups.value = buildRenderGroups()
})

watch(() => handlers.value, () => {
  refreshState(true)
}, { deep: true })

watch(() => props.editor, (editor, _, onCleanup) => {
  refreshState(true)

  if (typeof (editor as any)?.on !== 'function' || typeof (editor as any)?.off !== 'function') {
    return
  }

  const onTransaction = () => {
    refreshState()
  }

  editor.on('transaction', onTransaction)

  onCleanup(() => {
    editor.off('transaction', onTransaction)
  })
}, { immediate: true })

function getRenderEntry(key: string) {
  for (const group of renderGroups.value) {
    for (const entry of group) {
      if (entry.key === key) {
        return entry
      }
    }
  }
}

function isActive(item: EditorToolbarItem): boolean {
  const key = itemKeyMap.value.get(item as object)
  const entry = key ? getRenderEntry(key) : undefined

  return entry
    ? entry.state.value.active
    : resolveToolbarItem(item).state.active
}

function isDisabled(item: EditorToolbarItem): boolean {
  const key = itemKeyMap.value.get(item as object)
  const entry = key ? getRenderEntry(key) : undefined

  return entry
    ? entry.state.value.disabled
    : resolveToolbarItem(item).state.disabled
}

function getDropdownProps(item: EditorToolbarDropdownItem) {
  const baseProps = pick(item as any, ['size', 'checkedIcon', 'loadingIcon', 'externalIcon', 'content', 'arrow', 'portal', 'modal', 'ui'])

  return defu(baseProps, {
    modal: false,
    size: props.size
  })
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
      <template v-for="(group, groupIndex) in renderGroups" :key="`group-${groupIndex}`">
        <div role="group" data-slot="group" :class="ui.group({ class: uiProp?.group })">
          <template v-for="entry in group" :key="entry.key">
            <template v-if="$slots[entry.slotName]">
              <slot
                :name="(entry.slotName as keyof EditorToolbarSlots<T>)"
                :item="(entry.item as any)"
                :index="entry.index"
                :is-active="isActive"
                :is-disabled="isDisabled"
                :on-click="onClick"
              />
            </template>

            <template v-else>
              <EditorToolbarItemRenderer
                :item="entry.item"
                :state="entry.state"
                :button-props="entry.buttonProps"
                :dropdown-items="entry.dropdownItems"
                :dropdown-props="entry.dropdownProps"
                :tooltip="entry.tooltip"
                :on-click="onClick"
              />
            </template>
          </template>
        </div>

        <Separator
          v-if="groupIndex < renderGroups.length - 1"
          data-slot="separator"
          :class="ui.separator({ class: uiProp?.separator })"
          orientation="vertical"
        />
      </template>
    </Primitive>
  </Primitive>
</template>
