<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { DropdownMenuRootProps, DropdownMenuRootEmits, DropdownMenuContentProps, DropdownMenuContentEmits, DropdownMenuArrowProps } from 'reka-ui'
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/dropdown-menu'
import type { AvatarProps, IconProps, InputProps, KbdProps, LinkProps } from '../types'
import type { ArrayOrNested, DynamicSlots, GetItemKeys, MergeTypes, NestedItem, EmitsToProps } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type DropdownMenu = ComponentConfig<typeof theme, AppConfig, 'dropdownMenu'>

export interface DropdownMenuItem extends Omit<LinkProps, 'type' | 'raw' | 'custom'> {
  label?: string
  description?: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  color?: DropdownMenu['variants']['color']
  avatar?: AvatarProps
  content?: Omit<DropdownMenuContentProps, 'as' | 'asChild' | 'forceMount'> & { class?: any } & Partial<EmitsToProps<DropdownMenuContentEmits>>
  kbds?: KbdProps['value'][] | KbdProps[]
  /**
   * The item type.
   * @defaultValue 'link'
   */
  type?: 'label' | 'separator' | 'link' | 'checkbox'
  slot?: string
  loading?: boolean
  disabled?: boolean
  checked?: boolean
  open?: boolean
  defaultOpen?: boolean
  filter?: boolean | Omit<InputProps, 'modelValue' | 'defaultValue'>
  filterFields?: string[]
  ignoreFilter?: boolean
  children?: ArrayOrNested<DropdownMenuItem>
  onSelect?: (e: Event) => void
  onUpdateChecked?: (checked: boolean) => void
  class?: any
  ui?: Pick<DropdownMenu['slots'], 'content' | 'item' | 'label' | 'separator' | 'itemLeadingIcon' | 'itemLeadingAvatarSize' | 'itemLeadingAvatar' | 'itemWrapper' | 'itemLabel' | 'itemDescription' | 'itemLabelExternalIcon' | 'itemTrailing' | 'itemTrailingIcon' | 'itemTrailingKbds' | 'itemTrailingKbdsSize'>
  [key: string]: any
}

export interface DropdownMenuProps<T extends ArrayOrNested<DropdownMenuItem> = ArrayOrNested<DropdownMenuItem>> extends Omit<DropdownMenuRootProps, 'dir'> {
  /**
   * @defaultValue 'md'
   */
  size?: DropdownMenu['variants']['size']
  items?: T
  /**
   * The icon displayed when an item is checked.
   * @defaultValue appConfig.ui.icons.check
   * @IconifyIcon
   */
  checkedIcon?: IconProps['name']
  /**
   * The icon displayed when an item is loading.
   * @defaultValue appConfig.ui.icons.loading
   * @IconifyIcon
   */
  loadingIcon?: IconProps['name']
  /**
   * The icon displayed when the item is an external link.
   * Set to `false` to hide the external icon.
   * @defaultValue appConfig.ui.icons.external
   * @IconifyIcon
   */
  externalIcon?: boolean | IconProps['name']
  /**
   * The content of the menu.
   * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8 }
   */
  content?: Omit<DropdownMenuContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<DropdownMenuContentEmits>>
  /**
   * Display an arrow alongside the menu.
   * `{ rounded: true }`{lang="ts-type"}
   * @defaultValue false
   */
  arrow?: boolean | Omit<DropdownMenuArrowProps, 'as' | 'asChild'>
  /**
   * Render the menu in a portal.
   * @defaultValue true
   */
  portal?: boolean | string | HTMLElement
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: GetItemKeys<T>
  /**
   * The key used to get the description from the item.
   * @defaultValue 'description'
   */
  descriptionKey?: GetItemKeys<T>
  /**
   * Whether to display a filter input or not.
   * Can be an object to pass additional props to the input.
   * `{ placeholder: 'Search...', variant: 'none' }`{lang="ts-type"}
   * @defaultValue false
   */
  filter?: boolean | Omit<InputProps, 'modelValue' | 'defaultValue'>
  /**
   * The fields to filter by.
   * @defaultValue [labelKey]
   */
  filterFields?: string[]
  /**
   * When `true`, items will not be filtered which is useful for custom filtering.
   * @defaultValue false
   */
  ignoreFilter?: boolean
  disabled?: boolean
  class?: any
  ui?: DropdownMenu['slots']
}

