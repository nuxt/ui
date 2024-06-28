<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { ComboboxRootProps, ComboboxRootEmits, ComboboxContentProps, ComboboxItemProps, ComboboxArrowProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/select-menu'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps, ChipProps, InputProps } from '../types'
import type { AcceptableValue, ArrayOrWrapped } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { selectMenu: Partial<typeof theme> } }

const selectMenu = tv({ extend: tv(theme), ...(appConfig.ui?.selectMenu || {}) })

export interface SelectMenuItem extends Pick<ComboboxItemProps, 'disabled'> {
  label?: string
  icon?: string
  avatar?: AvatarProps
  chip?: ChipProps
  /**
   * The item type.
   * @defaultValue 'item'
   */
  type?: 'label' | 'separator' | 'item'
}

type SelectMenuVariants = VariantProps<typeof selectMenu>

export interface SelectMenuProps<T> extends Pick<ComboboxRootProps<T>, 'modelValue' | 'defaultValue' | 'open' | 'defaultOpen' | 'searchTerm' | 'multiple' | 'disabled' | 'name' | 'resetSearchTermOnBlur'>, UseComponentIconsProps {
  id?: string
  /** The placeholder text when the select is empty. */
  placeholder?: string
  /** The placeholder text when the search input is empty. */
  searchPlaceholder?: string
  color?: SelectMenuVariants['color']
  variant?: SelectMenuVariants['variant']
  size?: SelectMenuVariants['size']
  required?: boolean
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
  items?: T[] | T[][]
  class?: any
  ui?: Partial<typeof selectMenu.slots>
}

export type SelectMenuEmits<T> = ComboboxRootEmits<T>

type SlotProps<T> = (props: { item: T, index: number }) => any

export type SelectMenuSlots<T> = {
  'leading'(props: { modelValue: T, open: boolean }): any
  'default'(props: { modelValue: T, open: boolean }): any
  'trailing'(props: { modelValue: T, open: boolean }): any
  'empty'(props: { searchTerm?: string }): any
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
}
</script>

<script setup lang="ts" generic="T extends SelectMenuItem | AcceptableValue">
import { computed, toRef } from 'vue'
import { ComboboxRoot, ComboboxAnchor, ComboboxInput, ComboboxTrigger, ComboboxPortal, ComboboxContent, ComboboxViewport, ComboboxEmpty, ComboboxGroup, ComboboxLabel, ComboboxSeparator, ComboboxItem, ComboboxItemIndicator, useForwardPropsEmits } from 'radix-vue'
import { defu } from 'defu'
import { reactivePick } from '@vueuse/core'
import { useAppConfig, useFormField, useButtonGroup, useComponentIcons } from '#imports'
import { UIcon, UChip, UAvatar } from '#components'
import { get } from '../utils'

const props = withDefaults(defineProps<SelectMenuProps<T>>(), {
  portal: true,
  autofocusDelay: 0,
  searchPlaceholder: 'Search...',
  filter: () => ['label']
})
const emits = defineEmits<SelectMenuEmits<T>>()
const slots = defineSlots<SelectMenuSlots<T>>()

const searchTerm = defineModel<string>('searchTerm', { default: '' })

const appConfig = useAppConfig()
const rootProps = useForwardPropsEmits(reactivePick(props, 'modelValue', 'defaultValue', 'open', 'defaultOpen', 'multiple', 'resetSearchTermOnBlur'), emits)
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8, position: 'popper' }) as ComboboxContentProps)
const { emitFormBlur, emitFormChange, size: formGroupSize, color, id, name, disabled } = useFormField<InputProps>(props)
const { orientation, size: buttonGroupSize } = useButtonGroup<InputProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(toRef(() => defu(props, { trailingIcon: appConfig.ui.icons.chevronDown })))

const inputSize = computed(() => buttonGroupSize.value || formGroupSize.value)

const ui = computed(() => tv({ extend: selectMenu, slots: props.ui })({
  color: color.value,
  variant: props.variant,
  size: inputSize?.value,
  loading: props.loading,
  leading: isLeading.value || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  buttonGroup: orientation.value
}))

function displayValue(val: T, multiple?: boolean): string {
  if (multiple && Array.isArray(val)) {
    return val.map(v => displayValue(v)).join(', ')
  }

  if (typeof val === 'object') {
    return val.label
  }

  return val && String(val)
}

