<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { DropdownMenuRootProps, DropdownMenuRootEmits, DropdownMenuContentProps, DropdownMenuContentEmits, DropdownMenuArrowProps } from 'reka-ui'
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '../theme/dropdown-menu'
import type { AvatarProps } from './Avatar.vue'
import type { IconProps } from './Icon.vue'
import type { InputProps } from './Input.vue'
import type { KbdProps } from './Kbd.vue'
import type { LinkProps } from './Link.vue'
import type { ArrayOrNested, DynamicSlots, GetItemKeys, MergeTypes, NestedItem, EmitsToProps } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type DropdownMenu = ComponentConfig<typeof theme, AppConfig, 'dropdownMenu'>

export interface DropdownMenuItem extends Omit<LinkProps, 'type' | 'raw' | 'custom' | 'ui'> {
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
  ui?: Partial<Pick<DropdownMenu['slots'], 'content' | 'item' | 'label' | 'separator' | 'itemLeadingIcon' | 'itemLeadingAvatar' | 'itemWrapper' | 'itemLabel' | 'itemDescription' | 'itemLabelExternalIcon' | 'itemTrailing' | 'itemTrailingIcon' | 'itemTrailingKbds'>>
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
   * `{ placeholder: t('dropdownMenu.filterPlaceholder'), autofocus: true, variant: 'soft' }`{lang="ts-type"}
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
import { computed, ref, toRef, watch } from 'vue'
import { defu } from 'defu'
import { DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuArrow, DropdownMenuPortal, DropdownMenuContent, DropdownMenuItem as RekaDropdownMenuItem, DropdownMenuGroup, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuItemIndicator, DropdownMenuLabel, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuFilter } from 'reka-ui'
import { createReusableTemplate } from '@vueuse/core'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../composables/useComponentProps'
import { useForwardProps } from '../composables/useForwardProps'
import { FieldGroupReset } from '../composables/useFieldGroup'
import { useFilter } from '../composables/useFilter'
import { useLocale } from '../composables/useLocale'
import { usePortal } from '../composables/usePortal'
import { omit, get, isArrayOfArray } from '../utils'
import { getAvatarSize, getItemSize } from '../utils/size'
import { pickLinkProps } from '../utils/link'
import { tv } from '../utils/tv'
import ULinkBase from './LinkBase.vue'
import ULink from './Link.vue'
import UAvatar from './Avatar.vue'
import UIcon from './Icon.vue'
import UInput from './Input.vue'
import UKbd from './Kbd.vue'

defineOptions({ inheritAttrs: false })

const DropdownMenu = { Portal: DropdownMenuPortal, Content: DropdownMenuContent, Item: RekaDropdownMenuItem, Group: DropdownMenuGroup, Separator: DropdownMenuSeparator, CheckboxItem: DropdownMenuCheckboxItem, ItemIndicator: DropdownMenuItemIndicator, Label: DropdownMenuLabel, Sub: DropdownMenuSub, SubContent: DropdownMenuSubContent, SubTrigger: DropdownMenuSubTrigger, Filter: DropdownMenuFilter }

const _props = withDefaults(defineProps<DropdownMenuProps<T>>(), {
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

const props = useComponentProps<DropdownMenuProps<T>>('dropdownMenu', _props, theme)

const { t, dir } = useLocale()
const appConfig = useThemeConfig()
const { filterGroups } = useFilter()
const overrides = useComponentOverrides((ui: DropdownMenu['AppConfig']['ui']) => ui.dropdownMenu)

const rootProps = useForwardProps(props, ['defaultOpen', 'open', 'modal'], emits)
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8, collisionPadding: 8 }) as DropdownMenuContentProps)
const arrowProps = toRef(() => defu(props.arrow, { rounded: true }) as DropdownMenuArrowProps)
const portalProps = usePortal(toRef(() => props.portal))

// Declared as props so the bindings are not inherited as attributes by the rendered root
const [DefineContentTemplate, ReuseContentTemplate] = createReusableTemplate<{ items?: ArrayOrNested<DropdownMenuItem>, path: string, filter?: DropdownMenuItem['filter'], filterFields?: string[], ignoreFilter?: boolean, content?: Record<string, any>, contentClass?: any }>({
  props: {
    items: Array,
    path: String,
    filter: [Boolean, Object],
    filterFields: Array,
    ignoreFilter: Boolean,
    content: Object,
    contentClass: null
  }
})
const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate<{ item: DropdownMenuItem, active?: boolean, index: number }>()