export interface DropdownMenuEmits extends DropdownMenuRootEmits {}

type SlotProps<T extends DropdownMenuItem> = (props: { item: T, active: boolean, index: number, ui: DropdownMenu['ui'] }) => VNode[]

export type DropdownMenuSlots<
  A extends ArrayOrNested<DropdownMenuItem> = ArrayOrNested<DropdownMenuItem>,
  T extends NestedItem<A> = NestedItem<A>
> = {
  'default'?(props: { open: boolean }): VNode[]
  'item'?: SlotProps<T>
  'item-leading'?: SlotProps<T>
  'item-label'?: (props: { item: T, active: boolean, index: number }) => VNode[]
  'item-description'?: (props: { item: T, active: boolean, index: number }) => VNode[]
  'item-trailing'?: SlotProps<T>
  'empty'?(props: { searchTerm: string }): VNode[]
  'content-top'?: (props: { sub: boolean }) => VNode[]
  'content-bottom'?: (props: { sub: boolean }) => VNode[]
}
& DynamicSlots<MergeTypes<T>, 'label' | 'description', { active: boolean, index: number }>
& DynamicSlots<MergeTypes<T>, 'leading' | 'trailing', { active: boolean, index: number, ui: DropdownMenu['ui'] }>

</script>

<script setup lang="ts" generic="T extends ArrayOrNested<DropdownMenuItem>">
import { computed, toRef } from 'vue'
import { defu } from 'defu'
import { DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuArrow, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { omit } from '../utils'
import { tv } from '../utils/tv'
import UDropdownMenuContent from './DropdownMenuContent.vue'

const props = withDefaults(defineProps<DropdownMenuProps<T>>(), {
  portal: true,
  modal: true,
  externalIcon: true,
  labelKey: 'label',
  descriptionKey: 'description',
  filter: false,
  ignoreFilter: false
})
const emits = defineEmits<DropdownMenuEmits>()
const slots = defineSlots<DropdownMenuSlots<T>>()

const searchTerm = defineModel<string>('searchTerm', { default: '' })

const appConfig = useAppConfig() as DropdownMenu['AppConfig']
const uiProp = useComponentUI('dropdownMenu', props)

const rootProps = useForwardPropsEmits(reactivePick(props, 'defaultOpen', 'open', 'modal'), emits)
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8, collisionPadding: 8 }) as DropdownMenuContentProps)
const arrowProps = toRef(() => defu(props.arrow, { rounded: true }) as DropdownMenuArrowProps)
const getProxySlots = () => omit(slots, ['default'])

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.dropdownMenu || {}) })({
  size: props.size
}))
</script>

<template>
  <DropdownMenuRoot v-slot="{ open }" v-bind="rootProps">
    <DropdownMenuTrigger v-if="!!slots.default" as-child :class="props.class" :disabled="disabled">
      <slot :open="open" />
    </DropdownMenuTrigger>

    <UDropdownMenuContent
      v-model:search-term="searchTerm"
      :class="ui.content({ class: [!slots.default && props.class, uiProp?.content] })"
      :ui="ui"
      :ui-override="uiProp"
      v-bind="contentProps"
      :items="items"
      :portal="portal"
      :label-key="(labelKey as string & keyof NestedItem<T>)"
      :description-key="(descriptionKey as string & keyof NestedItem<T>)"
      :checked-icon="checkedIcon"
      :loading-icon="loadingIcon"
      :external-icon="externalIcon"
      :size="size"
      :filter="filter"
      :filter-fields="filterFields"
      :ignore-filter="ignoreFilter"
    >
      <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
        <slot :name="(name as keyof DropdownMenuSlots<T>)" v-bind="slotData" />
      </template>

      <DropdownMenuArrow v-if="!!arrow" v-bind="arrowProps" data-slot="arrow" :class="ui.arrow({ class: uiProp?.arrow })" />
    </UDropdownMenuContent>
  </DropdownMenuRoot>
</template>
