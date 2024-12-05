<script lang="ts">
import type { InputHTMLAttributes } from 'vue'
import { tv, type VariantProps } from 'tailwind-variants'
import type { ComboboxRootProps, ComboboxRootEmits, ComboboxContentProps, ComboboxArrowProps, AcceptableValue } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/input-menu'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'
import type { AvatarProps, ChipProps, InputProps } from '../types'
import type { PartialString, MaybeArrayOfArray, MaybeArrayOfArrayItem, SelectModelValue, SelectModelValueEmits, SelectItemKey } from '../types/utils'

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

export interface InputMenuProps<T extends MaybeArrayOfArrayItem<I>, I extends MaybeArrayOfArray<InputMenuItem | AcceptableValue | boolean> = MaybeArrayOfArray<InputMenuItem | AcceptableValue | boolean>, V extends SelectItemKey<T> | undefined = undefined, M extends boolean = false> extends Pick<ComboboxRootProps<T>, 'open' | 'defaultOpen' | 'disabled' | 'name' | 'resetSearchTermOnBlur' | 'highlightOnHover'>, UseComponentIconsProps {
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
   * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8, position: 'popper' }
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
   * When `items` is an array of objects, select the field to use as the value instead of the object itself.
   * @defaultValue undefined
   */
  valueKey?: V
  /**
   * When `items` is an array of objects, select the field to use as the label.
   * @defaultValue 'label'
   */
  labelKey?: V
  items?: I
  /** The value of the InputMenu when initially rendered. Use when you do not need to control the state of the InputMenu. */
  defaultValue?: SelectModelValue<T, V, M>
  /** The controlled value of the InputMenu. Can be binded-with with `v-model`. */
  modelValue?: SelectModelValue<T, V, M>
  /** Whether multiple options can be selected or not. */
  multiple?: M & boolean
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  /**
   * Determines if custom user input that does not exist in options can be added.
   * @defaultValue false
   */
  createItem?: boolean | 'always' | { position?: 'top' | 'bottom', when?: 'empty' | 'always' }
  /**
   * Fields to filter items by.
   * @defaultValue [labelKey]
   */
  filterFields?: string[]
  /**
   * When `true`, disable the default filters, useful for custom filtering (useAsyncData, useFetch, etc.).
   * @defaultValue false
   */
  ignoreFilter?: boolean
  class?: any
  ui?: PartialString<typeof inputMenu.slots>
}

export type InputMenuEmits<T, V, M extends boolean> = Omit<ComboboxRootEmits<T>, 'update:modelValue'> & {
  change: [payload: Event]
  blur: [payload: FocusEvent]
  focus: [payload: FocusEvent]
  create: [item: string]
} & SelectModelValueEmits<T, V, M>

type SlotProps<T> = (props: { item: T, index: number }) => any

export interface InputMenuSlots<T, M extends boolean> {
  'leading'(props: { modelValue?: M extends true ? T[] : T, open: boolean, ui: any }): any
  'trailing'(props: { modelValue?: M extends true ? T[] : T, open: boolean, ui: any }): any
  'empty'(props: { searchTerm?: string }): any
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
  'tags-item-text': SlotProps<T>
  'tags-item-delete': SlotProps<T>
  'create-item-label'(props: { item: string }): any
}

extendDevtoolsMeta({ defaultProps: { items: ['Option 1', 'Option 2', 'Option 3'] } })
</script>

<script setup lang="ts" generic="T extends MaybeArrayOfArrayItem<I>, I extends MaybeArrayOfArray<InputMenuItem | AcceptableValue | boolean> = MaybeArrayOfArray<InputMenuItem | AcceptableValue | boolean>, V extends SelectItemKey<T> | undefined = undefined, M extends boolean = false">
import { computed, ref, toRef, onMounted, toRaw } from 'vue'
import { ComboboxRoot, ComboboxArrow, ComboboxAnchor, ComboboxInput, ComboboxTrigger, ComboboxPortal, ComboboxContent, ComboboxViewport, ComboboxEmpty, ComboboxGroup, ComboboxLabel, ComboboxSeparator, ComboboxItem, ComboboxItemIndicator, TagsInputRoot, TagsInputItem, TagsInputItemText, TagsInputItemDelete, TagsInputInput, useForwardPropsEmits, useFilter } from 'reka-ui'
import { defu } from 'defu'
import { reactivePick, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useButtonGroup } from '../composables/useButtonGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { useLocale } from '../composables/useLocale'
import { get, compare } from '../utils'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UChip from './Chip.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputMenuProps<T, I, V, M>>(), {
  type: 'text',
  autofocusDelay: 0,
  portal: true,
  labelKey: 'label' as never
})
const emits = defineEmits<InputMenuEmits<T, V, M>>()
const slots = defineSlots<InputMenuSlots<T, M>>()

const searchTerm = defineModel<string>('searchTerm', { default: '' })

const { t } = useLocale()
const appConfig = useAppConfig()
const { contains } = useFilter({ sensitivity: 'base' })

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'modelValue', 'defaultValue', 'open', 'defaultOpen', 'multiple', 'resetSearchTermOnBlur', 'highlightOnHover', 'ignoreFilter'), emits)
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8, collisionPadding: 8, position: 'popper' }) as ComboboxContentProps)
const arrowProps = toRef(() => props.arrow as ComboboxArrowProps)

const { emitFormBlur, emitFormChange, emitFormInput, size: formGroupSize, color, id, name, highlight, disabled } = useFormField<InputProps>(props)
const { orientation, size: buttonGroupSize } = useButtonGroup<InputProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(toRef(() => defu(props, { trailingIcon: appConfig.ui.icons.chevronDown })))

