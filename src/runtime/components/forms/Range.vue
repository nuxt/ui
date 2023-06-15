<template>
  <div :class="wrapperClass">
    <label
      class="absolute inset-0 z-10 rounded-l-full h-full pointer-events-none bg-current"
      :style="{ width: `${(modelValue / max) * 100}%` }"
    />
    <input
      :id="name"
      ref="input"
      :name="name"
      :min="min"
      :max="max"
      :value="modelValue"
      :disabled="disabled"
      :step="step"
      type="range"
      :class="inputClass"
      v-bind="$attrs"
      @input="onInput"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import { classNames } from '../../utils'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

export default defineComponent({
  props: {
    modelValue: {
      type: Number,
      required: true,
      default: 50
    },
    name: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    size: {
      type: String,
      default: () => appConfig.ui.range.default.size,
      validator(value: string) {
        return Object.keys(appConfig.ui.range.size).includes(value)
      }
    },
    color: {
      type: String,
      default: () => appConfig.ui.range.default.color,
      validator(value: string) {
        return appConfig.ui.colors.includes(value)
      }
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.range>>,
      default: () => appConfig.ui.range
    }
  },
  emits: ['update:modelValue', 'focus', 'blur'],
  setup(props, { emit, slots }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.range>>(() =>
      defu({}, props.ui, appConfig.ui.range)
    )

    const onInput = (event: InputEvent) => {
      emit('update:modelValue', (event.target as any).value)
    }

    const inputClass = computed(() => {
      return classNames(
        ui.value.base,
        ui.value.thumb.base.replaceAll('{color}', props.color),
        ui.value.thumb.size[props.size],
        ui.value.size[props.size]
      )
    })

    const wrapperClass = computed(() => {
      return classNames(
        ui.value.wrapper.replaceAll('{color}', props.color),
        ui.value.size[props.size],
        props.disabled ? ui.value.disabled : ''
      )
    })

    // eslint-disable-next-line vue/no-dupe-keys
    return { ui, onInput, inputClass, wrapperClass }
  }
})
</script>
