<template>
  <div :class="ui.wrapper">
    <fieldset v-bind="attrs">
      <legend v-if="legend || $slots.legend" :class="ui.legend">
        <slot name="legend">
          {{ legend }}
        </slot>
      </legend>
      <URadio
        v-for="option in normalizedOptions"
        :key="option.value"
        :label="option.label"
        :model-value="modelValue"
        :value="option.value"
        :disabled="disabled"
        @change="onUpdate(option.value)"
      >
        <template #label>
          <slot name="label" v-bind="{ option }" />
        </template>
      </URadio>
    </fieldset>
  </div>
</template>

<script lang="ts">
import URadio from './Radio.vue'
import { computed, defineComponent, provide, toRef } from 'vue'
import type { PropType } from 'vue'
import { useUI } from '../../composables/useUI'
import { useFormGroup } from '../../composables/useFormGroup'
import { mergeConfig, get } from '../../utils'
import type { Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { radioGroup } from '#ui/ui.config'
import colors from '#ui-colors'

const config = mergeConfig<typeof radioGroup>(appConfig.ui.strategy, appConfig.ui.select, radioGroup)

export default defineComponent({
  components: {
    URadio
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number, Object],
      default: ''
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
    }
  },
  emits: ['update:modelValue', 'change'],
  setup (props, { emit }) {
    const { ui, attrs } = useUI('radioGroup', toRef(props, 'ui'), config, toRef(props, 'class'))

    const { emitFormChange, color, name } = useFormGroup(props, config)
    provide('radio-group', { color, name })

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
      attrs,
      normalizedOptions,
      // eslint-disable-next-line vue/no-dupe-keys
      onUpdate
    }
  }
})
</script>
