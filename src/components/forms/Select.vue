<template>
  <div :class="wrapperClass">
    <div v-if="icon" :class="iconWrapperClass">
      <Icon :name="icon" :class="iconClass" />
    </div>

    <select
      :id="name"
      :name="name"
      :required="required"
      :disabled="disabled"
      :class="selectClass"
      @input="onInput($event.target.value)"
    >
      <template v-for="(option, index) in normalizedOptionsWithPlaceholder">
        <optgroup
          v-if="option.children"
          :key="`${option[valueAttribute]}-optgroup-${index}`"
          :value="option[valueAttribute]"
          :label="option[textAttribute]"
        >
          <option
            v-for="(childOption, index2) in option.children"
            :key="`${childOption[valueAttribute]}-${index}-${index2}`"
            :value="childOption[valueAttribute]"
            :selected="childOption[valueAttribute] === normalizedValue"
            v-text="childOption[textAttribute]"
          />
        </optgroup>
        <option
          v-else
          :key="`${option[valueAttribute]}-${index}`"
          :value="option[valueAttribute]"
          :selected="option[valueAttribute] === normalizedValue"
          v-text="option[textAttribute]"
        />
      </template>
    </select>
  </div>
</template>

<script>
import get from 'lodash/get'
import Icon from '../elements/Icon'
import { classNames } from '../../utils'
import $ui from '#build/ui'

export default {
  components: {
    Icon
  },
  props: {
    modelValue: {
      type: [String, Number, Object],
      default: ''
    },
    name: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: 'md',
      validator (value) {
        return Object.keys($ui.select.size).includes(value)
      }
    },
    wrapperClass: {
      type: String,
      default: $ui.select.wrapper
    },
    baseClass: {
      type: String,
      default: $ui.select.base
    },
    iconBaseClass: {
      type: String,
      default: $ui.select.icon.base
    },
    customClass: {
      type: String,
      default: null
    },
    textAttribute: {
      type: String,
      default: 'text'
    },
    valueAttribute: {
      type: String,
      default: 'value'
    },
    icon: {
      type: String,
      default: null
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const select = ref(null)

    const onInput = (value) => {
      emit('update:modelValue', value)
    }

    const guessOptionValue = (option) => {
      return get(option, props.valueAttribute, get(option, props.textAttribute))
    }

    const guessOptionText = (option) => {
      return get(option, props.textAttribute, get(option, props.valueAttribute))
    }

    const normalizeOption = (option) => {
      if (['string', 'number', 'boolean'].includes(typeof option)) {
        return {
          [props.valueAttribute]: option,
          [props.textAttribute]: option
        }
      }

      return {
        ...option,
        [props.valueAttribute]: guessOptionValue(option),
        [props.textAttribute]: guessOptionText(option)
      }
    }

    const normalizedOptions = computed(() => {
      return props.options.map(option => normalizeOption(option))
    })

    const normalizedOptionsWithPlaceholder = computed(() => {
      if (!props.placeholder) {
        return normalizedOptions.value
      }

      return [
        {
          [props.valueAttribute]: null,
          [props.textAttribute]: props.placeholder
        },
        ...normalizedOptions.value
      ]
    })

    const normalizedValue = computed(() => {
      const foundOption = normalizedOptionsWithPlaceholder.value.find(option => option.value === props.modelValue)
      if (!foundOption) {
        return null
      }

      return foundOption.value
    })

    const selectClass = computed(() => {
      return classNames(
        props.baseClass,
        $ui.select.size[props.size],
        $ui.select.spacing[props.size],
        $ui.select.appearance.default,
        !!props.icon && $ui.select.leading.spacing[props.size],
        $ui.select.trailing.spacing[props.size],
        props.customClass
      )
    })

    const iconClass = computed(() => {
      return classNames(
        props.iconBaseClass,
        $ui.select.icon.size[props.size],
        !!props.icon && $ui.select.icon.leading.spacing[props.size]
      )
    })

    const iconWrapperClass = $ui.select.icon.leading.base

    return {
      select,
      onInput,
      guessOptionValue,
      guessOptionText,
      normalizeOption,
      normalizedOptions,
      normalizedOptionsWithPlaceholder,
      normalizedValue,
      selectClass,
      iconClass,
      iconWrapperClass
    }
  }
}
</script>
