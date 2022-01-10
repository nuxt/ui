<template>
  <div :class="wrapperClass">
    <div class="flex items-center h-5">
      <input
        :id="name"
        v-model="isChecked"
        :name="name"
        :required="required"
        :value="value"
        :disabled="disabled"
        type="checkbox"
        :class="inputClass"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      >
    </div>
    <div v-if="label || $slots.label" class="ml-3 text-sm">
      <label :for="name" :class="labelClass">
        <slot name="label">{{ label }}</slot>
        <span v-if="required" :class="requiredClass">*</span>
      </label>
      <p v-if="help" :class="helpClass">
        {{ help }}
      </p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { classNames } from '../../utils'
import $ui from '#build/ui'

export default {
  props: {
    value: {
      type: [String, Number, Boolean],
      default: null
    },
    modelValue: {
      type: [String, Number, Boolean, Array],
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
      default: () => $ui.checkbox.wrapper
    },
    baseClass: {
      type: String,
      default: () => $ui.checkbox.base
    },
    labelClass: {
      type: String,
      default: () => $ui.checkbox.label
    },
    requiredClass: {
      type: String,
      default: () => $ui.checkbox.required
    },
    helpClass: {
      type: String,
      default: () => $ui.checkbox.help
    },
    customClass: {
      type: String,
      default: null
    }
  },
  emits: ['update:modelValue', 'focus', 'blur'],
  setup (props, { emit }) {
    const isChecked = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
      }
    })

    const inputClass = computed(() => {
      return classNames(
        props.baseClass,
        props.customClass
      )
    })

    return {
      isChecked,
      inputClass
    }
  }
}
</script>
