<script lang="ts">
import type { SelectRootProps, SelectRootEmits, SelectContentProps, SelectContentEmits, SelectArrowProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/select'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps, ChipProps, IconProps, InputProps } from '../types'
import type { ButtonHTMLAttributes } from '../types/html'
import type { AcceptableValue, ArrayOrNested, GetItemKeys, GetItemValue, GetModelValue, GetModelValueEmits, NestedItem, EmitsToProps } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type Select = ComponentConfig<typeof theme, AppConfig, 'select'>

export type SelectValue = AcceptableValue

export type SelectItem = SelectValue | {
  label?: string
  description?: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  avatar?: AvatarProps
  chip?: ChipProps
  /**
   * The item type.
   * @defaultValue 'item'
   */
  type?: 'label' | 'separator' | 'item'
  value?: SelectValue
  disabled?: boolean
  onSelect?: (e: Event) => void
  class?: any
  ui?: Pick<Select['slots'], 'label' | 'separator' | 'item' | 'itemLeadingIcon' | 'itemLeadingAvatarSize' | 'itemLeadingAvatar' | 'itemLeadingChipSize' | 'itemLeadingChip' | 'itemWrapper' | 'itemLabel' | 'itemDescription' | 'itemTrailing' | 'itemTrailingIcon'>
  [key: string]: any
}

export interface SelectProps<T extends ArrayOrNested<SelectItem> = ArrayOrNested<SelectItem>, VK extends GetItemKeys<T> = 'value', M extends boolean = false> extends Omit<SelectRootProps<T>, 'dir' | 'multiple' | 'modelValue' | 'defaultValue' | 'by'>, UseComponentIconsProps, /** @vue-ignore */ Omit<ButtonHTMLAttributes, 'type' | 'disabled' | 'name'> {
  id?: string
  /** The placeholder text when the select is empty. */
  placeholder?: string
  /**
   * @defaultValue 'primary'
   */
  color?: Select['variants']['color']
  /**
   * @defaultValue 'outline'
   */
  variant?: Select['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: Select['variants']['size']
  /**
   * The icon displayed to open the menu.
   * @defaultValue appConfig.ui.icons.chevronDown
   * @IconifyIcon
   */
  trailingIcon?: IconProps['name']
  /**
   * The icon displayed when an item is selected.
   * @defaultValue appConfig.ui.icons.check
   * @IconifyIcon
   */
  selectedIcon?: IconProps['name']
  /**
   * The content of the menu.
   * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8, position: 'popper' }
   */
  content?: Omit<SelectContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<SelectContentEmits>>
  /**
   * Display an arrow alongside the menu.
   * @defaultValue false
   */
  arrow?: boolean | Omit<SelectArrowProps, 'as' | 'asChild'>
  /**
   * Render the menu in a portal.
   * @defaultValue true
   */
  portal?: boolean | string | HTMLElement
  /**
   * When `items` is an array of objects, select the field to use as the value.
   * @defaultValue 'value'
   */
  valueKey?: VK
  /**
   * When `items` is an array of objects, select the field to use as the label.
   * @defaultValue 'label'
   */
  labelKey?: GetItemKeys<T>
  /**
   * When `items` is an array of objects, select the field to use as the description.
   * @defaultValue 'description'
   */
  descriptionKey?: GetItemKeys<T>
  items?: T
  /** The value of the Select when initially rendered. Use when you do not need to control the state of the Select. */
  defaultValue?: GetModelValue<T, VK, M>
  /** The controlled value of the Select. Can be bind as `v-model`. */
  modelValue?: GetModelValue<T, VK, M>
  /** Whether multiple options can be selected or not. */
  multiple?: M & boolean
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  autofocus?: boolean
  autofocusDelay?: number
  class?: any
  ui?: Select['slots']
}

export type SelectEmits<A extends ArrayOrNested<SelectItem>, VK extends GetItemKeys<A> | undefined, M extends boolean> = Omit<SelectRootEmits, 'update:modelValue'> & {
  change: [event: Event]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
} & GetModelValueEmits<A, VK, M>

type SlotProps<T extends SelectItem> = (props: { item: T, index: number, ui: Select['ui'] }) => any

export interface SelectSlots<
  A extends ArrayOrNested<SelectItem> = ArrayOrNested<SelectItem>,
  VK extends GetItemKeys<A> | undefined = undefined,
  M extends boolean = false,
  T extends NestedItem<A> = NestedItem<A>
> {
  'leading'(props: { modelValue?: GetModelValue<A, VK, M>, open: boolean, ui: Select['ui'] }): any
  'default'(props: { modelValue?: GetModelValue<A, VK, M>, open: boolean, ui: Select['ui'] }): any
  'trailing'(props: { modelValue?: GetModelValue<A, VK, M>, open: boolean, ui: Select['ui'] }): any
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label'(props: { item: T, index: number }): any
  'item-description'(props: { item: T, index: number }): any
  'item-trailing': SlotProps<T>
  'content-top': (props?: {}) => any
  'content-bottom': (props?: {}) => any
}
</script>

<script setup lang="ts" generic="T extends ArrayOrNested<SelectItem>, VK extends GetItemKeys<T> = 'value', M extends boolean = false">
import { useTemplateRef, computed, onMounted, toRef } from 'vue'
import { SelectRoot, SelectArrow, SelectTrigger, SelectPortal, SelectContent, SelectLabel, SelectGroup, SelectItem as RSelectItem, SelectItemIndicator, SelectItemText, SelectSeparator, useForwardPropsEmits } from 'reka-ui'
import { defu } from 'defu'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useFieldGroup } from '../composables/useFieldGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { usePortal } from '../composables/usePortal'
import { get, getDisplayValue, isArrayOfArray } from '../utils'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UChip from './Chip.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SelectProps<T, VK, M>>(), {
  valueKey: 'value' as never,
  labelKey: 'label',
  descriptionKey: 'description',
  portal: true,
  autofocusDelay: 0
})
const emits = defineEmits<SelectEmits<T, VK, M>>()
const slots = defineSlots<SelectSlots<T, VK, M>>()