function filterFunction(items: ArrayOrWrapped<AcceptableValue>, searchTerm: string): ArrayOrWrapped<AcceptableValue> {
  if (props.filter === false) {
    return items
  }

  const fields = Array.isArray(props.filter) ? props.filter : ['label']

  return items.filter((item) => {
    if (typeof item !== 'object') {
      return String(item).search(new RegExp(searchTerm, 'i')) !== -1
    }

    return fields.some((field) => {
      const child = get(item, field)

      return child !== null && child !== undefined && String(child).search(new RegExp(searchTerm, 'i')) !== -1
    })
  }) as ArrayOrWrapped<T>
}

const groups = computed(() => props.items?.length ? (Array.isArray(props.items[0]) ? props.items : [props.items]) as SelectMenuItem[][] : [])
</script>

<template>
  <ComboboxRoot
    :id="id"
    v-slot="{ modelValue, open }"
    v-bind="rootProps"
    v-model:search-term="searchTerm"
    as-child
    :name="name"
    :disabled="disabled"
    :display-value="() => searchTerm"
    :filter-function="filterFunction"
    @update:model-value="emitFormChange()"
  >
    <ComboboxAnchor as-child>
      <ComboboxTrigger :class="ui.base({ class: props.class })" tabindex="0">
        <span v-if="isLeading || !!slots.leading" :class="ui.leading()">
          <slot name="leading" :model-value="(modelValue as T)" :open="open">
            <UIcon v-if="leadingIconName" :name="leadingIconName" :class="ui.leadingIcon()" />
          </slot>
        </span>

        <slot :model-value="(modelValue as T)" :open="open">
          <span v-if="multiple ? !!modelValue?.length : !!modelValue" :class="ui.value()">
            {{ displayValue(modelValue as T, multiple) }}
          </span>
          <span v-else :class="ui.placeholder()">
            {{ placeholder ?? '&nbsp;' }}
          </span>
        </slot>

        <span v-if="isTrailing || !!slots.trailing" :class="ui.trailing()">
          <slot name="trailing" :model-value="(modelValue as T)" :open="open">
            <UIcon v-if="trailingIconName" :name="trailingIconName" :class="ui.trailingIcon()" />
          </slot>
        </span>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal :disabled="!portal">
      <ComboboxContent :class="ui.content()" v-bind="contentProps">
        <ComboboxInput :placeholder="searchPlaceholder" :class="ui.input()" autofocus autocomplete="off" @blur="emitFormBlur()" />

        <ComboboxEmpty :class="ui.empty()">
          <slot name="empty" :search-term="searchTerm">
            {{ searchTerm ? `No results for ${searchTerm}` : 'No results' }}
          </slot>
        </ComboboxEmpty>

        <ComboboxViewport :class="ui.viewport()">
          <ComboboxGroup v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`" :class="ui.group()">
            <template v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`">
              <ComboboxLabel v-if="item?.type === 'label'" :class="ui.label()">
                {{ item.label }}
              </ComboboxLabel>

              <ComboboxSeparator v-else-if="item?.type === 'separator'" :class="ui.separator()" />

              <ComboboxItem v-else :class="ui.item()" :disabled="item.disabled" :value="item">
                <slot name="item" :item="(item as T)" :index="index">
                  <slot name="item-leading" :item="(item as T)" :index="index">
                    <UAvatar v-if="item.avatar" size="2xs" v-bind="item.avatar" :class="ui.itemLeadingAvatar()" />
                    <UIcon v-else-if="item.icon" :name="item.icon" :class="ui.itemLeadingIcon()" />
                    <UChip
                      v-else-if="item.chip"
                      size="md"
                      inset
                      standalone
                      v-bind="item.chip"
                      :class="ui.itemLeadingChip()"
                    />
                  </slot>

                  <span :class="ui.itemLabel()">
                    <slot name="item-label" :item="(item as T)" :index="index">
                      {{ displayValue(item as T) }}
                    </slot>
                  </span>

                  <span :class="ui.itemTrailing()">
                    <slot name="item-trailing" :item="(item as T)" :index="index" />

                    <ComboboxItemIndicator as-child>
                      <UIcon :name="selectedIcon || appConfig.ui.icons.check" :class="ui.itemTrailingSelectedIcon()" />
                    </ComboboxItemIndicator>
                  </span>
                </slot>
              </ComboboxItem>
            </template>
          </ComboboxGroup>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
