<template>
  <div :class="wrapperClass">
    <select
      :id="name"
      :name="name"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :class="selectClass"
      @input="updateValue($event.target.value)"
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
    <div v-if="icon" class="absolute inset-y-0 left-0 flex items-center pointer-events-none" :class="iconPadding">
      <Icon :name="icon" :class="iconClass" />
    </div>
  </div>
</template>

<script>
import get from 'lodash/get'

import Icon from '../elements/Icon'

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
    readonly: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'md',
      validator (value) {
        return ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'].includes(value)
      }
    },
    wrapperClass: {
      type: String,
      default: 'relative'
    },
    baseClass: {
      type: String,
      default: 'block w-full disabled:cursor-not-allowed bg-tw-white text-tw-gray-700 disabled:bg-tw-gray-50 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:focus:border-primary-500 border border-tw-gray-300 rounded-md shadow-sm focus:outline-none'
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
  computed: {
    sizeClass () {
      return {
        xxs: 'text-xs',
        xs: 'text-xs',
        sm: 'text-sm leading-4',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-base'
      }[this.size]
    },
    paddingClass () {
      return ({
        xxs: `${this.icon ? 'pl-7' : 'pl-2'} pr-7 py-1.5`,
        xs: `${this.icon ? 'pl-8' : 'pl-3'} pr-9 py-1.5`,
        sm: `${this.icon ? 'pl-8' : 'pl-3'} pr-9 py-2`,
        md: `${this.icon ? 'pl-10' : 'pl-3'} pr-10 py-2`,
        lg: `${this.icon ? 'pl-10' : 'pl-3'} pr-10 py-2`,
        xl: `${this.icon ? 'pl-12' : 'pl-4'} pr-12 py-3`
      })[this.size]
    },
    iconClass () {
      return ({
        xxs: 'w-3 h-3',
        xs: 'w-4 h-4',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-5 h-5',
        xl: 'w-5 h-5'
      })[this.size]
    },
    iconPadding () {
      return ({
        xxs: 'pl-3',
        xs: 'pl-3',
        sm: 'pl-3',
        md: 'pl-3',
        lg: 'pl-3',
        xl: 'pl-4'
      })[this.size]
    },
    selectClass () {
      return [
        this.baseClass,
        this.customClass,
        this.sizeClass,
        this.paddingClass
      ].join(' ')
    },
    normalizedOptions () {
      return this.options.map(option => this.normalizeOption(option))
    },
    normalizedOptionsWithPlaceholder () {
      if (!this.placeholder) {
        return this.normalizedOptions
      }
      const { normalizedOptions } = this
      normalizedOptions.unshift({
        [this.valueAttribute]: null,
        [this.textAttribute]: this.placeholder
      })
      return normalizedOptions
    },
    normalizedValue () {
      const foundOption = this.normalizedOptionsWithPlaceholder.find(option => option.value === this.modelValue)
      if (!foundOption) {
        return null
      }

      return foundOption.value
    }
  },
  methods: {
    guessOptionValue (option) {
      return get(option, this.valueAttribute, get(option, this.textAttribute))
    },
    guessOptionText (option) {
      return get(option, this.textAttribute, get(option, this.valueAttribute))
    },
    normalizeOption (option) {
      if (['string', 'number', 'boolean'].includes(typeof option)) {
        return {
          [this.valueAttribute]: option,
          [this.textAttribute]: option
        }
      }

      return {
        ...option,
        [this.valueAttribute]: this.guessOptionValue(option),
        [this.textAttribute]: this.guessOptionText(option)
      }
    },
    updateValue (value) {
      this.$emit('update:modelValue', value)
    }
  }
}
</script>
