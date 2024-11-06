<script lang="ts">
import type { InputHTMLAttributes } from 'vue'
import { tv, type VariantProps } from 'tailwind-variants'
import type { ComboboxRootProps, ComboboxRootEmits, ComboboxContentProps, ComboboxArrowProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/input-menu'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'
import type { AvatarProps, ChipProps, InputProps } from '../types'
import type { AcceptableValue, ArrayOrWrapped, PartialString, MaybeArrayOfArray, MaybeArrayOfArrayItem, SelectModelValue, SelectModelValueEmits, SelectItemKey } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { inputMenu: Partial<typeof theme> } }

const inputMenu = tv({ extend: tv(theme), ...(appConfig.ui?.inputMenu || {}) })

export interface InputMenuItem {
  label?: string
  icon?: string
  avatar?: AvatarProps
  chip?: ChipProps
  /**
   * The item type.
   * @defaultValue 'item'
   */
  type?: 'label' | 'separator' | 'item'
  disabled?: boolean
  onSelect?(e?: Event): void
}

type InputMenuVariants = VariantProps<typeof inputMenu>

export interface InputMenuProps<T extends MaybeArrayOfArrayItem<I>, I extends MaybeArrayOfArray<InputMenuItem | AcceptableValue> = MaybeArrayOfArray<InputMenuItem | AcceptableValue>, V extends SelectItemKey<T> | undefined = undefined, M extends boolean = false> extends Pick<ComboboxRootProps<T>, 'defaultValue' | 'selectedValue' | 'open' | 'defaultOpen' | 'searchTerm' | 'disabled' | 'name' | 'resetSearchTermOnBlur'>, UseComponentIconsProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  id?: string
  type?: InputHTMLAttributes['type']
  /** The placeholder text when the input is empty. */
  placeholder?: string
  color?: InputMenuVariants['color']
  variant?: InputMenuVariants['variant']
  size?: InputMenuVariants['size']
  required?: boolean
  autofocus?: boolean
  autofocusDelay?: number
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
   * The icon displayed to delete a tag.
   * Works only when `multiple` is `true`.
   * @defaultValue appConfig.ui.icons.close
   */
  deleteIcon?: string
  /**
   * The content of the menu.
   * @defaultValue { side: 'bottom', sideOffset: 8, position: 'popper' }
   */
  content?: Omit<ComboboxContentProps, 'as' | 'asChild' | 'forceMount'>
  /**
   * Display an arrow alongside the menu.
   * @defaultValue false
   */
  arrow?: boolean | Omit<ComboboxArrowProps, 'as' | 'asChild'>
  /**
   * Render the menu in a portal.
   * @defaultValue true
   */
  portal?: boolean
  /**
   * Whether to filter items or not, can be an array of fields to filter.
   * When `false`, items will not be filtered which is useful for custom filtering.
   * @defaultValue ['label']
   */
  filter?: boolean | string[]
  /**
   * When `items` is an array of objects, select the field to use as the value instead of the object itself.
   * @defaultValue undefined
   */
  valueKey?: V
  /**
   * When `items` is an array of objects, select the field to use as the label.
   * @defaultValue 'label'
   */
  labelKey?: keyof T
  items?: I
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  /**
   * Determines if custom user input that does not exist in options can be added.
   * @defaultValue false
   */
  createItem?: boolean | 'always' | { placement?: 'top' | 'bottom', when?: 'empty' | 'always' }
  class?: any
  ui?: PartialString<typeof inputMenu.slots>
  /** The controlled value of the Combobox. Can be binded-with with `v-model`. */
  modelValue?: SelectModelValue<T, V, M>
  /** Whether multiple options can be selected or not. */
  multiple?: M
}

export type InputMenuEmits<T, V, M extends boolean> = Omit<ComboboxRootEmits<T>, 'update:modelValue'> & {
  change: [payload: Event]
  blur: [payload: FocusEvent]
  focus: [payload: FocusEvent]
  create: [value: T]
} & SelectModelValueEmits<T, V, M>

type SlotProps<T> = (props: { item: T, index: number }) => any

export interface InputMenuSlots<T> {
  'leading'(props: { modelValue: T, open: boolean, ui: any }): any
  'trailing'(props: { modelValue: T, open: boolean, ui: any }): any
  'empty'(props: { searchTerm?: string }): any
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
  'tags-item-text': SlotProps<T>
  'tags-item-delete': SlotProps<T>
  'create-item-label'(props: { item: T }): any
}

