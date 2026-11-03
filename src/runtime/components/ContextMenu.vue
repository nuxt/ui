<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { ContextMenuRootProps, ContextMenuRootEmits, ContextMenuContentProps, ContextMenuContentEmits } from 'reka-ui'
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '../theme/context-menu'
import type { AvatarProps } from './Avatar.vue'
import type { IconProps } from './Icon.vue'
import type { KbdProps } from './Kbd.vue'
import type { LinkProps } from './Link.vue'
import type { ArrayOrNested, DynamicSlots, GetItemKeys, MergeTypes, NestedItem, EmitsToProps } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type ContextMenu = ComponentConfig<typeof theme, AppConfig, 'contextMenu'>

export interface ContextMenuItem extends Omit<LinkProps, 'type' | 'raw' | 'custom' | 'ui'> {
  label?: string
  description?: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  color?: ContextMenu['variants']['color']
  avatar?: AvatarProps
  content?: Omit<ContextMenuContentProps, 'as' | 'asChild' | 'forceMount'> & { class?: any } & Partial<EmitsToProps<ContextMenuContentEmits>>
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
  children?: ArrayOrNested<ContextMenuItem>
  onSelect?: (e: Event) => void
  onUpdateChecked?: (checked: boolean) => void
  class?: any
  ui?: Partial<Pick<ContextMenu['slots'], 'content' | 'item' | 'label' | 'separator' | 'itemLeadingIcon' | 'itemLeadingAvatar' | 'itemWrapper' | 'itemLabel' | 'itemDescription' | 'itemLabelExternalIcon' | 'itemTrailing' | 'itemTrailingIcon' | 'itemTrailingKbds'>>
  [key: string]: any
}

export interface ContextMenuProps<T extends ArrayOrNested<ContextMenuItem> = ArrayOrNested<ContextMenuItem>> extends Omit<ContextMenuRootProps, 'dir'> {
  /**
   * @defaultValue 'md'
   */
  size?: ContextMenu['variants']['size']
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
  /** The content of the menu. */
  content?: Omit<ContextMenuContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<ContextMenuContentEmits>>
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
  disabled?: boolean
  class?: any
  ui?: ContextMenu['slots']
}

export interface ContextMenuEmits extends ContextMenuRootEmits {}

type SlotProps<T extends ContextMenuItem> = (props: { item: T, active: boolean, index: number, ui: ContextMenu['ui'] }) => VNode[]

export type ContextMenuSlots<
  A extends ArrayOrNested<ContextMenuItem> = ArrayOrNested<ContextMenuItem>,
  T extends NestedItem<A> = NestedItem<A>
> = {
  'default'?(props?: {}): VNode[]
  'item'?: SlotProps<T>
  'item-leading'?: SlotProps<T>
  'item-label'?: (props: { item: T, active: boolean, index: number }) => VNode[]
  'item-description'?: (props: { item: T, active: boolean, index: number }) => VNode[]
  'item-trailing'?: SlotProps<T>
  'content-top'?: (props: { sub: boolean }) => VNode[]
  'content-bottom'?: (props: { sub: boolean }) => VNode[]
}
& DynamicSlots<MergeTypes<T>, 'label' | 'description', { active: boolean, index: number }>
& DynamicSlots<MergeTypes<T>, 'leading' | 'trailing', { active: boolean, index: number, ui: ContextMenu['ui'] }>

</script>

<script setup lang="ts" generic="T extends ArrayOrNested<ContextMenuItem>">
import { computed, toRef } from 'vue'
import { ContextMenuRoot, ContextMenuTrigger, ContextMenuPortal, ContextMenuContent, ContextMenuItem as RekaContextMenuItem, ContextMenuGroup, ContextMenuSeparator, ContextMenuCheckboxItem, ContextMenuItemIndicator, ContextMenuLabel, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from 'reka-ui'
import { useForwardProps } from '../composables/useForwardProps'
import { reactivePick, createReusableTemplate } from '@vueuse/core'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../composables/useComponentProps'
import { FieldGroupReset } from '../composables/useFieldGroup'
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
import UKbd from './Kbd.vue'

defineOptions({ inheritAttrs: false })

const ContextMenu = { Portal: ContextMenuPortal, Content: ContextMenuContent, Item: RekaContextMenuItem, Group: ContextMenuGroup, Separator: ContextMenuSeparator, CheckboxItem: ContextMenuCheckboxItem, ItemIndicator: ContextMenuItemIndicator, Label: ContextMenuLabel, Sub: ContextMenuSub, SubContent: ContextMenuSubContent, SubTrigger: ContextMenuSubTrigger }

const _props = withDefaults(defineProps<ContextMenuProps<T>>(), {
  portal: true,
  modal: true,
  externalIcon: true,
  labelKey: 'label',
  descriptionKey: 'description'
})
const emits = defineEmits<ContextMenuEmits>()
const slots = defineSlots<ContextMenuSlots<T>>()

const props = useComponentProps<ContextMenuProps<T>>('contextMenu', _props, theme)

const { dir } = useLocale()
const appConfig = useThemeConfig()
const overrides = useComponentOverrides((ui: ContextMenu['AppConfig']['ui']) => ui.contextMenu)

const rootProps = useForwardProps(reactivePick(props, 'open', 'pressOpenDelay', 'modal'), emits)
const portalProps = usePortal(toRef(() => props.portal))

// Declared as props so the bindings are not inherited as attributes by the rendered root
const [DefineContentTemplate, ReuseContentTemplate] = createReusableTemplate<{ items?: ArrayOrNested<ContextMenuItem>, sub: boolean, content?: Record<string, any>, contentClass?: any }>({
  props: {
    items: Array,
    sub: Boolean,
    content: Object,
    contentClass: null
  }
})
const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate<{ item: ContextMenuItem, active?: boolean, index: number }>()

const childrenIcon = computed(() => dir.value === 'rtl' ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight)
const getGroups = (items?: ArrayOrNested<ContextMenuItem>) => (items?.length ? isArrayOfArray(items) ? items : [items] : []) as ContextMenuItem[][]
const avatarSize = computed(() => getAvatarSize(props.size))
const itemSize = computed(() => getItemSize(props.size))

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({
  size: props.size
}))
</script>