const appConfig = useAppConfig() as Select['AppConfig']

const rootProps = useForwardPropsEmits(reactivePick(props, 'open', 'defaultOpen', 'disabled', 'autocomplete', 'required', 'multiple'), emits)
const portalProps = usePortal(toRef(() => props.portal))
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8, collisionPadding: 8, position: 'popper' }) as SelectContentProps)
const arrowProps = toRef(() => props.arrow as SelectArrowProps)

const { emitFormChange, emitFormInput, emitFormBlur, emitFormFocus, size: formGroupSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField<InputProps>(props)
const { orientation, size: fieldGroupSize } = useFieldGroup<InputProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(toRef(() => defu(props, { trailingIcon: appConfig.ui.icons.chevronDown })))

const selectSize = computed(() => fieldGroupSize.value || formGroupSize.value)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.select || {}) })({
  color: color.value,
  variant: props.variant,
  size: selectSize?.value,
  loading: props.loading,
  highlight: highlight.value,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  fieldGroup: orientation.value
}))

const groups = computed<SelectItem[][]>(() =>
  props.items?.length
    ? isArrayOfArray(props.items)
      ? props.items
      : [props.items]
    : []
)
// eslint-disable-next-line vue/no-dupe-keys
const items = computed(() => groups.value.flatMap(group => group) as T[])

function displayValue(value: GetItemValue<T, VK> | GetItemValue<T, VK>[]): string | undefined {
  if (props.multiple && Array.isArray(value)) {
    const displayedValues = value
      .map(item => getDisplayValue<T[], GetItemValue<T, VK>>(items.value, item, {
        labelKey: props.labelKey,
        valueKey: props.valueKey
      }))
      .filter((v): v is string => v != null && v !== '')

    return displayedValues.length > 0 ? displayedValues.join(', ') : undefined
  }

  return getDisplayValue<T[], GetItemValue<T, VK>>(items.value, value as GetItemValue<T, VK>, {
    labelKey: props.labelKey,
    valueKey: props.valueKey
  })
}

const triggerRef = useTemplateRef('triggerRef')

function autoFocus() {
  if (props.autofocus) {
    triggerRef.value?.$el?.focus({
      focusVisible: true
    })
  }
}

onMounted(() => {
  setTimeout(() => {
    autoFocus()
  }, props.autofocusDelay)
})

function onUpdate(value: any) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)

  emitFormChange()
  emitFormInput()
}
function onUpdateOpen(value: boolean) {
  if (!value) {
    const event = new FocusEvent('blur')
    emits('blur', event)
    emitFormBlur()
  } else {
    const event = new FocusEvent('focus')
    emits('focus', event)
    emitFormFocus()
  }
}

function isSelectItem(item: SelectItem): item is Exclude<SelectItem, SelectValue> {
  return typeof item === 'object' && item !== null
}

