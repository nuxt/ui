<template>
  <div :class="ui.wrapper">
    <div class="flex items-center h-5">
      <input
        :id="`${name}-${value}`"
        v-model="pick"
        :name="name"
        :required="required"
        :value="value"
        :disabled="disabled"
        type="radio"
        class="form-radio"
        :class="inputClass"
        v-bind="$attrs"
      >
    </div>
    <div v-if="label || $slots.label" class="ml-3 text-sm">
      <label :for="`${name}-${value}`" :class="ui.label">
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
import { classNames } from '../../utils'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  inheritAttrs: false,
  props: {
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
    color: {
      type: String,
      default: () => appConfig.ui.radio.default.color,
      validator (value: string) {
        return appConfig.ui.colors.includes(value)
      }
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.radio>>,
      default: () => appConfig.ui.radio
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.radio>>(() => defu({}, props.ui, appConfig.ui.radio))

    const pick = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
      }
    })

    const inputClass = computed(() => {
      return classNames(
        ui.value.base,
        ui.value.background,
        ui.value.border,
        ui.value.ring.replaceAll('{color}', props.color),
        ui.value.color.replaceAll('{color}', props.color)
      )
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      pick,
      inputClass
    }
  }
})
</script>
