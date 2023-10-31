<template>
  <div :class="ui.wrapper">
    <fieldset v-bind="attrs">
      <legend v-if="legend || $slots.legend" :class="ui.legend">
        <slot name="legend">
          {{ legend }}
        </slot>
      </legend>
      <UCheckbox
        v-for="option in normalizedOptions"
        :key="option.value"
        :label="option.label"
        :model-value="modelValue"
        :value="option.value"
        :disabled="disabled"
        :ui="uiCheckbox"
        @change="onUpdate(option.value)"
      >
        <template #label>
          <slot name="label" v-bind="{ option }" />
        </template>
      </UCheckbox>
    </fieldset>
  </div>
</template>

<script lang="ts">
import UCheckbox from './Checkbox.vue'
import { computed, defineComponent, provide, toRef } from 'vue'
import type { PropType } from 'vue'
import { useUI } from '../../composables/useUI'
import { useFormGroup } from '../../composables/useFormGroup'
import { mergeConfig, get } from '../../utils'
import type { Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { checkboxGroup, checkbox } from '#ui/ui.config'
import colors from '#ui-colors'

const config = mergeConfig<typeof checkboxGroup>(appConfig.ui.strategy, appConfig.ui.checkboxGroup, checkboxGroup)
const configCheckbox = mergeConfig<typeof checkbox>(appConfig.ui.strategy, appConfig.ui.checkbox, checkbox)

export default defineComponent({
  components: {
    UCheckbox
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [Boolean, Array],
      default: null
    },
    name: {
      type: String,
      default: null
    },
    legend: {
      type: String,
      default: null
    },
    options: {
      type: Array,
      default: () => []
    },
    optionAttribute: {
      type: String,
      default: 'label'
    },
    valueAttribute: {
      type: String,
      default: 'value'
    },
    disabled: {
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
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: undefined
    },
    ui: {
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    },
    uiCheckbox: {
      type: Object as PropType<Partial<typeof configCheckbox & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  emits: ['update:modelValue', 'change'],
  setup (props, { emit }) {
    const { ui, attrs } = useUI('checkboxGroup', toRef(props, 'ui'), config, toRef(props, 'class'))
    const { ui: uiCheckbox } = useUI('checkbox', toRef(props, 'uiCheckbox'), configCheckbox)

    const { emitFormChange, color, name } = useFormGroup(props, config)
    provide('checkbox-group', { color, name })

    const onUpdate = (value: any) => {
      emit('update:modelValue', value)
      emit('change', value)
      emitFormChange()
    }

    const guessOptionValue = (option: any) => {
      return get(option, props.valueAttribute, get(option, props.optionAttribute))
    }

    const guessOptionText = (option: any) => {
      return get(option, props.optionAttribute, get(option, props.valueAttribute))
    }

    const normalizeOption = (option: any) => {
      if (['string', 'number', 'boolean'].includes(typeof option)) {
        return {
          value: option,
          label: option
        }
      }

      return {
        ...option,
        value: guessOptionValue(option),
        label: guessOptionText(option)
      }
    }

    const normalizedOptions = computed(() => {
      return props.options.map(option => normalizeOption(option))
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      // eslint-disable-next-line vue/no-dupe-keys
      uiCheckbox,
      attrs,
      normalizedOptions,
      // eslint-disable-next-line vue/no-dupe-keys
      onUpdate
    }
  }
})
</script>
