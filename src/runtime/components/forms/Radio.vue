<template>
  <div :class="ui.wrapper">
    <div class="flex items-center h-5">
      <input
        :id="id"
        v-model="pick"
        :name="name"
        :required="required"
        :value="value"
        :disabled="disabled"
        type="radio"
        class="form-radio"
        :class="inputClass"
        v-bind="attrs"
      >
    </div>
    <div v-if="label || $slots.label" class="ms-3 text-sm">
      <label :for="id" :class="ui.label">
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
import { computed, defineComponent, inject, toRef } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { radio } from '#ui/ui.config'
import colors from '#ui-colors'
import { uid } from '../../utils/uid'
import { useFormGroup } from '../../composables/useFormGroup'

const config = mergeConfig<typeof radio>(appConfig.ui.strategy, appConfig.ui.radio, radio)

export default defineComponent({
  inheritAttrs: false,
  props: {
    id: {
      type: String,
      // A default value is needed here to bind the label
      default: () => uid()
    },
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
      type: String as PropType<typeof colors[number]>,
      default: () => config.default.color,
      validator (value: string) {
        return appConfig.ui.colors.includes(value)
      }
    },
    inputClass: {
      type: String,
      default: null
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: undefined
    },
    ui: {
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  emits: ['update:modelValue', 'change'],
  setup (props, { emit }) {
    const { ui, attrs } = useUI('radio', toRef(props, 'ui'), config, toRef(props, 'class'))

    const radioGroup = inject('radio-group', null)
    const { emitFormChange, color, name } = radioGroup ?? useFormGroup(props, config)

    const pick = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
        emit('change', value)

        if (!radioGroup) {
          emitFormChange()
        }
      }
    })

    const inputClass = computed(() => {
      return twMerge(twJoin(
        ui.value.base,
        ui.value.background,
        ui.value.border,
        ui.value.ring.replaceAll('{color}', color.value),
        ui.value.color.replaceAll('{color}', color.value)
      ), props.inputClass)
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      pick,
      // eslint-disable-next-line vue/no-dupe-keys
      name,
      // eslint-disable-next-line vue/no-dupe-keys
      inputClass
    }
  }
})
</script>