<template>
  <DefineItemTemplate v-slot="{ item, active, index }">
    <slot :name="((item.slot || 'item') as keyof ContextMenuSlots<T>)" :item="(item as Extract<NestedItem<T>, { slot: string; }>)" :index="index" :ui="ui">
      <slot :name="((item.slot ? `${item.slot}-leading`: 'item-leading') as keyof ContextMenuSlots<T>)" :item="(item as Extract<NestedItem<T>, { slot: string; }>)" :active="active" :index="index" :ui="ui">
        <UIcon v-if="item.loading" :name="props.loadingIcon || appConfig.ui.icons.loading" data-slot="context-menu-itemLeadingIcon" :class="ui.itemLeadingIcon({ class: [props.ui?.itemLeadingIcon, item.ui?.itemLeadingIcon], color: item?.color, loading: true })" />
        <UIcon v-else-if="item.icon" :name="item.icon" data-slot="context-menu-itemLeadingIcon" :class="ui.itemLeadingIcon({ class: [props.ui?.itemLeadingIcon, item.ui?.itemLeadingIcon], color: item?.color, active })" />
        <UAvatar v-else-if="item.avatar" :size="avatarSize" v-bind="item.avatar" data-slot="context-menu-itemLeadingAvatar" :class="ui.itemLeadingAvatar({ class: [props.ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar], active })" />
      </slot>

      <span v-if="(get(item, props.labelKey as string) || !!slots[(item.slot ? `${item.slot}-label`: 'item-label') as keyof ContextMenuSlots<T>]) || (get(item, props.descriptionKey as string) || !!slots[(item.slot ? `${item.slot}-description`: 'item-description') as keyof ContextMenuSlots<T>])" data-slot="context-menu-itemWrapper" :class="ui.itemWrapper({ class: [props.ui?.itemWrapper, item.ui?.itemWrapper] })">
        <span data-slot="context-menu-itemLabel" :class="ui.itemLabel({ class: [props.ui?.itemLabel, item.ui?.itemLabel], active })">
          <slot :name="((item.slot ? `${item.slot}-label`: 'item-label') as keyof ContextMenuSlots<T>)" :item="(item as Extract<NestedItem<T>, { slot: string; }>)" :active="active" :index="index">
            {{ get(item, props.labelKey as string) }}
          </slot>

          <UIcon v-if="item.target === '_blank' && props.externalIcon !== false" :name="typeof props.externalIcon === 'string' ? props.externalIcon : appConfig.ui.icons.external" data-slot="context-menu-itemLabelExternalIcon" :class="ui.itemLabelExternalIcon({ class: [props.ui?.itemLabelExternalIcon, item.ui?.itemLabelExternalIcon], color: item?.color, active })" />
        </span>

        <span v-if="get(item, props.descriptionKey as string) || !!slots[(item.slot ? `${item.slot}-description`: 'item-description') as keyof ContextMenuSlots<T>]" data-slot="context-menu-itemDescription" :class="ui.itemDescription({ class: [props.ui?.itemDescription, item.ui?.itemDescription] })">
          <slot :name="((item.slot ? `${item.slot}-description`: 'item-description') as keyof ContextMenuSlots<T>)" :item="(item as Extract<NestedItem<T>, { slot: string; }>)" :active="active" :index="index">
            {{ get(item, props.descriptionKey as string) }}
          </slot>
        </span>
      </span>

      <span data-slot="context-menu-itemTrailing" :class="ui.itemTrailing({ class: [props.ui?.itemTrailing, item.ui?.itemTrailing] })">
        <slot :name="((item.slot ? `${item.slot}-trailing`: 'item-trailing') as keyof ContextMenuSlots<T>)" :item="(item as Extract<NestedItem<T>, { slot: string; }>)" :active="active" :index="index" :ui="ui">
          <UIcon v-if="item.children?.length" :name="childrenIcon" data-slot="context-menu-itemTrailingIcon" :class="ui.itemTrailingIcon({ class: [props.ui?.itemTrailingIcon, item.ui?.itemTrailingIcon], color: item?.color, active })" />
          <span v-else-if="item.kbds?.length" data-slot="context-menu-itemTrailingKbds" :class="ui.itemTrailingKbds({ class: [props.ui?.itemTrailingKbds, item.ui?.itemTrailingKbds] })">
            <UKbd v-for="(kbd, kbdIndex) in item.kbds" :key="kbdIndex" :size="itemSize" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
          </span>
        </slot>

        <ContextMenu.ItemIndicator as-child>
          <UIcon :name="props.checkedIcon || appConfig.ui.icons.check" data-slot="context-menu-itemTrailingIcon" :class="ui.itemTrailingIcon({ class: [props.ui?.itemTrailingIcon, item.ui?.itemTrailingIcon], color: item?.color })" />
        </ContextMenu.ItemIndicator>
      </span>
    </slot>
  </DefineItemTemplate>

  <DefineContentTemplate v-slot="level">
    <ContextMenu.Portal v-bind="portalProps">
      <FieldGroupReset>
        <component :is="level.sub ? ContextMenu.SubContent : ContextMenu.Content" data-slot="context-menu-content" :class="ui.content({ class: [level.contentClass, level.content?.class] })" v-bind="omit(level.content ?? {}, ['class'])">
          <slot name="content-top" :sub="level.sub" />

          <div role="presentation" data-slot="context-menu-viewport" :class="ui.viewport({ class: props.ui?.viewport })">
            <ContextMenu.Group v-for="(group, groupIndex) in getGroups(level.items)" :key="`group-${groupIndex}`" data-slot="context-menu-group" :class="ui.group({ class: props.ui?.group })">
              <template v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`">
                <ContextMenu.Label v-if="item.type === 'label'" data-slot="context-menu-label" :class="ui.label({ class: [props.ui?.label, item.ui?.label, item.class], color: item?.color })">
                  <ReuseItemTemplate :item="item" :index="index" />
                </ContextMenu.Label>
                <ContextMenu.Separator v-else-if="item.type === 'separator'" data-slot="context-menu-separator" :class="ui.separator({ class: [props.ui?.separator, item.ui?.separator, item.class] })" />
                <ContextMenu.Sub v-else-if="item?.children?.length" :open="item.open" :default-open="item.defaultOpen">
                  <ContextMenu.SubTrigger
                    as="button"
                    type="button"
                    :disabled="item.disabled"
                    :text-value="get(item, props.labelKey as string)"
                    data-slot="context-menu-item"
                    :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class], color: item?.color })"
                  >
                    <ReuseItemTemplate :item="item" :index="index" />
                  </ContextMenu.SubTrigger>

                  <ReuseContentTemplate
                    sub
                    :items="item.children"
                    :content="{ alignOffset: -4, ...item.content }"
                    :content-class="[props.ui?.content, item.ui?.content]"
                  />
                </ContextMenu.Sub>
                <ContextMenu.CheckboxItem
                  v-else-if="item.type === 'checkbox'"
                  :model-value="item.checked"
                  :disabled="item.disabled"
                  :text-value="get(item, props.labelKey as string)"
                  data-slot="context-menu-item"
                  :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class], color: item?.color })"
                  @update:model-value="item.onUpdateChecked"
                  @select="item.onSelect"
                >
                  <ReuseItemTemplate :item="item" :index="index" />
                </ContextMenu.CheckboxItem>
                <ULink v-else v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(item as Omit<ContextMenuItem, 'type'>)" custom>
                  <ContextMenu.Item
                    as-child
                    :disabled="item.disabled"
                    :text-value="get(item, props.labelKey as string)"
                    @select="item.onSelect"
                  >
                    <ULinkBase v-bind="slotProps" data-slot="context-menu-item" :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class], active, color: item?.color })">
                      <ReuseItemTemplate :item="item" :active="active" :index="index" />
                    </ULinkBase>
                  </ContextMenu.Item>
                </ULink>
              </template>
            </ContextMenu.Group>
          </div>

          <slot name="content-bottom" :sub="level.sub" />
        </component>
      </FieldGroupReset>
    </ContextMenu.Portal>
  </DefineContentTemplate>

  <ContextMenuRoot v-bind="{ ...rootProps, ...$attrs }">
    <ContextMenuTrigger v-if="!!slots.default" as-child :disabled="props.disabled" :class="props.class">
      <slot />
    </ContextMenuTrigger>

    <ReuseContentTemplate
      :sub="false"
      :items="props.items"
      :content="props.content"
      :content-class="[!slots.default && props.class, props.ui?.content]"
    />
  </ContextMenuRoot>
</template>
