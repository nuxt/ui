<template>
  <div :class="wrapperClass">
    <div class="flex items-center h-5">
      <input
        :id="`${name}-${value}`"
        v-model="isChecked"
        :name="name"
        :required="required"
        :value="value"
        :disabled="disabled"
        type="radio"
        :class="radioClass"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      >
    </div>
    <div v-if="label || $slots.label" class="ml-3 text-sm">
      <label :for="`${name}-${value}`" :class="labelClass">
        <slot name="label">{{ label }}</slot>
        <span v-if="required" :class="requiredClass">*</span>
      </label>
      <p v-if="help" :class="helpClass">
        {{ help }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { classNames } from '../../utils'
import $ui from '#build/ui'

const props = defineProps({
  value: {
    type: [String, Number, Boolean],
    default: null
  },
  modelValue: {
    type: [String, Number, Boolean, Object],
    default: null
  },
  name: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  help: {
    type: String,
    default: null
  },
  label: {
    type: String,
    default: null
  },
  required: {
    type: Boolean,
    default: false
  },
  wrapperClass: {
    type: String,
    default: () => $ui.radio.wrapper
  },
  baseClass: {
    type: String,
    default: () => $ui.radio.base
  },
  labelClass: {
    type: String,
    default: () => $ui.radio.label
  },
  requiredClass: {
    type: String,
    default: () => $ui.radio.required
  },
  helpClass: {
    type: String,
    default: () => $ui.radio.help
  },
  customClass: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

const isChecked = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})

const radioClass = computed(() => {
  return classNames(
    props.baseClass,
    props.customClass
  )
})
</script>

<script lang="ts">
export default { name: 'URadio' }
</script>