const inputSize = computed(() => buttonGroupSize.value || formGroupSize.value)

const [DefineCreateItemTemplate, ReuseCreateItemTemplate] = createReusableTemplate()

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

function displayValue(value: T): string {
  if (!props.valueKey) {
    return value && (typeof value === 'object' ? get(value, props.labelKey as string) : value)
  }

  const item = items.value.find(item => compare(typeof item === 'object' ? get(item, props.valueKey as string) : item, value))
  return item && (typeof item === 'object' ? get(item, props.labelKey as string) : item)
}

const groups = computed(() => props.items?.length ? (Array.isArray(props.items[0]) ? props.items : [props.items]) as InputMenuItem[][] : [])
// eslint-disable-next-line vue/no-dupe-keys
const items = computed(() => groups.value.flatMap(group => group) as T[])

const filteredGroups = computed(() => {
  if (props.ignoreFilter || !searchTerm.value) {
    return groups.value
  }

  const fields = Array.isArray(props.filterFields) ? props.filterFields : [props.labelKey] as string[]

  return groups.value.map(items => items.filter((item) => {
    if (typeof item !== 'object') {
      return contains(item, searchTerm.value)
    }

    if (item.type && ['label', 'separator'].includes(item.type)) {
      return true
    }

    return fields.some(field => contains(get(item, field), searchTerm.value))
  })).filter(group => group.filter(item => !item.type || !['label', 'separator'].includes(item.type)).length > 0)
})
const filteredItems = computed(() => filteredGroups.value.flatMap(group => group) as T[])

const createItem = computed(() => {
  if (!props.createItem || !searchTerm.value) {
    return false
  }

  const newItem = props.valueKey ? { [props.valueKey]: searchTerm.value } as T : searchTerm.value

  if ((typeof props.createItem === 'object' && props.createItem.when === 'always') || props.createItem === 'always') {
    return !filteredItems.value.find(item => compare(item, newItem, props.valueKey))
  }

  return !filteredItems.value.length
})
const createItemPosition = computed(() => typeof props.createItem === 'object' ? props.createItem.position : 'bottom')

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

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <DefineCreateItemTemplate>
    <ComboboxGroup :class="ui.group({ class: props.ui?.group })">
      <ComboboxItem
        :class="ui.item({ class: props.ui?.item })"
        :value="searchTerm"
        @select.prevent="emits('create', searchTerm)"
      >
        <span :class="ui.itemLabel({ class: props.ui?.itemLabel })">
          <slot name="create-item-label" :item="searchTerm">
            {{ t('inputMenu.create', { label: searchTerm }) }}
          </slot>
        </span>
      </ComboboxItem>
    </ComboboxGroup>
  </DefineCreateItemTemplate>

  <ComboboxRoot
    :id="id"
    v-slot="{ modelValue, open }"
    v-bind="rootProps"
    :name="name"
    :disabled="disabled"
    :class="ui.root({ class: [props.class, props.ui?.root] })"
    :as-child="!!multiple"
    ignore-filter
    @update:model-value="onUpdate"
    @update:open="onUpdateOpen"
    @keydown.enter="$event.preventDefault()"
  >
    <ComboboxAnchor :as-child="!multiple" :class="ui.base({ class: props.ui?.base })">
      <TagsInputRoot
        v-if="multiple"
        v-slot="{ modelValue: tags }"
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

        <ComboboxInput v-model="searchTerm" :display-value="displayValue" as-child>
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
        v-model="searchTerm"
        :display-value="displayValue"
        v-bind="$attrs"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        @blur="onBlur"
        @focus="onFocus"
      />

      <span v-if="isLeading || !!avatar || !!slots.leading" :class="ui.leading({ class: props.ui?.leading })">
        <slot name="leading" :model-value="(modelValue as M extends true ? T[] : T)" :open="open" :ui="ui">
          <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
          <UAvatar v-else-if="!!avatar" :size="((props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="avatar" :class="ui.itemLeadingAvatar({ class: props.ui?.itemLeadingAvatar })" />
        </slot>
      </span>

      <ComboboxTrigger v-if="isTrailing || !!slots.trailing" :class="ui.trailing({ class: props.ui?.trailing })">
        <slot name="trailing" :model-value="(modelValue as M extends true ? T[] : T)" :open="open" :ui="ui">
          <UIcon v-if="trailingIconName" :name="trailingIconName" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
        </slot>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal :disabled="!portal">
      <ComboboxContent :class="ui.content({ class: props.ui?.content })" v-bind="contentProps">
        <ComboboxEmpty :class="ui.empty({ class: props.ui?.empty })">
          <slot name="empty" :search-term="searchTerm">
            {{ searchTerm ? t('inputMenu.noMatch', { searchTerm }) : t('inputMenu.noData') }}
          </slot>
        </ComboboxEmpty>

        <ComboboxViewport :class="ui.viewport({ class: props.ui?.viewport })">
          <ReuseCreateItemTemplate v-if="createItem && createItemPosition === 'top'" />

          <ComboboxGroup v-for="(group, groupIndex) in filteredGroups" :key="`group-${groupIndex}`" :class="ui.group({ class: props.ui?.group })">
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

          <ReuseCreateItemTemplate v-if="createItem && createItemPosition === 'bottom'" />
        </ComboboxViewport>

        <ComboboxArrow v-if="!!arrow" v-bind="arrowProps" :class="ui.arrow({ class: props.ui?.arrow })" />
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
