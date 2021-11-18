<template>
  <div :class="wrapperClass">
    <div
      v-if="isLeading"
      class="absolute inset-y-0 left-0 flex items-center pointer-events-none"
    >
      <Icon
        :name="iconName"
        class="text-tw-gray-400"
        :class="iconClass"
      />
    </div>
    <input
      :id="name"
      ref="input"
      :name="name"
      :value="modelValue"
      :type="type"
      :required="required"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :autocomplete="autocomplete"
      :spellcheck="spellcheck"
      :class="inputClass"
      @input="updateValue($event.target.value)"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    >
    <slot />
    <div
      v-if="isTrailing"
      class="absolute inset-y-0 right-0 flex items-center pointer-events-none"
    >
      <Icon
        :name="iconName"
        class="text-tw-gray-400"
        :class="iconClass"
      />
    </div>
  </div>
</template>

<script>
// import Focus from '../../directives/focus'

import Icon from '../elements/Icon'

export default {
  components: {
    Icon
  },
  // directives: {
  //   focus: Focus
  // },
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
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
    readonly: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    autocomplete: {
      type: String,
      default: null
    },
    spellcheck: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    loadingIcon: {
      type: String,
      default: null
    },
    trailing: {
      type: Boolean,
      default: false
    },
    leading: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'md',
      validator (value) {
        return ['', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl'].includes(value)
      }
    },
    baseClass: {
      type: String,
      default: 'block w-full bg-tw-white disabled:cursor-not-allowed disabled:bg-tw-gray-50'
    },
    customClass: {
      type: String,
      default: null
    },
    appearance: {
      type: String,
      default: 'default',
      validator (value) {
        return ['default', 'none', 'empty'].includes(value)
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'focus', 'blur'],
  computed: {
    sizeClass () {
      return ({
        xxs: 'text-xs',
        xs: 'text-xs',
        sm: 'text-sm leading-4',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-base'
      })[this.size]
    },
    paddingClass () {
      return ({
        xxs: 'px-1 py-0.5',
        xs: 'px-2.5 py-1.5',
        sm: 'px-3 py-2',
        md: 'px-4 py-2',
        lg: 'px-4 py-2',
        xl: 'px-6 py-3'
      })[this.size]
    },
    appearanceClass () {
      return ({
        default: 'focus:ring-primary-500 focus:border-primary-500 border-tw-gray-300 rounded-md',
        none: 'border-0 bg-transparent focus:ring-0 focus:shadow-none',
        empty: ''
      })[this.appearance]
    },
    paddingIconClass () {
      return [
        this.isLeading && ({
          xxs: 'pl-7',
          xs: 'pl-7',
          sm: 'pl-10',
          md: 'pl-10',
          lg: 'pl-10',
          xl: 'pl-10'
        })[this.size],
        this.isTrailing && ({
          xxs: 'pr-10',
          xs: 'pr-10',
          sm: 'pr-10',
          md: 'pr-10',
          lg: 'pr-10',
          xl: 'pr-10'
        })[this.size]
      ].join(' ')
    },
    inputClass () {
      return [
        this.baseClass,
        this.sizeClass,
        this.paddingClass,
        this.paddingIconClass,
        this.appearanceClass,
        this.customClass
      ].join(' ')
    },
    wrapperClass () {
      return [
        'relative',
        this.appearance !== 'none' ? 'shadow-sm' : ''
      ].filter(Boolean).join(' ')
    },
    isLeading () {
      return (this.icon && this.leading) || (this.icon && !this.trailing) || (this.loading && !this.trailing)
    },
    isTrailing () {
      return (this.icon && this.trailing) || (this.loading && this.trailing)
    },
    iconName () {
      if (this.loading) {
        return this.loadingIcon || 'custom/loading'
      }

      return this.icon
    },
    iconClass () {
      return [
        ({
          xxs: 'h-3 w-3',
          xs: 'h-4 w-4',
          sm: 'h-5 w-5',
          md: 'h-5 w-5',
          lg: 'h-5 w-5',
          xl: 'h-5 w-5'
        })[this.size || 'sm'],
        this.isLeading && ({
          xxs: 'ml-2',
          xs: 'ml-2',
          sm: 'ml-3',
          md: 'ml-3',
          lg: 'ml-3',
          xl: 'ml-3'
        })[this.size || 'sm'],
        this.isTrailing && ({
          xxs: 'mr-2',
          xs: 'mr-2',
          sm: 'mr-3',
          md: 'mr-3',
          lg: 'mr-3',
          xl: 'mr-3'
        })[this.size || 'sm'],
        ({
          true: 'animate-spin'
        })[this.loading]
      ]
    }
  },
  methods: {
    updateValue (value) {
      this.$emit('update:modelValue', value)
    }
  }
}
</script>
