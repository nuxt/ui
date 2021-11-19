<template>
  <div :class="wrapperClass">
    <textarea
      :id="name"
      ref="textarea"
      :name="name"
      :value="modelValue"
      :rows="rows"
      :required="required"
      :disabled="disabled"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :class="textareaClass"
      @input="updateValue($event.target.value)"
    />
  </div>
</template>

<script>
// import Focus from '../../directives/focus'

export default {
  // directives: {
  //   focus: Focus
  // },
  props: {
    modelValue: {
      type: [String, Number],
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
    rows: {
      type: Number,
      default: 3
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    autocomplete: {
      type: String,
      default: null
    },
    appearance: {
      type: String,
      default: 'default',
      validator (value) {
        return ['default', 'none'].includes(value)
      }
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
    noResize: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
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
        none: 'border-0 bg-transparent focus:ring-0 focus:shadow-none'
      })[this.appearance]
    },
    resizeClass () {
      return ({
        true: 'resize-none',
        false: ''
      })[this.noResize]
    },
    textareaClass () {
      return [
        this.baseClass,
        this.customClass,
        this.sizeClass,
        this.paddingClass,
        this.resizeClass,
        this.appearanceClass
      ].join(' ')
    },
    wrapperClass () {
      return [
        'relative',
        this.appearance !== 'none' ? 'shadow-sm' : ''
      ].filter(Boolean).join(' ')
    }
  },
  watch: {
    value () {
      this.resizeTextarea()
    }
  },
  mounted () {
    this.resizeTextarea()
  },
  methods: {
    resizeTextarea () {
      this.$nextTick(() => {
        const textarea = this.$refs.textarea
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
      })
    },
    updateValue (value) {
      this.$emit('update:modelValue', value)
    }
  }
}
</script>
