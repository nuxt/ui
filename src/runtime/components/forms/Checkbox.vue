<template>
  <div :class="ui.wrapper">
    <div class="flex items-center h-5">
      <input
        :id="name"
        v-model="toggle"
        :name="name"
        :required="required"
        :value="value"
        :disabled="disabled"
        :checked="checked"
        :indeterminate="indeterminate"
        type="checkbox"
        class="form-checkbox"
        :class="inputClass"
        v-bind="$attrs"
        @change="onChange"
      >
    </div>
    <div v-if="label || $slots.label" class="ms-3 text-sm">
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
import { classNames } from '../../utils'
import { useFormEvents } from '../../composables/useFormEvents'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number, Boolean, Object],
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
    checked: {
      type: Boolean,
      default: false
    },
    indeterminate: {
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
      default: () => appConfig.ui.checkbox.default.color,
      validator (value: string) {
        return appConfig.ui.colors.includes(value)
      }
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.checkbox>>,
      default: () => appConfig.ui.checkbox
    }
  },
  emits: ['update:modelValue', 'change'],
  setup (props, { emit }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.checkbox>>(() => defu({}, props.ui, appConfig.ui.checkbox))

    const { emitFormBlur } = useFormEvents()

    const toggle = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
      }
    })

    const onChange = (event: Event) => {
      emit('change', event)
      emitFormBlur()
    }

    const inputClass = computed(() => {
      return classNames(
        ui.value.base,
        ui.value.rounded,
        ui.value.background,
        ui.value.border,
        ui.value.ring.replaceAll('{color}', props.color),
        ui.value.color.replaceAll('{color}', props.color)
      )
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      toggle,
      inputClass,
      onChange
    }
  }
})
</script>
