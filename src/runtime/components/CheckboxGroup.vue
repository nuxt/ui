<script lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { CheckboxGroupRootProps, CheckboxGroupRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/checkbox-group'
import type { AcceptableValue } from '../types/utils'
import { tv } from '../utils/tv'

const appConfigCheckboxGroup = _appConfig as AppConfig & { ui: { checkboxGroup: Partial<typeof theme> } }

const checkboxGroup = tv({ extend: tv(theme), ...(appConfigCheckboxGroup.ui?.checkboxGroup || {}) })

type CheckboxGroupVariants = VariantProps<typeof checkboxGroup>

export type CheckboxGroupValue = AcceptableValue

export type CheckboxGroupItem = {
  label?: string
  description?: string
  disabled?: boolean
  value?: string
  [key: string]: any
} | CheckboxGroupValue

export interface CheckboxGroupProps<T extends CheckboxGroupItem = CheckboxGroupItem> extends Pick<CheckboxGroupRootProps, 'defaultValue' | 'disabled' | 'loop' | 'modelValue' | 'name' | 'required'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  legend?: string // should be legend
  /**
   * When `items` is an array of objects, select the field to use as the value.
   * @defaultValue 'value'
   */
  valueKey?: string
  /**
   * When `items` is an array of objects, select the field to use as the label.
   * @defaultValue 'label'
   */
  labelKey?: string
  /**
   * When `items` is an array of objects, select the field to use as the description.
   * @defaultValue 'description'
   */
  descriptionKey?: string
  items?: T[]
  /**
   * @defaultValue 'primary'
   */
  color?: CheckboxGroupVariants['color']
  /**
   * Position of the indicator.
   * @defaultValue 'start'
   */
  indicator?: CheckboxGroupVariants['indicator']
  /**
   * The orientation the radio buttons are laid out.
   * @defaultValue 'vertical'
   */
  orientation?: CheckboxGroupRootProps['orientation']
  /**
   * @defaultValue 'md'
   */
  size?: CheckboxGroupVariants['size']
  /**
   * @defaultValue 'list'
   */
  variant?: CheckboxGroupVariants['variant']
  /**
   * The icon displayed when checked.
   * @defaultValue appConfig.ui.icons.check
   * @IconifyIcon
   */
  icon?: string
  /**
   * The icon displayed when the checkbox is indeterminate.
   * @defaultValue appConfig.ui.icons.minus
   * @IconifyIcon
   */
  indeterminateIcon?: string
  class?: any
  ui?: Partial<typeof checkboxGroup.slots>
}

export type CheckboxGroupEmits = CheckboxGroupRootEmits & {
  change: [payload: Event]
}

type SlotProps<T extends CheckboxGroupItem> = (props: { item: T & { id: string }, modelValue?: CheckboxGroupValue }) => any

export interface CheckboxGroupSlots<T extends CheckboxGroupItem = CheckboxGroupItem> {
  legend(props?: {}): any
  label: SlotProps<T>
  description: SlotProps<T>
}
</script>

<script setup lang="ts" generic="T extends CheckboxGroupItem">
import { computed, useId } from 'vue'
import { CheckboxRoot, CheckboxIndicator, Label, CheckboxGroupRoot, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useFormField } from '../composables/useFormField'
import { get } from '../utils'
import UIcon from './Icon.vue'

const props = withDefaults(defineProps<CheckboxGroupProps<T>>(), {
  valueKey: 'value',
  labelKey: 'label',
  descriptionKey: 'description',
  orientation: 'vertical'
})

const emits = defineEmits<CheckboxGroupEmits>()
const slots = defineSlots<CheckboxGroupSlots<T>>()

const modelValue = defineModel<string[]>({ default: undefined })

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'modelValue', 'defaultValue', 'orientation', 'loop', 'required'), emits)

const appConfig = useAppConfig()

const { emitFormChange, emitFormInput, color, name, size, id: _id, disabled, ariaAttrs } = useFormField<CheckboxGroupProps<T>>(props, { bind: false })
const id = _id.value ?? useId()

const ui = computed(() => checkboxGroup({
  size: size.value,
  color: color.value,
  disabled: disabled.value,
  required: props.required,
  orientation: props.orientation,
  variant: props.variant,
  indicator: props.indicator
}))

function normalizeItem(item: any) {
  if (item === null) {
    return {
      id: `${id}:null`,
      value: undefined,
      label: undefined
    }
  }

  if (typeof item === 'string' || typeof item === 'number') {
    return {
      id: `${id}:${item}`,
      value: String(item),
      label: String(item)
    }
  }

  const value = get(item, props.valueKey as string)
  const label = get(item, props.labelKey as string)
  const description = get(item, props.descriptionKey as string)

  return {
    ...item,
    value,
    label,
    description,
    id: `${id}:${value}`
  }
}

const normalizedItems = computed(() => {
  if (!props.items) {
    return []
  }
  return props.items.map(normalizeItem)
})

function onUpdate(value: any) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)
  emitFormChange()
  emitFormInput()
}
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <CheckboxGroupRoot
    :id="id"
    v-bind="rootProps"
    v-model="modelValue"
    :name="name"
    :disabled="disabled"
    :class="ui.root({ class: [props.class, props.ui?.root] })"
    @update:model-value="onUpdate"
  >
    <fieldset :class="ui.fieldset({ class: props.ui?.fieldset })" v-bind="ariaAttrs">
      <legend v-if="legend || !!slots.legend" :class="ui.legend({ class: props.ui?.legend })">
        <slot name="legend">
          {{ legend }}
        </slot>
      </legend>
      <component :is="variant === 'list' ? 'div' : Label" v-for="item in normalizedItems" :key="item.value" :class="ui.item({ class: props.ui?.item })">
        <div :class="ui.container({ class: props.ui?.container })">
          <CheckboxRoot
            :id="item.id"
            :value="item.value"
            :disabled="item.disabled"
            :class="ui.base({ class: props.ui?.base, disabled: item.disabled })"
          >
            <CheckboxIndicator :class="ui.indicator({ class: props.ui?.indicator })">
              <UIcon v-if="item.value=== 'indeterminate'" :name="indeterminateIcon || appConfig.ui.icons.minus" :class="ui.icon({ class: props.ui?.icon })" />
              <UIcon v-else :name="icon || appConfig.ui.icons.check" :class="ui.icon({ class: props.ui?.icon })" />
            </CheckboxIndicator>
          </CheckboxRoot>
        </div>
        <div :class="ui.wrapper({ class: props.ui?.wrapper })">
          <component :is="variant === 'list' ? Label : 'p'" :class="ui.label({ class: props.ui?.label })" :for="item.id">
            <slot name="label" :item="item" :model-value="item.value">
              {{ item.label }}
            </slot>
          </component>
          <p v-if="item.description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
            <slot name="description" :item="item" :model-value="item.value">
              {{ item.description }}
            </slot>
          </p>
        </div>
      </component>
    </fieldset>
  </CheckboxGroupRoot>
</template>