extendDevtoolsMeta({ defaultProps: { items: ['Option 1', 'Option 2', 'Option 3'] } })
</script>

<script setup lang="ts" generic="T extends MaybeArrayOfArrayItem<I>, I extends MaybeArrayOfArray<InputMenuItem | AcceptableValue> = MaybeArrayOfArray<InputMenuItem | AcceptableValue>, V extends SelectItemKey<T> | undefined = undefined, M extends boolean = false">
import { computed, ref, toRef, onMounted, toRaw } from 'vue'
import { ComboboxRoot, ComboboxArrow, ComboboxAnchor, ComboboxInput, ComboboxTrigger, ComboboxPortal, ComboboxContent, ComboboxViewport, ComboboxEmpty, ComboboxGroup, ComboboxLabel, ComboboxSeparator, ComboboxItem, ComboboxItemIndicator, TagsInputRoot, TagsInputItem, TagsInputItemText, TagsInputItemDelete, TagsInputInput, useForwardPropsEmits } from 'radix-vue'
import { defu } from 'defu'
import * as isEqual from 'fast-deep-equal'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useButtonGroup } from '../composables/useButtonGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { get, escapeRegExp } from '../utils'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UChip from './Chip.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputMenuProps<T, I, V, M>>(), {
  type: 'text',
  autofocusDelay: 0,
  portal: true,
  filter: () => ['label'],
  labelKey: 'label' as keyof T
})
const emits = defineEmits<InputMenuEmits<T, V, M>>()
const slots = defineSlots<InputMenuSlots<T>>()

const searchTerm = defineModel<string>('searchTerm', { default: '' })

const appConfig = useAppConfig()
const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'modelValue', 'defaultValue', 'selectedValue', 'open', 'defaultOpen', 'multiple', 'resetSearchTermOnBlur'), emits)
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8, position: 'popper' }) as ComboboxContentProps)
const arrowProps = toRef(() => props.arrow as ComboboxArrowProps)

const { emitFormBlur, emitFormChange, emitFormInput, size: formGroupSize, color, id, name, highlight, disabled } = useFormField<InputProps>(props)
const { orientation, size: buttonGroupSize } = useButtonGroup<InputProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(toRef(() => defu(props, { trailingIcon: appConfig.ui.icons.chevronDown })))

const inputSize = computed(() => buttonGroupSize.value || formGroupSize.value)

const ui = computed(() => inputMenu({
  color: color.value,
  variant: props.variant,
  size: inputSize?.value,
  loading: props.loading,
  highlight: highlight.value,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  multiple: props.multiple,
  buttonGroup: orientation.value
}))

function displayValue(value: AcceptableValue): string {
  const item = items.value.find(item => props.valueKey ? isEqual.default(get(item as Record<string, any>, props.valueKey as string), value) : isEqual.default(item, value)) ?? (props.createItem && value)

  return item && (typeof item === 'object' ? get(item, props.labelKey as string) : item)
}

function filterFunction(
  inputItems: ArrayOrWrapped<AcceptableValue> = items.value as ArrayOrWrapped<AcceptableValue>,
  filterSearchTerm: string = searchTerm.value,
  comparator = (item: any, term: string) => String(item).search(new RegExp(term, 'i')) !== -1
): ArrayOrWrapped<AcceptableValue> {
  if (props.filter === false) {
    return inputItems
  }

  const fields = Array.isArray(props.filter) ? props.filter : [props.labelKey]
  const escapedSearchTerm = escapeRegExp(filterSearchTerm ?? '')

  return inputItems.filter((item) => {
    if (typeof item !== 'object') {
      return comparator(item, escapedSearchTerm)
    }

    return fields.some((field) => {
      const child = get(item, field as string)

      return child !== null && child !== undefined && comparator(child, escapedSearchTerm)
    })
  }) as ArrayOrWrapped<T>
}

const groups = computed(() => props.items?.length ? (Array.isArray(props.items[0]) ? props.items : [props.items]) as InputMenuItem[][] : [])
// eslint-disable-next-line vue/no-dupe-keys
const items = computed(() => groups.value.flatMap(group => group) as T[])

