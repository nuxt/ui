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
import { $theme } from '#theme'

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
    default () { return $theme('ui.radio.wrapper').value }
  },
  baseClass: {
    type: String,
    default () { return $theme('ui.radio.base').value }
  },
  labelClass: {
    type: String,
    default () { return $theme('ui.radio.label').value }
  },
  requiredClass: {
    type: String,
    default () { return $theme('ui.radio.required').value }
  },
  helpClass: {
    type: String,
    default () { return $theme('ui.radio.help').value }
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