defineExpose({
  triggerRef: toRef(() => triggerRef.value?.$el as HTMLButtonElement)
})
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <SelectRoot
    v-slot="{ modelValue, open }"
    :name="name"
    v-bind="rootProps"
    :autocomplete="autocomplete"
    :disabled="disabled"
    :default-value="(defaultValue as Exclude<SelectItem, boolean> | Exclude<SelectItem, boolean>[])"
    :model-value="(modelValue as Exclude<SelectItem, boolean> | Exclude<SelectItem, boolean>[])"
    @update:model-value="onUpdate"
    @update:open="onUpdateOpen"
  >
    <SelectTrigger
      :id="id"
      ref="triggerRef"
      data-slot="base"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
      v-bind="{ ...$attrs, ...ariaAttrs }"
    >
      <span v-if="isLeading || !!avatar || !!slots.leading" data-slot="leading" :class="ui.leading({ class: props.ui?.leading })">
        <slot name="leading" :model-value="(modelValue as GetModelValue<T, VK, M>)" :open="open" :ui="ui">
          <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
          <UAvatar v-else-if="!!avatar" :size="((props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="avatar" data-slot="itemLeadingAvatar" :class="ui.itemLeadingAvatar({ class: props.ui?.itemLeadingAvatar })" />
        </slot>
      </span>

      <slot :model-value="(modelValue as GetModelValue<T, VK, M>)" :open="open" :ui="ui">
        <template v-for="displayedModelValue in [displayValue(modelValue as GetModelValue<T, VK, M>)]" :key="displayedModelValue">
          <span v-if="displayedModelValue !== undefined && displayedModelValue !== null" data-slot="value" :class="ui.value({ class: props.ui?.value })">
            {{ displayedModelValue }}
          </span>
          <span v-else data-slot="placeholder" :class="ui.placeholder({ class: props.ui?.placeholder })">
            {{ placeholder ?? '&nbsp;' }}
          </span>
        </template>
      </slot>

      <span v-if="isTrailing || !!slots.trailing" data-slot="trailing" :class="ui.trailing({ class: props.ui?.trailing })">
        <slot name="trailing" :model-value="(modelValue as GetModelValue<T, VK, M>)" :open="open" :ui="ui">
          <UIcon v-if="trailingIconName" :name="trailingIconName" data-slot="trailingIcon" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
        </slot>
      </span>
    </SelectTrigger>

    <SelectPortal v-bind="portalProps">
      <SelectContent data-slot="content" :class="ui.content({ class: props.ui?.content })" v-bind="contentProps">
        <slot name="content-top" />

        <div role="presentation" data-slot="viewport" :class="ui.viewport({ class: props.ui?.viewport })">
          <SelectGroup v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`" data-slot="group" :class="ui.group({ class: props.ui?.group })">
            <template v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`">
              <SelectLabel v-if="isSelectItem(item) && item.type === 'label'" data-slot="label" :class="ui.label({ class: [props.ui?.label, item.ui?.label, item.class] })">
                {{ get(item, props.labelKey as string) }}
              </SelectLabel>

              <SelectSeparator v-else-if="isSelectItem(item) && item.type === 'separator'" data-slot="separator" :class="ui.separator({ class: [props.ui?.separator, item.ui?.separator, item.class] })" />

              <RSelectItem
                v-else
                data-slot="item"
                :class="ui.item({ class: [props.ui?.item, isSelectItem(item) && item.ui?.item, isSelectItem(item) && item.class] })"
                :disabled="isSelectItem(item) && item.disabled"
                :value="isSelectItem(item) ? get(item, props.valueKey as string) : item"
                @select="isSelectItem(item) && item.onSelect?.($event)"
              >
                <slot name="item" :item="(item as NestedItem<T>)" :index="index" :ui="ui">
                  <slot name="item-leading" :item="(item as NestedItem<T>)" :index="index" :ui="ui">
                    <UIcon v-if="isSelectItem(item) && item.icon" :name="item.icon" data-slot="itemLeadingIcon" :class="ui.itemLeadingIcon({ class: [props.ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })" />
                    <UAvatar v-else-if="isSelectItem(item) && item.avatar" :size="((item.ui?.itemLeadingAvatarSize || props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" data-slot="itemLeadingAvatar" :class="ui.itemLeadingAvatar({ class: [props.ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })" />
                    <UChip
                      v-else-if="isSelectItem(item) && item.chip"
                      :size="((item.ui?.itemLeadingChipSize || props.ui?.itemLeadingChipSize || ui.itemLeadingChipSize()) as ChipProps['size'])"
                      inset
                      standalone
                      v-bind="item.chip"
                      data-slot="itemLeadingChip"
                      :class="ui.itemLeadingChip({ class: [props.ui?.itemLeadingChip, item.ui?.itemLeadingChip] })"
                    />
                  </slot>

                  <span data-slot="itemWrapper" :class="ui.itemWrapper({ class: [props.ui?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })">
                    <SelectItemText data-slot="itemLabel" :class="ui.itemLabel({ class: [props.ui?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })">
                      <slot name="item-label" :item="(item as NestedItem<T>)" :index="index">
                        {{ isSelectItem(item) ? get(item, props.labelKey as string) : item }}
                      </slot>
                    </SelectItemText>

                    <span v-if="isSelectItem(item) && (get(item, props.descriptionKey as string) || !!slots['item-description'])" data-slot="itemDescription" :class="ui.itemDescription({ class: [props.ui?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })">
                      <slot name="item-description" :item="(item as NestedItem<T>)" :index="index">
                        {{ get(item, props.descriptionKey as string) }}
                      </slot>
                    </span>
                  </span>

                  <span data-slot="itemTrailing" :class="ui.itemTrailing({ class: [props.ui?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })">
                    <slot name="item-trailing" :item="(item as NestedItem<T>)" :index="index" :ui="ui" />

                    <SelectItemIndicator as-child>
                      <UIcon :name="selectedIcon || appConfig.ui.icons.check" data-slot="itemTrailingIcon" :class="ui.itemTrailingIcon({ class: [props.ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })" />
                    </SelectItemIndicator>
                  </span>
                </slot>
              </RSelectItem>
            </template>
          </SelectGroup>
        </div>

        <slot name="content-bottom" />

        <SelectArrow v-if="!!arrow" v-bind="arrowProps" data-slot="arrow" :class="ui.arrow({ class: props.ui?.arrow })" />
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
