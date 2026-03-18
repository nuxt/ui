<script lang="ts">
import type { CheckboxRootProps, CheckboxRootEmits } from 'reka-ui'
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/checkbox'
import type { IconProps } from '../types'
import type { ButtonHTMLAttributes } from '../types/html'
import type { ComponentConfig } from '../types/tv'

type Checkbox = ComponentConfig<typeof theme, AppConfig, 'checkbox'>

export interface CheckboxProps<T = boolean> extends Pick<CheckboxRootProps<T>, 'disabled' | 'required' | 'name' | 'value' | 'id' | 'defaultValue' | 'modelValue' | 'trueValue' | 'falseValue'>, /** @vue-ignore */ Omit<ButtonHTMLAttributes, 'type' | 'disabled' | 'name'> {
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

export interface CheckboxEmits<T = boolean> extends CheckboxRootEmits<T> {
  change: [event: Event]
}

export interface CheckboxSlots {
  label?(props: { label: string | undefined }): VNode[]
  description?(props: { description: string | undefined }): VNode[]
}
</script>

<script setup lang="ts" generic="T = boolean">
import { computed, useAttrs, useId } from 'vue'
import { Primitive, CheckboxRoot, CheckboxIndicator, Label, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { useFormField } from '../composables/useFormField'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<CheckboxProps<T>>()
const slots = defineSlots<CheckboxSlots>()
const emits = defineEmits<CheckboxEmits<T>>()

const appConfig = useAppConfig() as Checkbox['AppConfig']
const uiProp = useComponentUI('checkbox', props)

const rootProps = useForwardPropsEmits(reactivePick(props, 'required', 'value', 'defaultValue', 'modelValue', 'trueValue', 'falseValue'), emits)

const { id: _id, emitFormChange, emitFormInput, size, color, name, disabled, ariaAttrs } = useFormField<CheckboxProps<T>>(props)
const id = _id.value ?? useId()

const attrs = useAttrs()
// Omit `data-state` to prevent conflicts with parent components (e.g. TooltipTrigger)
const forwardedAttrs = computed(() => {
  const { 'data-state': _, ...rest } = attrs
  return rest
})

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
  <Primitive :as="(!variant || variant === 'list') ? as : Label" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div data-slot="container" :class="ui.container({ class: uiProp?.container })">
      <CheckboxRoot
        :id="id"
        v-bind="{ ...rootProps, ...forwardedAttrs, ...ariaAttrs }"
        :name="name"
        :disabled="disabled"
        data-slot="base"
        :class="ui.base({ class: uiProp?.base })"
        @update:model-value="onUpdate"
      >
        <template #default="{ state }">
          <CheckboxIndicator data-slot="indicator" :class="ui.indicator({ class: uiProp?.indicator })">
            <UIcon v-if="state === 'indeterminate'" :name="indeterminateIcon || appConfig.ui.icons.minus" data-slot="icon" :class="ui.icon({ class: uiProp?.icon })" />
            <UIcon v-else :name="icon || appConfig.ui.icons.check" data-slot="icon" :class="ui.icon({ class: uiProp?.icon })" />
          </CheckboxIndicator>
        </template>
      </CheckboxRoot>
    </div>

    <div v-if="(label || !!slots.label) || (description || !!slots.description)" data-slot="wrapper" :class="ui.wrapper({ class: uiProp?.wrapper })">
      <component :is="(!variant || variant === 'list') ? Label : 'p'" v-if="label || !!slots.label" :for="id" data-slot="label" :class="ui.label({ class: uiProp?.label })">
        <slot name="label" :label="label">
          {{ label }}
        </slot>
      </component>
      <p v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: uiProp?.description })">
        <slot name="description" :description="description">
          {{ description }}
        </slot>
      </p>
    </div>
  </Primitive>
</template>
