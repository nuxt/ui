<template>
  <div :class="wrapperClass">
    <select
      :id="name"
      :name="name"
      :value="modelValue"
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
            :disabled="childOption.disabled"
            v-text="childOption[textAttribute]"
          />
        </optgroup>
        <option
          v-else
          :key="`${option[valueAttribute]}-${index}`"
          :value="option[valueAttribute]"
          :selected="option[valueAttribute] === normalizedValue"
          :disabled="option.disabled"
          v-text="option[textAttribute]"
        />
      </template>
    </select>

    <div v-if="icon" :class="iconWrapperClass">
      <Icon :name="icon" :class="iconClass" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { get } from 'lodash-es'
import Icon from '../elements/Icon'
import { classNames } from '../../utils'
import $ui from '#build/ui'

const props = defineProps({
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
    validator (value: string) {
      return Object.keys($ui.select.size).includes(value)
    }
  },
  wrapperClass: {
    type: String,
    default: () => $ui.select.wrapper
  },
  baseClass: {
    type: String,
    default: () => $ui.select.base
  },
  iconBaseClass: {
    type: String,
    default: () => $ui.select.icon.base
  },
  customClass: {
    type: String,
    default: null
  },
  appearance: {
    type: String,
    default: 'default',
    validator (value: string) {
      return Object.keys($ui.select.appearance).includes(value)
    }
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
})

const emit = defineEmits(['update:modelValue'])

const onInput = (value: string) => {
  emit('update:modelValue', value)
}

const guessOptionValue = (option: any) => {
  return get(option, props.valueAttribute, get(option, props.textAttribute))
}

const guessOptionText = (option: any) => {
  return get(option, props.textAttribute, get(option, props.valueAttribute))
}

const normalizeOption = (option: any) => {
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
      [props.valueAttribute]: '',
      [props.textAttribute]: props.placeholder,
      disabled: true
    },
    ...normalizedOptions.value
  ]
})

const normalizedValue = computed(() => {
  const foundOption = normalizedOptionsWithPlaceholder.value.find(option => option.value === props.modelValue)
  if (!foundOption) {
    return ''
  }

  return foundOption.value
})

const selectClass = computed(() => {
  return classNames(
    props.baseClass,
    $ui.select.size[props.size],
    $ui.select.spacing[props.size],
    $ui.select.appearance[props.appearance],
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

const iconWrapperClass = $ui.select.icon.leading.wrapper
</script>
