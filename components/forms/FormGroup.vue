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
import $ui from '#build/ui'

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
    default: () => $ui.formGroup.wrapper
  },
  containerClass: {
    type: String,
    default: () => $ui.formGroup.container
  },
  labelClass: {
    type: String,
    default: () => $ui.formGroup.label
  },
  labelWrapperClass: {
    type: String,
    default: () => $ui.formGroup.labelWrapper
  },
  descriptionClass: {
    type: String,
    default: () => $ui.formGroup.description
  },
  requiredClass: {
    type: String,
    default: () => $ui.formGroup.required
  },
  hintClass: {
    type: String,
    default: () => $ui.formGroup.hint
  },
  helpClass: {
    type: String,
    default: () => $ui.formGroup.help
  }
})
</script>

<script lang="ts">
export default { name: 'UFormGroup' }
</script>
