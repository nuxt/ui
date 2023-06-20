<template>
  <div :class="wrapperClass">
    <input
      :id="name"
      ref="input"
      v-model.number="value"
      :name="name"
      :min="min"
      :max="max"
      :disabled="disabled"
      :step="step"
      type="range"
      :class="[inputClass, thumbClass]"
      v-bind="$attrs"
    >

    <span :class="progressClass" :style="progressStyle" />
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
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      default: null
    },
    disabled: {
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
      validator (value: string) {
        return Object.keys(appConfig.ui.range.size).includes(value)
      }
    },
    color: {
      type: String,
      default: () => appConfig.ui.range.default.color,
      validator (value: string) {
        return appConfig.ui.colors.includes(value)
      }
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.range>>,
      default: () => appConfig.ui.range
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.range>>(() => defu({}, props.ui, appConfig.ui.range))

    const value = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
      }
    })

    const wrapperClass = computed(() => {
      return classNames(
        ui.value.wrapper,
        ui.value.size[props.size]
      )
    })

    const inputClass = computed(() => {
      return classNames(
        ui.value.base,
        ui.value.background,
        ui.value.rounded,
        ui.value.ring.replaceAll('{color}', props.color),
        ui.value.size[props.size]
      )
    })

    const thumbClass = computed(() => {
      return classNames(
        ui.value.thumb.base,
        // Intermediate class to allow thumb ring or background color (set to `current`) as it's impossible to safelist with arbitrary values
        ui.value.thumb.color.replaceAll('{color}', props.color),
        ui.value.thumb.ring,
        ui.value.thumb.background,
        ui.value.thumb.size[props.size]
      )
    })

    const progressClass = computed(() => {
      return classNames(
        ui.value.progress.base,
        ui.value.progress.rounded,
        ui.value.progress.background.replaceAll('{color}', props.color),
        ui.value.size[props.size]
      )
    })

    const progressStyle = computed(() => {
      return {
        width: `${(props.modelValue / props.max) * 100}%`
      }
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      value,
      wrapperClass,
      inputClass,
      thumbClass,
      progressClass,
      progressStyle
    }
  }
})
</script>