// The root search term is the `searchTerm` model, each submenu keeps its own keyed by its path
const subSearchTerms = ref<Record<string, string>>({})
const getSearchTerm = (path: string) => path ? (subSearchTerms.value[path] ?? '') : searchTerm.value
function setSearchTerm(path: string, value: string) {
  if (path) {
    subSearchTerms.value[path] = value
  } else {
    searchTerm.value = value
  }
}
// Clears the search terms of the submenus nested under `path`, which unmount with it
function resetSearchTerms(path = '') {
  subSearchTerms.value = Object.fromEntries(Object.entries(subSearchTerms.value).filter(([key]) => !key.startsWith(`${path}/`)))
}
watch(() => props.open, (open) => {
  if (!open) {
    resetSearchTerms()
  }
})

const childrenIcon = computed(() => dir.value === 'rtl' ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight)
const getFilterProps = (filter: DropdownMenuItem['filter']) => defu(filter, { placeholder: t('dropdownMenu.filterPlaceholder'), variant: 'soft' }) as Omit<InputProps, 'modelValue' | 'defaultValue'>
const isStructuralItem = (item: DropdownMenuItem) => !!item.type && ['label', 'separator'].includes(item.type)

function getFilteredGroups({ items, path, filter, filterFields, ignoreFilter }: { items?: ArrayOrNested<DropdownMenuItem>, path: string, filter?: DropdownMenuItem['filter'], filterFields?: string[], ignoreFilter?: boolean }) {
  const groups = (items?.length ? isArrayOfArray(items) ? items : [items] : []) as DropdownMenuItem[][]
  const term = getSearchTerm(path)

  if (!filter || ignoreFilter || !term) {
    return groups
  }

  const fields = Array.isArray(filterFields) && filterFields.length ? filterFields : [props.labelKey] as string[]

  return filterGroups(groups, term, {
    fields,
    isStructural: isStructuralItem
  })
}
const hasItems = (groups: DropdownMenuItem[][]) => groups.some(group => group.some(item => !isStructuralItem(item)))
const avatarSize = computed(() => getAvatarSize(props.size))
const itemSize = computed(() => getItemSize(props.size))

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({
  size: props.size
}))
</script>

