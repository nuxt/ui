<template>
  <div :class="ui.wrapper">
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
      @input="onInput"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    />
  </div>
</template>

<script lang="ts">
import { ref, computed, watch, onMounted, nextTick, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import { classNames } from '../../utils'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
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
    autocomplete: {
      type: String,
      default: null
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
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.textarea>>,
      default: () => appConfig.ui.textarea
    }
  },
  emits: ['update:modelValue', 'focus', 'blur'],
  setup (props, { emit }) {
    const textarea = ref<HTMLTextAreaElement | null>(null)

    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.textarea>>(() => defu({}, props.ui, appConfig.ui.textarea))

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

      emit('update:modelValue', (event.target as any).value)
    }

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
      const variant = ui.value.color?.[props.color as string]?.[props.variant as string] || ui.value.variant[props.variant]

      return classNames(
        ui.value.base,
        ui.value.rounded,
        ui.value.placeholder,
        ui.value.size[props.size],
        props.padded ? ui.value.padding[props.size] : 'p-0',
        variant?.replaceAll('{color}', props.color),
        !props.resize && 'resize-none',
        ui.value.custom
      )
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      textarea,
      textareaClass,
      onInput
    }
  }
})
</script>
