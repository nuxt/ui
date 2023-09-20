<template>
  <div :class="wrapperClass">
    <input
      :id="id"
      ref="input"
      v-model.number="value"
      :name="name"
      :min="min"
      :max="max"
      :disabled="disabled"
      :step="step"
      type="range"
      :class="[inputClass, thumbClass, trackClass]"
      v-bind="attrs"
      @change="onChange"
    >

    <span :class="progressClass" :style="progressStyle" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import { useFormGroup } from '../../composables/useFormGroup'
import { mergeConfig } from '../../utils'
import type { Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { range } from '#ui/ui.config'
import colors from '#ui-colors'

const config = mergeConfig<typeof range>(appConfig.ui.strategy, appConfig.ui.range, range)

export default defineComponent({
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    id: {
      type: String,
      default: null
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
      type: String as PropType<keyof typeof config.size>,
      default: () => config.default.size,
      validator (value: string) {
        return Object.keys(config.size).includes(value)
      }
    },
    color: {
      type: String as PropType<typeof colors[number]>,
      default: () => config.default.color,
      validator (value: string) {
        return appConfig.ui.colors.includes(value)
      }
    },
    inputClass: {
      type: String,
      default: null
    },
    ui: {
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  emits: ['update:modelValue', 'change'],
  setup (props, { emit }) {
    const { ui, attrs, attrsClass } = useUI('range', props.ui, config)

    const { emitFormChange, formGroup } = useFormGroup(props)
    const color = computed(() => formGroup?.error?.value ? 'red' : props.color)
    const size = computed(() => formGroup?.size?.value ?? props.size)
    const id = formGroup?.labelFor

    const value = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
      }
    })

    const onChange = (event: Event) => {
      emit('change', event)
      emitFormChange()
    }

    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper,
        ui.value.size[size.value]
      ), attrsClass)
    })

    const inputClass = computed(() => {
      return twMerge(twJoin(
        ui.value.base,
        ui.value.background,
        ui.value.rounded,
        ui.value.ring.replaceAll('{color}', color.value),
        ui.value.size[size.value]
      ), props.inputClass)
    })

    const thumbClass = computed(() => {
      return twJoin(
        ui.value.thumb.base,
        // Intermediate class to allow thumb ring or background color (set to `current`) as it's impossible to safelist with arbitrary values
        ui.value.thumb.color.replaceAll('{color}', color.value),
        ui.value.thumb.ring,
        ui.value.thumb.background,
        ui.value.thumb.size[size.value]
      )
    })

    const trackClass = computed(() => {
      return twJoin(
        ui.value.track.base,
        ui.value.track.background,
        ui.value.track.rounded,
        ui.value.track.size[size.value]
      )
    })

    const progressClass = computed(() => {
      return twJoin(
        ui.value.progress.base,
        ui.value.progress.rounded,
        ui.value.progress.background.replaceAll('{color}', color.value),
        ui.value.progress.size[size.value]
      )
    })

    const progressStyle = computed(() => {
      const { modelValue, min, max } = props
      const clampedValue = Math.max(min, Math.min(modelValue, max))
      const relativeValue = (clampedValue - min) / (max - min)
      return {
        width: `${relativeValue * 100}%`
      }
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      // eslint-disable-next-line vue/no-dupe-keys
      id,
      value,
      wrapperClass,
      // eslint-disable-next-line vue/no-dupe-keys
      inputClass,
      thumbClass,
      trackClass,
      progressClass,
      progressStyle,
      onChange
    }
  }
})
</script>