const creatable = computed(() => {
  if (!props.createItem) {
    return false
  }

  const isModelValueCustom = props.modelValue && filterFunction((props.multiple && Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]) as ArrayOrWrapped<AcceptableValue>, searchTerm.value, (item, term) => String(item) === term).length === 1

  if (isModelValueCustom) {
    return false
  }

  const filteredItems = filterFunction()
  const newItem = searchTerm.value && {
    item: props.valueKey ? { [props.valueKey]: searchTerm.value, [props.labelKey ?? 'label']: searchTerm.value } : searchTerm.value,
    position: ((typeof props.createItem === 'object' && props.createItem.placement) || 'bottom') as 'top' | 'bottom'
  }

  if ((typeof props.createItem === 'object' && props.createItem.when === 'always') || props.createItem === 'always') {
    return (filteredItems.length === 1 && filterFunction(filteredItems, searchTerm.value, (item, term) => String(item) === term).length === 1) ? false : newItem
  }

  return filteredItems.length > 0 ? false : newItem
})

const rootItems = computed(() => [
  ...(creatable.value && creatable.value.position === 'top' ? [creatable.value.item] : []),
  ...filterFunction(),
  ...(creatable.value && creatable.value.position === 'bottom' ? [creatable.value.item] : [])
] as ArrayOrWrapped<AcceptableValue>)

const inputRef = ref<InstanceType<typeof ComboboxInput> | null>(null)

function autoFocus() {
  if (props.autofocus) {
    inputRef.value?.$el?.focus()
  }
}

onMounted(() => {
  setTimeout(() => {
    autoFocus()
  }, props.autofocusDelay)
})

function onUpdate(value: any) {
  if (toRaw(props.modelValue) === value) {
    return
  }
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)
  emitFormChange()
  emitFormInput()
}

function onBlur(event: FocusEvent) {
  emits('blur', event)
  emitFormBlur()
}

