<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { SelectRootProps, SelectRootEmits, SelectContentProps, SelectArrowProps, AcceptableValue } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/select'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'
import type { AvatarProps, ChipProps, InputProps } from '../types'
import type { PartialString, MaybeArrayOfArray, MaybeArrayOfArrayItem, SelectModelValue, SelectModelValueEmits, SelectItemKey } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { select: Partial<typeof theme> } }

const select = tv({ extend: tv(theme), ...(appConfig.ui?.select || {}) })

export interface SelectItem {
  label?: string
  icon?: string
  avatar?: AvatarProps
  chip?: ChipProps
  /**
   * The item type.
   * @defaultValue 'item'
   */
  type?: 'label' | 'separator' | 'item'
  value?: string
  disabled?: boolean
}

type SelectVariants = VariantProps<typeof select>

export interface SelectProps<T extends MaybeArrayOfArrayItem<I>, I extends MaybeArrayOfArray<SelectItem | AcceptableValue | boolean> = MaybeArrayOfArray<SelectItem | AcceptableValue | boolean>, V extends SelectItemKey<T> | undefined = undefined, M extends boolean = false> extends Omit<SelectRootProps<T>, 'dir' | 'multiple' | 'modelValue' | 'defaultValue' | 'by'>, UseComponentIconsProps {
  id?: string
  /** The placeholder text when the select is empty. */
  placeholder?: string
  color?: SelectVariants['color']
  variant?: SelectVariants['variant']
  size?: SelectVariants['size']
  /**
   * The icon displayed to open the menu.
   * @defaultValue appConfig.ui.icons.chevronDown
   */
  trailingIcon?: string
  /**
   * The icon displayed when an item is selected.
   * @defaultValue appConfig.ui.icons.check
   */
  selectedIcon?: string
  /**
   * The content of the menu.
   * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8, position: 'popper' }
   */
  content?: Omit<SelectContentProps, 'as' | 'asChild' | 'forceMount'>
  /**
   * Display an arrow alongside the menu.
   * @defaultValue false
   */
  arrow?: boolean | Omit<SelectArrowProps, 'as' | 'asChild'>
  /**
   * Render the menu in a portal.
   * @defaultValue true
   */
  portal?: boolean
  /**
   * When `items` is an array of objects, select the field to use as the value.
   * @defaultValue 'value'
   */
  valueKey?: V
  /**
   * When `items` is an array of objects, select the field to use as the label.
   * @defaultValue 'label'
   */
  labelKey?: V
  items?: I
  /** The value of the Select when initially rendered. Use when you do not need to control the state of the Select. */
  defaultValue?: SelectModelValue<T, V, M, T extends { value: infer U } ? U : never>
  /** The controlled value of the Select. Can be bind as `v-model`. */
  modelValue?: SelectModelValue<T, V, M, T extends { value: infer U } ? U : never>
  /** Whether multiple options can be selected or not. */
  multiple?: M & boolean
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  class?: any
  ui?: PartialString<typeof select.slots>
}

export type SelectEmits<T, V, M extends boolean> = Omit<SelectRootEmits<T>, 'update:modelValue'> & {
  change: [payload: Event]
  blur: [payload: FocusEvent]
  focus: [payload: FocusEvent]
} & SelectModelValueEmits<T, V, M, T extends { value: infer U } ? U : never>

type SlotProps<T> = (props: { item: T, index: number }) => any

export interface SelectSlots<T, M extends boolean> {
  'leading'(props: { modelValue?: M extends true ? AcceptableValue[] : AcceptableValue, open: boolean, ui: any }): any
  'default'(props: { modelValue?: M extends true ? AcceptableValue[] : AcceptableValue, open: boolean }): any
  'trailing'(props: { modelValue?: M extends true ? AcceptableValue[] : AcceptableValue, open: boolean, ui: any }): any
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
}

extendDevtoolsMeta({ defaultProps: { items: ['Option 1', 'Option 2', 'Option 3'] } })
</script>

<script setup lang="ts" generic="T extends MaybeArrayOfArrayItem<I>, I extends MaybeArrayOfArray<SelectItem | AcceptableValue | boolean> = MaybeArrayOfArray<SelectItem | AcceptableValue | boolean>, V extends SelectItemKey<T> | undefined = undefined, M extends boolean = false">
import { computed, toRef } from 'vue'
import { SelectRoot, SelectArrow, SelectTrigger, SelectPortal, SelectContent, SelectViewport, SelectLabel, SelectGroup, SelectItem, SelectItemIndicator, SelectItemText, SelectSeparator, useForwardPropsEmits } from 'reka-ui'
import { defu } from 'defu'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useButtonGroup } from '../composables/useButtonGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { get, compare } from '../utils'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UChip from './Chip.vue'

const props = withDefaults(defineProps<SelectProps<T, I, V, M>>(), {
  valueKey: 'value' as never,
  labelKey: 'label' as never,
  portal: true
})
const emits = defineEmits<SelectEmits<T, V, M>>()
const slots = defineSlots<SelectSlots<T, M>>()

const appConfig = useAppConfig()
const rootProps = useForwardPropsEmits(reactivePick(props, 'modelValue', 'defaultValue', 'open', 'defaultOpen', 'disabled', 'autocomplete', 'required', 'multiple'), emits)
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8, collisionPadding: 8, position: 'popper' }) as SelectContentProps)
const arrowProps = toRef(() => props.arrow as SelectArrowProps)

