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
      :class="textareaClass"
      @input="onInput($event.target.value)"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { classNames } from '../../utils'
import $ui from '#build/ui'

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
        return Object.keys($ui.textarea.appearance).includes(value)
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
        return Object.keys($ui.textarea.size).includes(value)
      }
    },
    wrapperClass: {
      type: String,
      default: $ui.textarea.wrapper
    },
    baseClass: {
      type: String,
      default: $ui.textarea.base
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

    const textareaClass = computed(() => {
      return classNames(
        props.baseClass,
        $ui.textarea.size[props.size],
        $ui.textarea.spacing[props.size],
        $ui.textarea.appearance[props.appearance],
        !props.resize && 'resize-none',
        props.customClass
      )
    })

    return {
      textarea,
      onInput,
      textareaClass
    }
  }
}
</script>
