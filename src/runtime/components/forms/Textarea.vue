<template>
  <div :class="wrapperClass">
    <textarea
      ref="textarea"
      :value="modelValue"
      :name="name"
      :rows="rows"
      :required="required"
      :disabled="disabled"
      :placeholder="placeholder"
      class="form-textarea"
      :class="textareaClass"
      v-bind="attrs"
      @input="onInput"
      @blur="onBlur"
    />
  </div>
</template>

<script lang="ts">
import { ref, computed, watch, onMounted, nextTick, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { omit } from '../../utils/lodash'
import { twMerge, twJoin } from 'tailwind-merge'
import { defuTwMerge } from '../../utils'
import { useFormGroup } from '../../composables/useFormGroup'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    name: {
      type: String,
      default: null
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
    resize: {
      type: Boolean,
      default: false
    },
    padded: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: () => appConfig.ui.textarea.default.size,
      validator (value: string) {
        return Object.keys(appConfig.ui.textarea.size).includes(value)
      }
    },
    color: {
      type: String,
      default: () => appConfig.ui.textarea.default.color,
      validator (value: string) {
        return [...appConfig.ui.colors, ...Object.keys(appConfig.ui.textarea.color)].includes(value)
      }
    },
    variant: {
      type: String,
      default: () => appConfig.ui.textarea.default.variant,
      validator (value: string) {
        return [
          ...Object.keys(appConfig.ui.textarea.variant),
          ...Object.values(appConfig.ui.textarea.color).flatMap(value => Object.keys(value))
        ].includes(value)
      }
    },
    textareaClass: {
      type: String,
      default: null
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.textarea>>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'blur'],
  setup (props, { emit, attrs }) {
    const textarea = ref<HTMLTextAreaElement | null>(null)

    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.textarea>>(() => defuTwMerge({}, props.ui, appConfig.ui.textarea))

    const { emitFormBlur, emitFormInput, formGroup } = useFormGroup()
    const color = computed(() => formGroup?.error?.value ? 'red' : props.color)
    const size = computed(() => formGroup?.size?.value ?? props.size)

    const autoFocus = () => {
      if (props.autofocus) {
        textarea.value?.focus()
      }
    }

    const autoResize = () => {
      if (props.autoresize) {
        if (!textarea.value) {
          return
        }

        textarea.value.rows = props.rows

        const styles = window.getComputedStyle(textarea.value)
        const paddingTop = parseInt(styles.paddingTop)
        const paddingBottom = parseInt(styles.paddingBottom)
        const padding = paddingTop + paddingBottom
        const lineHeight = parseInt(styles.lineHeight)
        const { scrollHeight } = textarea.value
        const newRows = (scrollHeight - padding) / lineHeight

        if (newRows > props.rows) {
          textarea.value.rows = newRows
        }
      }
    }

    const onInput = (event: InputEvent) => {
      autoResize()

      emit('update:modelValue', (event.target as HTMLInputElement).value)
      emitFormInput()
    }

    const onBlur = (event: FocusEvent) => {
      emit('blur', event)
      emitFormBlur()
    }

    onMounted(() => {
      setTimeout(() => {
        autoFocus()
      }, 100)
    })

    watch(() => props.modelValue, () => {
      nextTick(autoResize)
    })

    onMounted(() => {
      setTimeout(() => {
        autoFocus()
        autoResize()
      }, 100)
    })

    const wrapperClass = computed(() => twMerge(ui.value.wrapper, attrs.class as string))

    const textareaClass = computed(() => {
      const variant = ui.value.color?.[color.value as string]?.[props.variant as string] || ui.value.variant[props.variant]

      return twMerge(twJoin(
        ui.value.base,
        ui.value.rounded,
        ui.value.placeholder,
        ui.value.size[size.value],
        props.padded ? ui.value.padding[size.value] : 'p-0',
        variant?.replaceAll('{color}', color.value),
        !props.resize && 'resize-none'
      ), props.textareaClass)
    })

    return {
      attrs: computed(() => omit(attrs, ['class'])),
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      textarea,
      wrapperClass,
      // eslint-disable-next-line vue/no-dupe-keys
      textareaClass,
      onInput,
      onBlur
    }
  }
})
</script>