const { emitFormChange, emitFormInput, emitFormBlur, size: formGroupSize, color, id, name, highlight, disabled } = useFormField<InputProps>(props)
const { orientation, size: buttonGroupSize } = useButtonGroup<InputProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(toRef(() => defu(props, { trailingIcon: appConfig.ui.icons.chevronDown })))

const selectSize = computed(() => buttonGroupSize.value || formGroupSize.value)

const ui = computed(() => select({
  color: color.value,
  variant: props.variant,
  size: selectSize?.value,
  loading: props.loading,
  highlight: highlight.value,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  buttonGroup: orientation.value
}))

const groups = computed(() => props.items?.length ? (Array.isArray(props.items[0]) ? props.items : [props.items]) as SelectItem[][] : [])
// eslint-disable-next-line vue/no-dupe-keys
const items = computed(() => groups.value.flatMap(group => group) as T[])

function displayValue(value?: AcceptableValue | AcceptableValue[]): string | undefined {
  if (props.multiple && Array.isArray(value)) {
    return value.map(v => displayValue(v)).filter(Boolean).join(', ')
  }

  const item = items.value.find(item => compare(typeof item === 'object' ? get(item, props.valueKey as string) : item, value))
  return item && (typeof item === 'object' ? get(item, props.labelKey as string) : item)
}

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
  }
}
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <SelectRoot
    :id="id"
    v-slot="{ modelValue, open }"
    v-bind="rootProps"
    :name="name"
    :autocomplete="autocomplete"
    :disabled="disabled"
    @update:model-value="onUpdate"
    @update:open="onUpdateOpen"
  >
    <SelectTrigger :class="ui.base({ class: [props.class, props.ui?.base] })">
      <span v-if="isLeading || !!avatar || !!slots.leading" :class="ui.leading({ class: props.ui?.leading })">
        <slot name="leading" :model-value="(modelValue as M extends true ? AcceptableValue[] : AcceptableValue)" :open="open" :ui="ui">
          <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
          <UAvatar v-else-if="!!avatar" :size="((props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="avatar" :class="ui.itemLeadingAvatar({ class: props.ui?.itemLeadingAvatar })" />
        </slot>
      </span>

      <slot :model-value="(modelValue as M extends true ? AcceptableValue[] : AcceptableValue)" :open="open">
        <template v-for="displayedModelValue in [displayValue(modelValue)]" :key="displayedModelValue">
          <span v-if="displayedModelValue" :class="ui.value({ class: props.ui?.value })">
            {{ displayedModelValue }}
          </span>
          <span v-else :class="ui.placeholder({ class: props.ui?.placeholder })">
            {{ placeholder ?? '&nbsp;' }}
          </span>
        </template>
      </slot>

      <span v-if="isTrailing || !!slots.trailing" :class="ui.trailing({ class: props.ui?.trailing })">
        <slot name="trailing" :model-value="(modelValue as M extends true ? AcceptableValue[] : AcceptableValue)" :open="open" :ui="ui">
          <UIcon v-if="trailingIconName" :name="trailingIconName" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
        </slot>
      </span>
    </SelectTrigger>

    <SelectPortal :disabled="!portal">
      <SelectContent :class="ui.content({ class: props.ui?.content })" v-bind="contentProps">
        <SelectViewport :class="ui.viewport({ class: props.ui?.viewport })">
          <SelectGroup v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`" :class="ui.group({ class: props.ui?.group })">
            <template v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`">
              <SelectLabel v-if="item?.type === 'label'" :class="ui.label({ class: props.ui?.label })">
                {{ get(item, props.labelKey as string) }}
              </SelectLabel>

              <SelectSeparator v-else-if="item?.type === 'separator'" :class="ui.separator({ class: props.ui?.separator })" />

              <SelectItem
                v-else
                :class="ui.item({ class: props.ui?.item })"
                :disabled="item.disabled"
                :value="typeof item === 'object' ? get(item, props.valueKey as string) : item"
              >
                <slot name="item" :item="(item as T)" :index="index">
                  <slot name="item-leading" :item="(item as T)" :index="index">
                    <UIcon v-if="item.icon" :name="item.icon" :class="ui.itemLeadingIcon({ class: props.ui?.itemLeadingIcon })" />
                    <UAvatar v-else-if="item.avatar" :size="((props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" :class="ui.itemLeadingAvatar({ class: props.ui?.itemLeadingAvatar })" />
                    <UChip
                      v-else-if="item.chip"
                      :size="((props.ui?.itemLeadingChipSize || ui.itemLeadingChipSize()) as ChipProps['size'])"
                      inset
                      standalone
                      v-bind="item.chip"
                      :class="ui.itemLeadingChip({ class: props.ui?.itemLeadingChip })"
                    />
                  </slot>

                  <SelectItemText :class="ui.itemLabel({ class: props.ui?.itemLabel })">
                    <slot name="item-label" :item="(item as T)" :index="index">
                      {{ typeof item === 'object' ? get(item, props.labelKey as string) : item }}
                    </slot>
                  </SelectItemText>

                  <span :class="ui.itemTrailing({ class: props.ui?.itemTrailing })">
                    <slot name="item-trailing" :item="(item as T)" :index="index" />

                    <SelectItemIndicator as-child>
                      <UIcon :name="selectedIcon || appConfig.ui.icons.check" :class="ui.itemTrailingIcon({ class: props.ui?.itemTrailingIcon })" />
                    </SelectItemIndicator>
                  </span>
                </slot>
              </SelectItem>
            </template>
          </SelectGroup>
        </SelectViewport>

        <SelectArrow v-if="!!arrow" v-bind="arrowProps" :class="ui.arrow({ class: props.ui?.arrow })" />
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
