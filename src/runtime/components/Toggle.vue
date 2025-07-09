<script lang="ts">
import { useForwardProps, type ToggleProps as RekaToggleProps } from 'reka-ui'
import type { ButtonProps } from './Button.vue'

export interface ToggleProps extends
  Pick<RekaToggleProps, 'disabled' | 'name' | 'required' | 'defaultValue'>,
  Pick<ButtonProps, 'label' | 'icon' | 'trailingIcon' | 'color' | 'variant' | 'activeColor' | 'activeVariant' | 'size' | 'class' | 'ui'> {
  as?: any
  loading?: boolean
}

export type ToggleEmits = {
  change: [payload: Event]
}
</script>

<script setup lang="ts">
import { useId } from 'vue'
import { reactivePick } from '@vueuse/core'
import { useFormField } from '../composables/useFormField'
import { Toggle } from 'reka-ui'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<ToggleProps>(), {
  color: 'neutral',
  variant: 'soft',
  activeVariant: 'solid'
})
const emits = defineEmits<ToggleEmits>()

const modelValue = defineModel<boolean>({ default: undefined })

const rootProps = useForwardProps(reactivePick(props, 'required', 'defaultValue'))

const { id: _id, emitFormChange, emitFormInput, size, name, disabled, ariaAttrs } = useFormField<ToggleProps>(props)

const id = _id.value ?? useId()

function onUpdate(value: boolean) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)
  emitFormChange()
  emitFormInput()
}
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <Toggle
    :id="id"
    v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
    v-model="modelValue"
    as-child
    :name="name"
    :disabled="disabled"
    @update:model-value="onUpdate"
  >
    <template #default="{ modelValue }">
      <UButton
        :icon="icon"
        :label="label"
        :color="color"
        :variant="variant"
        :active-color="activeColor"
        :active-variant="activeVariant"
        :active="modelValue"
        :size="size"
        :class="[props.class]"
        :ui="ui"
      />
    </template>
  </Toggle>
</template>
