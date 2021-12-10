<template>
  <div>
    <slot name="label">
      <div class="flex content-center justify-between">
        <label
          v-if="label"
          :for="name"
          :class="labelClass"
          @click="onLabelClick"
        >
          {{ label }}
          <span v-if="required" :class="requiredClass">*</span>
        </label>
        <span v-if="$slots.hint || hint" :class="hintClass">
          <slot name="hint">{{ hint }}</slot>
        </span>
      </div>
    </slot>
    <div :class="!!label && containerClass">
      <slot />
      <p v-if="help" :class="helpClass">
        {{ help }}
      </p>
    </div>
  </div>
</template>

<script>
import $ui from '#build/ui'

export default {
  props: {
    name: {
      type: String,
      required: true
    },
    label: {
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
    containerClass: {
      type: String,
      default: () => $ui.inputGroup.container
    },
    labelClass: {
      type: String,
      default: () => $ui.inputGroup.label
    },
    requiredClass: {
      type: String,
      default: () => $ui.inputGroup.required
    },
    hintClass: {
      type: String,
      default: () => $ui.inputGroup.hint
    },
    helpClass: {
      type: String,
      default: () => $ui.inputGroup.help
    }
  }
}
</script>
