<template>
  <div :class="ui.wrapper" :data-n-ids="attrs['data-n-ids']">
    <div :class="ui.container">
      <input
        :id="inputId"
        v-model="toggle"
        :name="name"
        :required="required"
        :value="value"
        :disabled="disabled"
        :indeterminate="indeterminate"
        type="checkbox"
        :class="inputClass"
        v-bind="attrs"
        @change="onChange"
      >
    </div>
    <div v-if="label || $slots.label" :class="ui.inner">
      <label :for="inputId" :class="ui.label">
        <slot name="label" :label="label">{{ label }}</slot>
        <span v-if="required" :class="ui.required">*</span>
      </label>
      <p v-if="help || $slots.help" :class="ui.help">
        <slot name="help" :help="help">
          {{ help }}
        </slot>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, toRef, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import { useFormGroup } from '../../composables/useFormGroup'
import { mergeConfig } from '../../utils'
import type { DeepPartial, Strategy } from '../../types/index'
// @ts-expect-error
import appConfig from '#build/app.config'
import { checkbox } from '#ui/ui.config'
import type colors from '#ui-colors'
import { useId } from '#app'

const config = mergeConfig<typeof checkbox>(appConfig.ui.strategy, appConfig.ui.checkbox, checkbox)

export default defineComponent({
  inheritAttrs: false,
  props: {
    id: {
      type: String,
      default: () => null
    },
    value: {
      type: [String, Number, Boolean, Object],
      default: null
    },
    modelValue: {
      type: [Boolean, Array] as PropType<boolean | Array<any> | null>,
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
    indeterminate: {
      type: Boolean,
      default: undefined
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
      type: String as PropType<typeof colors[number]>,
      default: () => config.default.color,
      validator(value: string) {
        return appConfig.ui.colors.includes(value)
      }
    },
    inputClass: {
      type: String,
      default: ''
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<DeepPartial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const { ui, attrs } = useUI('checkbox', toRef(props, 'ui'), config, toRef(props, 'class'))

    const { emitFormChange, color, name, inputId: _inputId } = useFormGroup(props)
    const inputId = _inputId.value ?? useId()

    const toggle = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emit('update:modelValue', value)
      }
    })

    const onChange = (event: Event) => {
      emit('change', (event.target as HTMLInputElement).checked)
      emitFormChange()
    }

    const inputClass = computed(() => {
      return twMerge(twJoin(
        ui.value.base,
        ui.value.form,
        ui.value.rounded,
        ui.value.background,
        ui.value.border,
        color.value && ui.value.ring.replaceAll('{color}', color.value),
        color.value && ui.value.color.replaceAll('{color}', color.value)
      ), props.inputClass)
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      toggle,
      inputId,
      // eslint-disable-next-line vue/no-dupe-keys
      name,
      // eslint-disable-next-line vue/no-dupe-keys
      inputClass,
      onChange
    }
  }
})
</script>
