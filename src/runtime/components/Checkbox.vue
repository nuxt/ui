<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { CheckboxRootProps, CheckboxRootEmits } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/checkbox'
import type { IconProps } from '#ui/types'

const appConfig = _appConfig as AppConfig & { ui: { checkbox: Partial<typeof theme> } }

const checkbox = tv({ extend: tv(theme), ...(appConfig.ui?.checkbox || {}) })

type CheckboxVariants = VariantProps<typeof checkbox>

export interface CheckboxProps extends Omit<CheckboxRootProps, 'asChild'> {
  id?: string
  name?: string
  description?: string
  label?: string
  color?: CheckboxVariants['color']
  size?: CheckboxVariants['size']
  icon?: IconProps['name']
  indeterminateIcon?: IconProps['name']
  indeterminate?: boolean
  class?: any
  ui?: Partial<typeof checkbox.slots>
}

export interface CheckboxEmits extends CheckboxRootEmits {}

export interface CheckboxSlots {
  label(props: { label?: string }): any
  description(props: { description?: string }): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckboxRoot, CheckboxIndicator, Label, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { useId, useAppConfig, useFormField } from '#imports'

const props = defineProps<CheckboxProps>()
const emits = defineEmits<CheckboxEmits>()
defineSlots<CheckboxSlots>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'defaultChecked', 'disabled', 'required', 'name'), emits)

const appConfig = useAppConfig()
const { inputId: _inputId, emitFormChange, size, color, name, disabled } = useFormField<CheckboxProps>(props)
const inputId = _inputId.value ?? useId()

const modelValue = defineModel<boolean | undefined>({
  default: undefined,
  set (value) {
    return value
  }
})

const indeterminate = computed(() => (modelValue.value === undefined && props.indeterminate))

const checked = computed({
  get () {
    return indeterminate.value ? 'indeterminate' : modelValue.value
  },
  set (value) {
    modelValue.value = value === 'indeterminate' ? undefined : value
  }
})

// FIXME: I think there's a race condition between this and the v-model event.
// This must be triggered after the value updates, otherwise the form validates
// the previous value.
function onChecked () {
  emitFormChange()
}

const ui = computed(() => tv({ extend: checkbox, slots: props.ui })({
  size: size.value,
  color: color.value,
  required: props.required,
  disabled: disabled.value,
  checked: modelValue.value ?? props.defaultChecked,
  indeterminate: indeterminate.value
}))
</script>

<template>
  <div :class="ui.root({ class: props.class })">
    <div :class="ui.container()">
      <CheckboxRoot
        :id="inputId"
        v-model:checked="checked"
        v-bind="{ ...rootProps, name, disabled }"
        :class="ui.base()"
        @update:checked="onChecked"
      >
        <CheckboxIndicator :class="ui.indicator()">
          <UIcon v-if="indeterminate" :name="indeterminateIcon || appConfig.ui.icons.minus" :class="ui.icon()" />
          <UIcon v-else :name="icon || appConfig.ui.icons.check" :class="ui.icon()" />
        </CheckboxIndicator>
      </CheckboxRoot>
    </div>

    <div v-if="(label || $slots.label) || (description || $slots.description)" :class="ui.wrapper()">
      <Label v-if="label || $slots.label" :for="inputId" :class="ui.label()">
        <slot name="label" :label="label">
          {{ label }}
        </slot>
      </Label>
      <p v-if="description || $slots.description" :class="ui.description()">
        <slot name="description" :description="description">
          {{ description }}
        </slot>
      </p>
    </div>
  </div>
</template>