<template>
  <DefineItemTemplate v-slot="{ item, active = false, index }">
    <slot :name="((item.slot || 'item') as keyof DropdownMenuSlots<T>)" :item="(item as Extract<NestedItem<T>, { slot: string; }>)" :active="active" :index="index" :ui="ui">
      <slot :name="((item.slot ? `${item.slot}-leading`: 'item-leading') as keyof DropdownMenuSlots<T>)" :item="(item as Extract<NestedItem<T>, { slot: string; }>)" :active="active" :index="index" :ui="ui">
        <UIcon v-if="item.loading" :name="props.loadingIcon || appConfig.ui.icons.loading" data-slot="dropdown-menu-itemLeadingIcon" :class="ui.itemLeadingIcon({ class: [props.ui?.itemLeadingIcon, item.ui?.itemLeadingIcon], color: item?.color, loading: true })" />
        <UIcon v-else-if="item.icon" :name="item.icon" data-slot="dropdown-menu-itemLeadingIcon" :class="ui.itemLeadingIcon({ class: [props.ui?.itemLeadingIcon, item.ui?.itemLeadingIcon], color: item?.color, active })" />
        <UAvatar v-else-if="item.avatar" :size="avatarSize" v-bind="item.avatar" data-slot="dropdown-menu-itemLeadingAvatar" :class="ui.itemLeadingAvatar({ class: [props.ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar], active })" />
      </slot>

      <span v-if="(get(item, props.labelKey as string) || !!slots[(item.slot ? `${item.slot}-label`: 'item-label') as keyof DropdownMenuSlots<T>]) || (get(item, props.descriptionKey as string) || !!slots[(item.slot ? `${item.slot}-description`: 'item-description') as keyof DropdownMenuSlots<T>])" data-slot="dropdown-menu-itemWrapper" :class="ui.itemWrapper({ class: [props.ui?.itemWrapper, item.ui?.itemWrapper] })">
        <span data-slot="dropdown-menu-itemLabel" :class="ui.itemLabel({ class: [props.ui?.itemLabel, item.ui?.itemLabel], active })">
          <slot :name="((item.slot ? `${item.slot}-label`: 'item-label') as keyof DropdownMenuSlots<T>)" :item="(item as Extract<NestedItem<T>, { slot: string; }>)" :active="active" :index="index">
            {{ get(item, props.labelKey as string) }}
          </slot>

          <UIcon v-if="item.target === '_blank' && props.externalIcon !== false" :name="typeof props.externalIcon === 'string' ? props.externalIcon : appConfig.ui.icons.external" data-slot="dropdown-menu-itemLabelExternalIcon" :class="ui.itemLabelExternalIcon({ class: [props.ui?.itemLabelExternalIcon, item.ui?.itemLabelExternalIcon], color: item?.color, active })" />
        </span>

        <span v-if="get(item, props.descriptionKey as string) || !!slots[(item.slot ? `${item.slot}-description`: 'item-description') as keyof DropdownMenuSlots<T>]" data-slot="dropdown-menu-itemDescription" :class="ui.itemDescription({ class: [props.ui?.itemDescription, item.ui?.itemDescription] })">
          <slot :name="((item.slot ? `${item.slot}-description`: 'item-description') as keyof DropdownMenuSlots<T>)" :item="(item as Extract<NestedItem<T>, { slot: string; }>)" :active="active" :index="index">
            {{ get(item, props.descriptionKey as string) }}
          </slot>
        </span>
      </span>

      <span data-slot="dropdown-menu-itemTrailing" :class="ui.itemTrailing({ class: [props.ui?.itemTrailing, item.ui?.itemTrailing] })">
        <slot :name="((item.slot ? `${item.slot}-trailing`: 'item-trailing') as keyof DropdownMenuSlots<T>)" :item="(item as Extract<NestedItem<T>, { slot: string; }>)" :active="active" :index="index" :ui="ui">
          <UIcon v-if="item.children?.length" :name="childrenIcon" data-slot="dropdown-menu-itemTrailingIcon" :class="ui.itemTrailingIcon({ class: [props.ui?.itemTrailingIcon, item.ui?.itemTrailingIcon], color: item?.color, active })" />
          <span v-else-if="item.kbds?.length" data-slot="dropdown-menu-itemTrailingKbds" :class="ui.itemTrailingKbds({ class: [props.ui?.itemTrailingKbds, item.ui?.itemTrailingKbds] })">
            <UKbd v-for="(kbd, kbdIndex) in item.kbds" :key="kbdIndex" :size="itemSize" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
          </span>
        </slot>

        <DropdownMenu.ItemIndicator as-child>
          <UIcon :name="props.checkedIcon || appConfig.ui.icons.check" data-slot="dropdown-menu-itemTrailingIcon" :class="ui.itemTrailingIcon({ class: [props.ui?.itemTrailingIcon, item.ui?.itemTrailingIcon], color: item?.color })" />
        </DropdownMenu.ItemIndicator>
      </span>
    </slot>
  </DefineItemTemplate>

  <DefineContentTemplate v-slot="level">
    <DropdownMenu.Portal v-bind="portalProps">
      <FieldGroupReset>
        <component :is="level.path ? DropdownMenu.SubContent : DropdownMenu.Content" data-slot="dropdown-menu-content" :class="ui.content({ class: [level.contentClass, level.content?.class] })" v-bind="omit(level.content ?? {}, ['class'])">
          <DropdownMenu.Filter v-if="!!level.filter" :model-value="getSearchTerm(level.path)" as-child @update:model-value="setSearchTerm(level.path, $event)">
            <UInput
              autofocus
              autocomplete="off"
              :size="props.size"
              v-bind="getFilterProps(level.filter)"
              data-slot="dropdown-menu-filter"
              :class="ui.filter({ class: props.ui?.filter })"
              @change.stop
            />
          </DropdownMenu.Filter>

          <slot name="content-top" :sub="!!level.path" />

          <div v-if="!getSearchTerm(level.path) || hasItems(getFilteredGroups(level))" role="presentation" data-slot="dropdown-menu-viewport" :class="ui.viewport({ class: props.ui?.viewport })">
            <DropdownMenu.Group v-for="(group, groupIndex) in getFilteredGroups(level)" :key="`group-${groupIndex}`" data-slot="dropdown-menu-group" :class="ui.group({ class: props.ui?.group })">
              <template v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`">
                <DropdownMenu.Label v-if="item.type === 'label'" data-slot="dropdown-menu-label" :class="ui.label({ class: [props.ui?.label, item.ui?.label, item.class], color: item?.color })">
                  <ReuseItemTemplate :item="item" :index="index" />
                </DropdownMenu.Label>
                <DropdownMenu.Separator v-else-if="item.type === 'separator'" data-slot="dropdown-menu-separator" :class="ui.separator({ class: [props.ui?.separator, item.ui?.separator, item.class] })" />
                <DropdownMenu.Sub v-else-if="item?.children?.length" :open="item.open" :default-open="item.defaultOpen" @update:open="!$event && resetSearchTerms(`${level.path}/${groupIndex}-${index}`)">
                  <DropdownMenu.SubTrigger
                    as="button"
                    type="button"
                    :disabled="item.disabled"
                    :text-value="get(item, props.labelKey as string)"
                    data-slot="dropdown-menu-item"
                    :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class], color: item?.color })"
                  >
                    <ReuseItemTemplate :item="item" :index="index" />
                  </DropdownMenu.SubTrigger>

                  <ReuseContentTemplate
                    :items="item.children"
                    :path="`${level.path}/${groupIndex}-${index}`"
                    :filter="item.filter"
                    :filter-fields="item.filterFields || level.filterFields"
                    :ignore-filter="item.ignoreFilter ?? level.ignoreFilter"
                    :content="{ align: 'start', alignOffset: -4, sideOffset: 3, ...item.content }"
                    :content-class="[props.ui?.content, item.ui?.content]"
                  />
                </DropdownMenu.Sub>
                <DropdownMenu.CheckboxItem
                  v-else-if="item.type === 'checkbox'"
                  :model-value="item.checked"
                  :disabled="item.disabled"
                  :text-value="get(item, props.labelKey as string)"
                  data-slot="dropdown-menu-item"
                  :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class], color: item?.color })"
                  @update:model-value="item.onUpdateChecked"
                  @select="item.onSelect"
                >
                  <ReuseItemTemplate :item="item" :index="index" />
                </DropdownMenu.CheckboxItem>
                <ULink v-else v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(item as Omit<DropdownMenuItem, 'type'>)" custom>
                  <DropdownMenu.Item
                    as-child
                    :disabled="item.disabled"
                    :text-value="get(item, props.labelKey as string)"
                    @select="item.onSelect"
                  >
                    <ULinkBase v-bind="slotProps" data-slot="dropdown-menu-item" :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class], color: item?.color, active })">
                      <ReuseItemTemplate :item="item" :active="active" :index="index" />
                    </ULinkBase>
                  </DropdownMenu.Item>
                </ULink>
              </template>
            </DropdownMenu.Group>
          </div>
          <div v-else data-slot="dropdown-menu-empty" :class="ui.empty({ class: props.ui?.empty })">
            <slot name="empty" :search-term="getSearchTerm(level.path)">
              {{ t('dropdownMenu.noMatch', { searchTerm: getSearchTerm(level.path) }) }}
            </slot>
          </div>

          <DropdownMenuArrow v-if="!level.path && !!props.arrow" v-bind="arrowProps" data-slot="dropdown-menu-arrow" :class="ui.arrow({ class: props.ui?.arrow })" />

          <slot name="content-bottom" :sub="!!level.path" />
        </component>
      </FieldGroupReset>
    </DropdownMenu.Portal>
  </DefineContentTemplate>

  <DropdownMenuRoot v-slot="{ open }" v-bind="{ ...rootProps, ...$attrs }" @update:open="!$event && resetSearchTerms()">
    <DropdownMenuTrigger v-if="!!slots.default" as-child :class="props.class" :disabled="props.disabled">
      <slot :open="open" />
    </DropdownMenuTrigger>

    <ReuseContentTemplate
      path=""
      :items="props.items"
      :filter="props.filter"
      :filter-fields="props.filterFields"
      :ignore-filter="props.ignoreFilter"
      :content="contentProps"
      :content-class="[!slots.default && props.class, props.ui?.content]"
    />
  </DropdownMenuRoot>
</template>
