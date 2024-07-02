<script lang="ts">
import type { InputHTMLAttributes } from 'vue'
import { tv, type VariantProps } from 'tailwind-variants'
import type { CheckboxRootProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/checkbox'

const appConfig = _appConfig as AppConfig & { ui: { checkbox: Partial<typeof theme> } }

const checkbox = tv({ extend: tv(theme), ...(appConfig.ui?.checkbox || {}) })

type CheckboxVariants = VariantProps<typeof checkbox>

export interface CheckboxProps extends Pick<CheckboxRootProps, 'disabled' | 'required' | 'name' | 'value' | 'id'> {
  label?: string
  description?: string
  color?: CheckboxVariants['color']
  size?: CheckboxVariants['size']
  /**
   * The icon displayed when checked.
   * @defaultValue appConfig.ui.icons.check
   */
  icon?: string
  indeterminate?: InputHTMLAttributes['indeterminate']
  /**
   * The icon displayed when the checkbox is indeterminate.
   * @defaultValue appConfig.ui.icons.minus
   */
  indeterminateIcon?: string
  /** The checked state of the checkbox when it is initially rendered. Use when you do not need to control its checked state. */
  defaultValue?: boolean
  class?: any
  ui?: Partial<typeof checkbox.slots>
}

export interface CheckboxSlots {
  label(props: { label?: string }): any
  description(props: { description?: string }): any
}

export interface CheckboxEmits {
  (e: 'update:modelValue', payload: boolean): void
  (e: 'change', payload: Event): void
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckboxRoot, CheckboxIndicator, Label, useForwardProps } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { useId, useAppConfig, useFormField } from '#imports'

const props = defineProps<CheckboxProps>()
const slots = defineSlots<CheckboxSlots>()
const emits = defineEmits<CheckboxEmits>()

const modelValue = defineModel<boolean | undefined>({ default: undefined })

const rootProps = useForwardProps(reactivePick(props, 'required', 'value'))

const appConfig = useAppConfig()
const { id: _id, emitFormChange, emitFormInput, size, color, name, disabled } = useFormField<CheckboxProps>(props)
const id = _id.value ?? useId()

const indeterminate = computed(() => (modelValue.value === undefined && props.indeterminate))

const checked = computed({
  get() {
    return indeterminate.value ? 'indeterminate' : modelValue.value
  },
  set(value) {
    modelValue.value = value === 'indeterminate' ? undefined : value
  }
})

const ui = computed(() => tv({ extend: checkbox, slots: props.ui })({
  size: size.value,
  color: color.value,
  required: props.required,
  disabled: disabled.value,
  checked: (modelValue.value ?? props.defaultValue) || indeterminate.value
}))

function onUpdate(value: any) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)
  emitFormChange()
  emitFormInput()
}
</script>

<template>
  <div :class="ui.root({ class: props.class })">
    <div :class="ui.container()">
      <CheckboxRoot
        :id="id"
        v-model:checked="checked"
        :default-checked="defaultValue"
        v-bind="rootProps"
        :name="name"
        :disabled="disabled"
        :class="ui.base()"
        @update:checked="onUpdate"
      >
        <CheckboxIndicator as-child>
          <UIcon v-if="indeterminate" :name="indeterminateIcon || appConfig.ui.icons.minus" :class="ui.icon()" />
          <UIcon v-else :name="icon || appConfig.ui.icons.check" :class="ui.icon()" />
        </CheckboxIndicator>
      </CheckboxRoot>
    </div>

    <div v-if="(label || !!slots.label) || (description || !!slots.description)" :class="ui.wrapper()">
      <Label v-if="label || !!slots.label" :for="id" :class="ui.label()">
        <slot name="label" :label="label">
          {{ label }}
        </slot>
      </Label>
      <p v-if="description || !!slots.description" :class="ui.description()">
        <slot name="description" :description="description">
          {{ description }}
        </slot>
      </p>
    </div>
  </div>
</template>
