<template>
  <div :class="ui.wrapper">
    <textarea
      :id="inputId"
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
import { ref, computed, toRef, watch, onMounted, nextTick, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import { useFormGroup } from '../../composables/useFormGroup'
import { mergeConfig } from '../../utils'
import type { NestedKeyOf, Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { textarea } from '#ui/ui.config'
import colors from '#ui-colors'

const config = mergeConfig<typeof textarea>(appConfig.ui.strategy, appConfig.ui.textarea, textarea)

export default defineComponent({
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    id: {
      type: String,
      default: null
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
      type: String as PropType<keyof typeof config.size>,
      default: null,
      validator (value: string) {
        return Object.keys(config.size).includes(value)
      }
    },
    color: {
      type: String as PropType<keyof typeof config.color | typeof colors[number]>,
      default: () => config.default.color,
      validator (value: string) {
        return [...appConfig.ui.colors, ...Object.keys(config.color)].includes(value)
      }
    },
    variant: {
      type: String as PropType<keyof typeof config.variant | NestedKeyOf<typeof config.color>>,
      default: () => config.default.variant,
      validator (value: string) {
        return [
          ...Object.keys(config.variant),
          ...Object.values(config.color).flatMap(value => Object.keys(value))
        ].includes(value)
      }
    },
    textareaClass: {
      type: String,
      default: null
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
  emits: ['update:modelValue', 'blur'],
  setup (props, { emit }) {
    const { ui, attrs } = useUI('textarea', toRef(props, 'ui'), config, toRef(props, 'class'))

    const { emitFormBlur, emitFormInput, inputId, color, size, name } = useFormGroup(props, config)

    const textarea = ref<HTMLTextAreaElement | null>(null)

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
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      // eslint-disable-next-line vue/no-dupe-keys
      name,
      inputId,
      textarea,
      // eslint-disable-next-line vue/no-dupe-keys
      textareaClass,
      onInput,
      onBlur
    }
  }
})
</script>
