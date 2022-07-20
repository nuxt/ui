<template>
  <div :class="wrapperClass">
    <div v-if="label || $slots.label" :class="labelWrapperClass">
      <label :for="name" :class="labelClass">
        <slot name="label">{{ label }}</slot>
        <span v-if="required" :class="requiredClass">*</span>
      </label>
      <span v-if="$slots.hint || hint" :class="hintClass">
        <slot name="hint">{{ hint }}</slot>
      </span>
    </div>
    <p v-if="description" :class="descriptionClass">
      {{ description }}
    </p>
    <div :class="!!label && containerClass">
      <slot />
      <p v-if="help" :class="helpClass">
        {{ help }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { $theme } from '#theme'

defineProps({
  name: {
    type: String,
    default: null
  },
  label: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  required: {
    type: Boolean,
    default: false
  },
  help: {
    type: String,
    default: null
  },
  hint: {
    type: String,
    default: null
  },
  wrapperClass: {
    type: String,
    default () { return $theme('ui.formGroup.wrapper').value }
  },
  containerClass: {
    type: String,
    default () { return $theme('ui.formGroup.container').value }
  },
  labelClass: {
    type: String,
    default () { return $theme('ui.formGroup.label').value }
  },
  labelWrapperClass: {
    type: String,
    default () { return $theme('ui.formGroup.labelWrapper').value }
  },
  descriptionClass: {
    type: String,
    default () { return $theme('ui.formGroup.description').value }
  },
  requiredClass: {
    type: String,
    default () { return $theme('ui.formGroup.required').value }
  },
  hintClass: {
    type: String,
    default () { return $theme('ui.formGroup.hint').value }
  },
  helpClass: {
    type: String,
    default () { return $theme('ui.formGroup.help').value }
  }
})
</script>

<script lang="ts">
export default { name: 'UFormGroup' }
</script>
