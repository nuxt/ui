<script lang="ts">
import { tv } from 'tailwind-variants'
import type { ComboboxRootProps, ComboboxRootEmits, ComboboxContentProps, ComboboxItemProps, ComboboxArrowProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/input-menu'
import type { UseComponentIconsProps } from '#ui/composables/useComponentIcons'
import type { AvatarProps, ChipProps, InputProps } from '#ui/types'

type AcceptableValue = string | number | boolean | Record<string, any>
type ArrayOrWrapped<T> = T extends any[] ? T : Array<T>

const appConfig = _appConfig as AppConfig & { ui: { inputMenu: Partial<typeof theme> } }

const inputMenu = tv({ extend: tv(theme), ...(appConfig.ui?.inputMenu || {}) })

export interface InputMenuItem extends Pick<ComboboxItemProps, 'disabled'> {
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

export interface InputMenuProps<T> extends Omit<ComboboxRootProps, 'asChild' | 'dir' | 'filterFunction' | 'displayValue' | 'multiple'>, Omit<UseComponentIconsProps, 'leading' | 'trailing' | 'trailingIcon'> {
  /**
   * The icon displayed in the input.
   * @defaultValue `appConfig.ui.icons.chevronDown`
   */
  trailingIcon?: string
  /**
   * The icon displayed when an item is selected.
   * @defaultValue `appConfig.ui.icons.check`
   */
  selectedIcon?: string
  placeholder?: InputProps['placeholder']
  required?: InputProps['required']
  avatar?: InputProps['avatar']
  color?: InputProps['color']
  variant?: InputProps['variant']
  size?: InputProps['size']
  content?: Omit<ComboboxContentProps, 'asChild' | 'forceMount'>
  arrow?: boolean | Omit<ComboboxArrowProps, 'asChild'>
  portal?: boolean
  /**
   * Whether to filter items or not, can be an array of fields to filter.
   * When `false`, items will not be filtered which is useful for custom filtering.
   * @defaultValue `['label']`
   */
  filter?: boolean | string[]
  items?: T[] | T[][]
  class?: any
  ui?: Partial<typeof inputMenu.slots>
}

export type InputMenuEmits<T> = ComboboxRootEmits<T>

type SlotProps<T> = (props: { item: T, index: number }) => any

export type InputMenuSlots<T> = {
  'leading'(): any
  'empty'(props: { searchTerm?: string }): any
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
}
</script>

<script setup lang="ts" generic="T extends InputMenuItem | AcceptableValue">
import { computed, toRef } from 'vue'
import { ComboboxRoot, ComboboxAnchor, ComboboxInput, ComboboxTrigger, ComboboxPortal, ComboboxContent, ComboboxViewport, ComboboxEmpty, ComboboxGroup, ComboboxLabel, ComboboxSeparator, ComboboxItem, ComboboxItemIndicator, useForwardProps, useForwardPropsEmits } from 'radix-vue'
import { defu } from 'defu'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { UIcon, UChip, UAvatar } from '#components'
import { get } from '#ui/utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputMenuProps<T>>(), {
  portal: true,
  filter: () => ['label']
})
const emits = defineEmits<InputMenuEmits<T>>()
defineSlots<InputMenuSlots<T>>()

const appConfig = useAppConfig()
const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'modelValue', 'defaultValue', 'open', 'defaultOpen', 'disabled', 'name'), emits)
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8, position: 'popper' }) as ComboboxContentProps)
const inputProps = useForwardProps(reactivePick(props, 'name', 'loading', 'loadingIcon', 'placeholder', 'required', 'color', 'variant', 'size'))

const ui = computed(() => tv({ extend: inputMenu, slots: props.ui })())

function displayValue(val: AcceptableValue) {
  if (typeof val === 'object') {
    return val.label
  }

  return String(val)
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

const groups = computed(() => props.items?.length ? (Array.isArray(props.items[0]) ? props.items : [props.items]) as InputMenuItem[][] : [])
</script>

<template>
  <ComboboxRoot v-slot="{ modelValue }" v-bind="rootProps" :display-value="displayValue" :filter-function="filterFunction" :class="ui.root({ class: props.class })">
    <ComboboxAnchor as-child>
      <ComboboxInput as-child>
        <UInput v-bind="{ ...inputProps, ...$attrs }" :icon="(modelValue as InputMenuItem)?.icon || icon" :avatar="(modelValue as InputMenuItem)?.avatar || avatar" :class="ui.input()">
          <template v-if="$slots.leading" #leading>
            <slot name="leading" />
          </template>

          <template #trailing="{ iconClass }">
            <ComboboxTrigger :class="ui.trigger()">
              <UIcon :name="trailingIcon || appConfig.ui.icons.chevronDown" :class="iconClass" />
            </ComboboxTrigger>
          </template>
        </UInput>
      </ComboboxInput>
    </ComboboxAnchor>

    <ComboboxPortal :disabled="!portal">
      <ComboboxContent :class="ui.content()" v-bind="contentProps">
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

              <ComboboxItem
                v-else
                :class="ui.item()"
                :disabled="item.disabled"
                :value="item"
              >
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
