<script lang="ts">
import type { CheckboxRootProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/checkbox'
import type { IconProps } from '../types'
import type { ComponentConfig } from '../types/tv'

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
   * @defaultValue 'list'
   */
  variant?: Checkbox['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: Checkbox['variants']['size']
  /**
   * Position of the indicator.
   * @defaultValue 'start'
   */
  indicator?: Checkbox['variants']['indicator']
  /**
   * The icon displayed when checked.
   * @defaultValue appConfig.ui.icons.check
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /**
   * The icon displayed when the checkbox is indeterminate.
   * @defaultValue appConfig.ui.icons.minus
   * @IconifyIcon
   */
  indeterminateIcon?: IconProps['name']
  class?: any
  ui?: Checkbox['slots']
}

export type CheckboxEmits = {
  change: [event: Event]
}

export interface CheckboxSlots {
  label(props: { label?: string }): any
  description(props: { description?: string }): any
}
</script>

<script setup lang="ts">
import { computed, useId } from 'vue'
import { Primitive, CheckboxRoot, CheckboxIndicator, Label, useForwardProps } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig, useComponentUiTheme } from '#imports'
import { useFormField } from '../composables/useFormField'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<CheckboxProps>()
const slots = defineSlots<CheckboxSlots>()
const emits = defineEmits<CheckboxEmits>()

const modelValue = defineModel<boolean | 'indeterminate'>({ default: undefined })

const appConfig = useAppConfig() as Checkbox['AppConfig']
const uiTheme = useComponentUiTheme('checkbox', () => ({ slots: props.ui }))

const rootProps = useForwardProps(reactivePick(props, 'required', 'value', 'defaultValue'))

const { id: _id, emitFormChange, emitFormInput, size, color, name, disabled, ariaAttrs } = useFormField<CheckboxProps>(props)
const id = _id.value ?? useId()

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.checkbox || {}) })({
  size: size.value,
  color: color.value,
  variant: props.variant,
  indicator: props.indicator,
  required: props.required,
  disabled: disabled.value
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
  <Primitive :as="(!variant || variant === 'list') ? as : Label" :class="ui.root({ class: [uiTheme?.slots?.root, props.class] })">
    <div :class="ui.container({ class: uiTheme?.slots?.container })">
      <CheckboxRoot
        :id="id"
        v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
        v-model="modelValue"
        :name="name"
        :disabled="disabled"
        :class="ui.base({ class: uiTheme?.slots?.base })"
        @update:model-value="onUpdate"
      >
        <template #default="{ modelValue }">
          <CheckboxIndicator :class="ui.indicator({ class: uiTheme?.slots?.indicator })">
            <UIcon v-if="modelValue === 'indeterminate'" :name="indeterminateIcon || appConfig.ui.icons.minus" :class="ui.icon({ class: uiTheme?.slots?.icon })" />
            <UIcon v-else :name="icon || appConfig.ui.icons.check" :class="ui.icon({ class: uiTheme?.slots?.icon })" />
          </CheckboxIndicator>
        </template>
      </CheckboxRoot>
    </div>

    <div v-if="(label || !!slots.label) || (description || !!slots.description)" :class="ui.wrapper({ class: uiTheme?.slots?.wrapper })">
      <component :is="(!variant || variant === 'list') ? Label : 'p'" v-if="label || !!slots.label" :for="id" :class="ui.label({ class: uiTheme?.slots?.label })">
        <slot name="label" :label="label">
          {{ label }}
        </slot>
      </component>
      <p v-if="description || !!slots.description" :class="ui.description({ class: uiTheme?.slots?.description })">
        <slot name="description" :description="description">
          {{ description }}
        </slot>
      </p>
    </div>
  </Primitive>
</template>
