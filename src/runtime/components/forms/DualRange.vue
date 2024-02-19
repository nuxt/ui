<template>
  <div :class="wrapperClass">
    <input
      :id="`${inputId}-start`"
      ref="inputStart"
      v-model.number="value[0]"
      :name="`${name}-start`"
      :min="min"
      :max="max"
      :disabled="disabled"
      :step="step"
      type="range"
      :class="[inputClass, thumbClass, trackClass]"
      v-bind="attrs"
      data-index="0"
      @change="onChange"
      @input="onInput"
    >

    <input
      :id="`${inputId}-end`"
      ref="inputEnd"
      v-model.number="value[1]"
      :name="`${name}-end`"
      :min="min"
      :max="max"
      :disabled="disabled"
      :step="step"
      type="range"
      :class="[inputClass, thumbClass, trackClass]"
      v-bind="attrs"
      data-index="1"
      @change="onChange"
      @input="onInput"
    >

    <span :class="progressClass" :style="progressStyle" />
  </div>
</template>

<script lang="ts">
import { computed, toRef, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import { useFormGroup } from '../../composables/useFormGroup'
import { mergeConfig } from '../../utils'
import type { DualRangeSize, Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { dualRange } from '#ui/ui.config'
import colors from '#ui-colors'

const config = mergeConfig<typeof dualRange>(appConfig.ui.strategy, appConfig.ui.dualRange, dualRange)

export default defineComponent({
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Array as PropType<[number, number]>,
      default: () => [20, 80]
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
      type: String as PropType<DualRangeSize>,
      default: null,
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
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<Partial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'change', 'input'],
  setup (props, { emit }) {
    const { ui, attrs } = useUI('dualRange', toRef(props, 'ui'), config)

    const { emitFormChange, emitFormInput, inputId, color, size, name } = useFormGroup(props, config)

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

    const onInput = (event: Event) => {
      emit('input', event)
      emitFormInput()

      const { modelValue, max } = props
      if (modelValue[1] <= modelValue[0]) {
        value.value = [modelValue[0], Math.min(modelValue[0] + 1, max)]
      }
    }

    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper,
        ui.value.size[size.value]
      ), props.class)
    })

    const inputClass = computed(() => {
      return twMerge(twJoin(
        ui.value.base,
        ui.value.background,
        ui.value.rounded,
        color.value && ui.value.ring.replaceAll('{color}', color.value),
        ui.value.size[size.value]
      ), props.inputClass)
    })

    const thumbClass = computed(() => {
      return twJoin(
        ui.value.thumb.base,
        // Intermediate class to allow thumb ring or background color (set to `current`) as it's impossible to safelist with arbitrary values
        color.value && ui.value.thumb.color.replaceAll('{color}', color.value),
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
        color.value && ui.value.progress.background.replaceAll('{color}', color.value),
        ui.value.progress.size[size.value]
      )
    })

    const progressStyle = computed(() => {
      const { modelValue, min, max } = props
      const progressStart = ((modelValue[0] - min) / max - min) * 100
      const progressEnd = ((modelValue[1] - min) / max - min) * 100
      const progressWidth = progressEnd - progressStart
      return {
        left: `${progressStart}%`,
        width: `${progressWidth}%`
      }
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      // eslint-disable-next-line vue/no-dupe-keys
      name,
      inputId,
      value,
      wrapperClass,
      // eslint-disable-next-line vue/no-dupe-keys
      inputClass,
      thumbClass,
      trackClass,
      progressClass,
      progressStyle,
      onChange,
      onInput
    }
  }
})
</script>
