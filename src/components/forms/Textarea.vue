<template>
  <div :class="wrapperClass">
    <textarea
      :id="name"
      ref="textarea"
      :value="modelValue"
      :name="name"
      :rows="rows"
      :required="required"
      :disabled="disabled"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :class="[baseClass, customClass, sizeClass, paddingClass, appearanceClass, resizeClass]"
      @input="onInput($event.target.value)"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
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
    autoresize: {
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
    appearance: {
      type: String,
      default: 'default',
      validator (value) {
        return ['default', 'none'].includes(value)
      }
    },
    resize: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'md',
      validator (value) {
        return ['', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl'].includes(value)
      }
    },
    wrapperClass: {
      type: String,
      default: 'relative'
    },
    baseClass: {
      type: String,
      default: 'block w-full bg-tw-white text-tw-gray-700 disabled:cursor-not-allowed disabled:bg-tw-gray-50 focus:outline-none'
    },
    customClass: {
      type: String,
      default: null
    }
  },
  emits: ['update:modelValue', 'focus', 'blur'],
  setup (props, { emit }) {
    const textarea = ref(null)

    const autoFocus = () => {
      if (props.autofocus) {
        textarea.value.focus()
      }
    }

    const autoResize = () => {
      if (props.autoresize) {
        const styles = window.getComputedStyle(textarea.value)
        const paddingTop = parseInt(styles.paddingTop)
        const paddingBottom = parseInt(styles.paddingBottom)
        const padding = paddingTop + paddingBottom
        const initialHeight = (parseInt(styles.height) - padding) / textarea.value.rows
        const scrollHeight = textarea.value.scrollHeight - padding
        const newRows = Math.ceil(scrollHeight / initialHeight)

        textarea.value.rows = newRows
      }
    }

    const onInput = (value) => {
      autoResize()

      emit('update:modelValue', value)
    }

    onMounted(() => {
      setTimeout(() => {
        autoFocus()
        autoResize()
      }, 100)
    })

    const sizeClass = computed(() => ({
      xxs: 'text-xs',
      xs: 'text-xs',
      sm: 'text-sm leading-4',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-base'
    })[props.size])

    const paddingClass = computed(() => ({
      xxs: 'px-1 py-0.5',
      xs: 'px-2.5 py-1.5',
      sm: 'px-3 py-2',
      md: 'px-4 py-2',
      lg: 'px-4 py-2',
      xl: 'px-6 py-3'
    })[props.size])

    const appearanceClass = computed(() => ({
      default: 'focus:ring-1 focus:ring-primary-500 focus:border-primary-500 border border-tw-gray-300 rounded-md shadow-sm',
      none: 'border-0 bg-transparent focus:ring-0 focus:shadow-none'
    })[props.appearance])

    const resizeClass = computed(() => {
      return props.resize ? '' : 'resize-none'
    })

    return {
      textarea,
      onInput,
      sizeClass,
      paddingClass,
      appearanceClass,
      resizeClass
    }
  }
}
</script>
