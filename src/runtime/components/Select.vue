<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { SelectRootProps, SelectRootEmits, SelectContentProps, SelectArrowProps, SelectItemProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/select'
import type { UseComponentIconsProps } from '#ui/composables/useComponentIcons'
import type { AvatarProps, ChipProps, InputProps } from '#ui/types'
import type { AcceptableValue } from '#ui/types/utils'

const appConfig = _appConfig as AppConfig & { ui: { select: Partial<typeof theme> } }

const select = tv({ extend: tv(theme), ...(appConfig.ui?.select || {}) })

export interface SelectItem extends Pick<SelectItemProps, 'disabled' | 'value'> {
  label?: string
  icon?: string
  avatar?: AvatarProps
  chip?: ChipProps
  /**
   * The item type.
   * @defaultValue `'item'`
   */
  type?: 'label' | 'separator' | 'item'
}

type SelectVariants = VariantProps<typeof select>

export interface SelectProps<T> extends Omit<SelectRootProps, 'asChild' | 'dir'>, UseComponentIconsProps {
  id?: string
  /** The placeholder text when the select is empty. */
  placeholder?: string
  color?: SelectVariants['color']
  variant?: SelectVariants['variant']
  size?: SelectVariants['size']
  /**
   * The icon displayed to open the menu.
   * @defaultValue `appConfig.ui.icons.chevronDown`
   */
  trailingIcon?: string
  /**
   * The icon displayed when an item is selected.
   * @defaultValue `appConfig.ui.icons.check`
   */
  selectedIcon?: string
  content?: Omit<SelectContentProps, 'asChild' | 'forceMount'>
  arrow?: boolean | Omit<SelectArrowProps, 'asChild'>
  portal?: boolean
  items?: T[] | T[][]
  class?: any
  ui?: Partial<typeof select.slots>
}

export interface SelectEmits extends SelectRootEmits {}

type SlotProps<T> = (props: { item: T, index: number }) => any

export interface SelectSlots<T> {
  'leading'(props: { modelValue: string, open: boolean }): any
  'trailing'(props: { modelValue: string, open: boolean }): any
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
}
</script>

<script setup lang="ts" generic="T extends SelectItem | AcceptableValue">
import { computed, toRef } from 'vue'
import { SelectRoot, SelectTrigger, SelectValue, SelectPortal, SelectContent, SelectViewport, SelectLabel, SelectGroup, SelectItem, SelectItemIndicator, SelectItemText, SelectSeparator, useForwardPropsEmits } from 'radix-vue'
import { defu } from 'defu'
import { reactivePick } from '@vueuse/core'
import { useAppConfig, useComponentIcons, useFormField, useButtonGroup } from '#imports'
import { UIcon, UChip, UAvatar } from '#components'

const props = withDefaults(defineProps<SelectProps<T>>(), {
  portal: true
})
const emits = defineEmits<SelectEmits>()
const slots = defineSlots<SelectSlots<T>>()

const appConfig = useAppConfig()
const rootProps = useForwardPropsEmits(reactivePick(props, 'modelValue', 'defaultValue', 'open', 'defaultOpen', 'disabled', 'autocomplete', 'required'), emits)
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8, position: 'popper' }) as SelectContentProps)

const { emitFormChange, emitFormBlur, size: formGroupSize, color, id, name, disabled } = useFormField<InputProps>(props)
const { orientation, size: buttonGroupSize } = useButtonGroup<InputProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(toRef(() => defu(props, { trailingIcon: appConfig.ui.icons.chevronDown })))

const selectSize = computed(() => buttonGroupSize.value || formGroupSize.value)

const ui = computed(() => tv({ extend: select, slots: props.ui })({
  color: color.value,
  variant: props.variant,
  size: selectSize?.value,
  loading: props.loading,
  leading: isLeading.value || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  buttonGroup: orientation.value
}))

const groups = computed(() => props.items?.length ? (Array.isArray(props.items[0]) ? props.items : [props.items]) as SelectItem[][] : [])

function onUpdateOpen(value: boolean) {
  if (!value) emitFormBlur()
}
</script>

<template>
  <SelectRoot
    :id="id"
    v-slot="{ modelValue, open }"
    v-bind="rootProps"
    :name="name"
    :disabled="disabled"
    @update:model-value="emitFormChange()"
    @update:open="onUpdateOpen"
  >
    <SelectTrigger :class="ui.base({ class: props.class })">
      <span v-if="isLeading || !!slots.leading" :class="ui.leading()">
        <slot name="leading" :model-value="modelValue" :open="open">
          <UIcon v-if="leadingIconName" :name="leadingIconName" :class="ui.leadingIcon()" />
        </slot>
      </span>

      <SelectValue :placeholder="placeholder ?? '&nbsp;'" :class="ui.value()" />

      <span v-if="isTrailing || !!slots.trailing" :class="ui.trailing()">
        <slot name="trailing" :model-value="modelValue" :open="open">
          <UIcon v-if="trailingIconName" :name="trailingIconName" :class="ui.trailingIcon()" />
        </slot>
      </span>
    </SelectTrigger>

    <SelectPortal :disabled="!portal">
      <SelectContent :class="ui.content()" v-bind="contentProps">
        <SelectViewport :class="ui.viewport()">
          <SelectGroup v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`" :class="ui.group()">
            <template v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`">
              <SelectLabel v-if="item?.type === 'label'" :class="ui.label()">
                {{ item.label }}
              </SelectLabel>
              <SelectSeparator v-else-if="item?.type === 'separator'" :class="ui.separator()" />
              <SelectItem v-else :class="ui.item()" :disabled="item.disabled" :value="typeof item === 'object' ? item.value : item">
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

                  <SelectItemText :class="ui.itemLabel()">
                    <slot name="item-label" :item="(item as T)" :index="index">
                      {{ typeof item === 'object' ? item.label : item }}
                    </slot>
                  </SelectItemText>

                  <span :class="ui.itemTrailing()">
                    <slot name="item-trailing" :item="(item as T)" :index="index" />

                    <SelectItemIndicator as-child>
                      <UIcon :name="selectedIcon || appConfig.ui.icons.check" :class="ui.itemTrailingSelectedIcon()" />
                    </SelectItemIndicator>
                  </span>
                </slot>
              </SelectItem>
            </template>
          </SelectGroup>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