function onFocus(event: FocusEvent) {
  emits('focus', event)
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

defineExpose({
  inputRef
})
</script>

<template>
  <ComboboxRoot
    :id="id"
    v-slot="{ modelValue, open }"
    v-bind="rootProps"
    v-model:search-term="searchTerm"
    :name="name"
    :disabled="disabled"
    :display-value="displayValue"
    :filter-function="() => rootItems"
    :class="ui.root({ class: [props.class, props.ui?.root] })"
    :as-child="!!multiple"
    @update:model-value="onUpdate"
    @update:open="onUpdateOpen"
    @keydown.enter="$event.preventDefault()"
  >
    <ComboboxAnchor :as-child="!multiple" :class="ui.base({ class: props.ui?.base })">
      <TagsInputRoot
        v-if="multiple"
        v-slot="{ modelValue: tags }: { modelValue: AcceptableValue[] }"
        :model-value="(modelValue as string[])"
        :disabled="disabled"
        delimiter=""
        as-child
        @blur="onBlur"
        @focus="onFocus"
      >
        <TagsInputItem v-for="(item, index) in tags" :key="index" :value="(item as string)" :class="ui.tagsItem({ class: props.ui?.tagsItem })">
          <TagsInputItemText :class="ui.tagsItemText({ class: props.ui?.tagsItemText })">
            <slot name="tags-item-text" :item="(item as T)" :index="index">
              {{ displayValue(item as T) }}
            </slot>
          </TagsInputItemText>

          <TagsInputItemDelete :class="ui.tagsItemDelete({ class: props.ui?.tagsItemDelete })" :disabled="disabled">
            <slot name="tags-item-delete" :item="(item as T)" :index="index">
              <UIcon :name="deleteIcon || appConfig.ui.icons.close" :class="ui.tagsItemDeleteIcon({ class: props.ui?.tagsItemDeleteIcon })" />
            </slot>
          </TagsInputItemDelete>
        </TagsInputItem>

        <ComboboxInput as-child>
          <TagsInputInput
            ref="inputRef"
            v-bind="$attrs"
            :placeholder="placeholder"
            :required="required"
            :class="ui.tagsInput({ class: props.ui?.tagsInput })"
            @keydown.enter.prevent
          />
        </ComboboxInput>
      </TagsInputRoot>

      <ComboboxInput
        v-else
        ref="inputRef"
        v-bind="$attrs"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :class="ui.base({ class: props.ui?.base })"
        @blur="onBlur"
        @focus="onFocus"
      />

      <span v-if="isLeading || !!avatar || !!slots.leading" :class="ui.leading({ class: props.ui?.leading })">
        <slot name="leading" :model-value="(modelValue as T)" :open="open" :ui="ui">
          <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
          <UAvatar v-else-if="!!avatar" :size="((props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="avatar" :class="ui.itemLeadingAvatar({ class: props.ui?.itemLeadingAvatar })" />
        </slot>
      </span>

      <ComboboxTrigger v-if="isTrailing || !!slots.trailing" :class="ui.trailing({ class: props.ui?.trailing })">
        <slot name="trailing" :model-value="(modelValue as T)" :open="open" :ui="ui">
          <UIcon v-if="trailingIconName" :name="trailingIconName" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
        </slot>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal :disabled="!portal">
      <ComboboxContent :class="ui.content({ class: props.ui?.content })" v-bind="contentProps">
        <ComboboxEmpty :class="ui.empty({ class: props.ui?.empty })">
          <slot name="empty" :search-term="searchTerm">
            {{ searchTerm ? `No results for ${searchTerm}` : 'No results' }}
          </slot>
        </ComboboxEmpty>

        <ComboboxViewport :class="ui.viewport({ class: props.ui?.viewport })">
          <ComboboxGroup v-if="creatable && creatable.position === 'top'" :class="ui.group({ class: props.ui?.group })">
            <ComboboxItem
              :class="ui.item({ class: props.ui?.item })"
              :value="valueKey && typeof creatable.item === 'object' ? get(creatable.item, props.valueKey as string) : creatable.item"
              @select="(v) => emits('create', v as T)"
            >
              <span :class="ui.itemLabel({ class: props.ui?.itemLabel })">
                <slot name="create-item-label" :item="(creatable.item as T)">
                  Create "{{ typeof creatable.item === 'object' ? get(creatable.item, props.labelKey as string) : creatable.item }}"
                </slot>
              </span>
            </ComboboxItem>
          </ComboboxGroup>

          <ComboboxGroup v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`" :class="ui.group({ class: props.ui?.group })">
            <template v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`">
              <ComboboxLabel v-if="item?.type === 'label'" :class="ui.label({ class: props.ui?.label })">
                {{ get(item, props.labelKey as string) }}
              </ComboboxLabel>

              <ComboboxSeparator v-else-if="item?.type === 'separator'" :class="ui.separator({ class: props.ui?.separator })" />

              <ComboboxItem
                v-else
                :class="ui.item({ class: props.ui?.item })"
                :disabled="item.disabled"
                :value="valueKey && typeof item === 'object' ? get(item, props.valueKey as string) : item"
                @select="item.onSelect"
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

                  <span :class="ui.itemLabel({ class: props.ui?.itemLabel })">
                    <slot name="item-label" :item="(item as T)" :index="index">
                      {{ typeof item === 'object' ? get(item, props.labelKey as string) : item }}
                    </slot>
                  </span>

                  <span :class="ui.itemTrailing({ class: props.ui?.itemTrailing })">
                    <slot name="item-trailing" :item="(item as T)" :index="index" />

                    <ComboboxItemIndicator as-child>
                      <UIcon :name="selectedIcon || appConfig.ui.icons.check" :class="ui.itemTrailingIcon({ class: props.ui?.itemTrailingIcon })" />
                    </ComboboxItemIndicator>
                  </span>
                </slot>
              </ComboboxItem>
            </template>
          </ComboboxGroup>

          <ComboboxGroup v-if="creatable && creatable.position === 'bottom'" :class="ui.group({ class: props.ui?.group })">
            <ComboboxItem
              :class="ui.item({ class: props.ui?.item })"
              :value="valueKey && typeof creatable.item === 'object' ? get(creatable.item, props.valueKey as string) : creatable.item"
              @select="(v) => emits('create', v as T)"
            >
              <span :class="ui.itemLabel({ class: props.ui?.itemLabel })">
                <slot name="create-item-label" :item="(creatable.item as T)">
                  Create "{{ typeof creatable.item === 'object' ? get(creatable.item, props.labelKey as string) : creatable.item }}"
                </slot>
              </span>
            </ComboboxItem>
          </ComboboxGroup>
        </ComboboxViewport>

        <ComboboxArrow v-if="!!arrow" v-bind="arrowProps" :class="ui.arrow({ class: props.ui?.arrow })" />
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
