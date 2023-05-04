<template>
  <div :class="ui.wrapper">
    <div class="flex items-center h-5">
      <input
        :id="name"
        v-model="isChecked"
        :name="name"
        :required="required"
        :value="value"
        :disabled="disabled"
        type="checkbox"
        :class="[ui.base, ui.custom]"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      >
    </div>
    <div v-if="label || $slots.label" class="ml-3 text-sm">
      <label :for="name" :class="ui.label">
        <slot name="label">{{ label }}</slot>
        <span v-if="required" :class="ui.required">*</span>
      </label>
      <p v-if="help" :class="ui.help">
        {{ help }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  props: {
    value: {
      type: [String, Number, Boolean],
      default: null
    },
    modelValue: {
      type: [Boolean, Array],
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
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.checkbox>>,
      default: () => appConfig.ui.checkbox
    }
  },
  emits: ['update:modelValue', 'focus', 'blur'],
  setup (props, { emit }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.checkbox>>(() => defu({}, props.ui, appConfig.ui.checkbox))

    const isChecked = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
      }
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      isChecked
    }
  }
})
</script>
