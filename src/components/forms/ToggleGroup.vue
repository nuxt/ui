<template>
  <SwitchGroup as="div">
    <slot name="label">
      <div class="flex content-center justify-between">
        <SwitchLabel
          v-if="label"
          :for="name"
          :class="labelClass"
        >
          {{ label }}
          <span v-if="required" :class="requiredClass">*</span>
        </SwitchLabel>
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
  </SwitchGroup>
</template>

<script>
import { SwitchGroup, SwitchLabel } from '@headlessui/vue'
import $ui from '#build/ui'

export default {
  components: {
    SwitchGroup,
    SwitchLabel
  },
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
      default: () => $ui.toggleGroup.container
    },
    labelClass: {
      type: String,
      default: () => $ui.toggleGroup.label
    },
    requiredClass: {
      type: String,
      default: () => $ui.toggleGroup.required
    },
    hintClass: {
      type: String,
      default: () => $ui.toggleGroup.hint
    },
    helpClass: {
      type: String,
      default: () => $ui.toggleGroup.help
    }
  }
}
</script>
