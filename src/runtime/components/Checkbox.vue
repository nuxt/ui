<script lang="ts">
import type { CheckboxRootProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/checkbox'
import type { ComponentConfig } from '../types/utils'

type Checkbox = ComponentConfig<typeof theme, AppConfig, 'checkbox'>

export interface CheckboxProps extends Pick<CheckboxRootProps, 'disabled' | 'required' | 'name' | 'value' | 'id' | 'defaultValue'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  label?: string
  description?: string
  /**
   * @defaultValue 'primary'
   */
  color?: Checkbox['variants']['color']
  /**
   * Position of the indicator.
   * @defaultValue 'start'
   */
  indicator?: Checkbox['variants']['indicator']
  /**
   * @defaultValue 'md'
   */
  size?: Checkbox['variants']['size']
  /**
   * @defaultValue 'list'
   */
  variant?: Checkbox['variants']['variant']
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
  ui?: Checkbox['slots']
}

export type CheckboxEmits = {
  change: [payload: Event]
}

export interface CheckboxSlots {
  label(props: { label?: string }): any
  description(props: { description?: string }): any
}
</script>

<script setup lang="ts">
import { computed, useId } from 'vue'
import { CheckboxRoot, CheckboxIndicator, Label, useForwardProps, Primitive } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useFormField } from '../composables/useFormField'
import { useCheckboxGroup } from '../composables/useCheckboxGroup'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<CheckboxProps>()
const slots = defineSlots<CheckboxSlots>()
const emits = defineEmits<CheckboxEmits>()

const modelValue = defineModel<boolean | 'indeterminate'>({ default: undefined })

const appConfig = useAppConfig() as Checkbox['AppConfig']

const { orientation, size: checkBoxSize, variant, indicator } = useCheckboxGroup<CheckboxProps>(props)

const rootProps = useForwardProps(reactivePick(props, 'required', 'value', 'defaultValue'))

const { id: _id, emitFormChange, emitFormInput, color, name, disabled, ariaAttrs } = useFormField<CheckboxProps>(props)
const id = _id.value ?? useId()

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.checkbox || {}) })({
  size: checkBoxSize.value,
  color: color.value,
  required: props.required,
  disabled: disabled.value,
  checked: Boolean(modelValue.value ?? props.defaultValue),
  variant: variant.value,
  indicator: indicator.value,
  orientation: orientation.value
}))

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
  <Primitive :as="as" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <component :is="variant === 'list' ? 'div' : Label" :class="ui.item({ class: props.ui?.item })">
      <div :class="ui.container({ class: props.ui?.container })">
        <CheckboxRoot
          :id="id"
          v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
          v-model="modelValue"
          :name="name"
          :disabled="disabled"
          :class="ui.base({ class: props.ui?.base })"
          @update:model-value="onUpdate"
        >
          <template #default="{ modelValue }">
            <CheckboxIndicator as-child :class="ui.indicator({ class: props.ui?.indicator })">
              <UIcon v-if="modelValue === 'indeterminate'" :name="indeterminateIcon || appConfig.ui.icons.minus" :class="ui.icon({ class: props.ui?.icon })" />
              <UIcon v-else :name="icon || appConfig.ui.icons.check" :class="ui.icon({ class: props.ui?.icon })" />
            </CheckboxIndicator>
          </template>
        </CheckboxRoot>
      </div>
      <div :class="ui.wrapper({ class: props.ui?.wrapper })">
        <component :is="variant === 'list' ? Label : 'p'" :class="ui.label({ class: props.ui?.label })" :for="id">
          <slot name="label" :label="label">
            {{ label }}
          </slot>
        </component>
        <p v-if="description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
          <slot name="description" :description="description">
            {{ description }}
          </slot>
        </p>
      </div>
    </component>
  </Primitive>
</template>
