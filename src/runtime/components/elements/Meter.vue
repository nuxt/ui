<template>
  <div :class="wrapperClass">
    <template v-if="$props.indicator || $slots.indicator">
      <slot name="indicator" v-bind="{ percent }">
        <div :class="indicatorContainerClass" :style="{ width: `${percent}%` }">
          <div :class="indicatorClass">
            {{ Math.round(percent) }}%
          </div>
        </div>
      </slot>
    </template>

    <meter
      :value="$props.value"
      :min="normalizedMin"
      :max="normalizedMax"
      :class="[meterClass, meterAppearanceClass, meterBarClass]"
    />

    <template v-if="$props.label || $slots.label">
      <slot name="label" v-bind="{ percent }">
        <div :class="labelClass">
          {{ label }}
        </div>
      </slot>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, toRef } from 'vue'
import type { PropType } from 'vue'
import { mergeConfig } from '../../utils'
import type { Strategy, MeterSize, MeterColors } from '../../types'
import { twJoin, twMerge } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'
import { meter } from '#ui/ui.config'

const config = mergeConfig<typeof meter>(appConfig.ui.strategy, appConfig.ui.meter, meter)

export default defineComponent({
  props: {
    value: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    indicator: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      required: false,
      default: undefined
    },
    size: {
      type: String as PropType<MeterSize>,
      default: () => config.default.size,
      validator (value: string) {
        return Object.keys(config.meter.bar.size).includes(value)
      }
    },
    color: {
      type: String as PropType<MeterColors>,
      default: () => config.default.color,
      validator (value: string) {
        return [...appConfig.ui.colors, ...Object.keys(config.color)].includes(value)
      }
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
  setup (props) {
    const { ui } = useUI('meter', toRef(props, 'ui'), config)

    function clampPercent (value: number, min: number, max: number): number {
      if (min == max) {
        return value < min ? 0 : 100
      }

      if (min > max) {
        max = [min, min = max][0]
      }

      const percent = (value - min) / (max - min) * 100

      return Math.max(0, Math.min(100, percent))
    }

    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper
      ), props.class)
    })

    const indicatorContainerClass = computed(() => {
      return twMerge(twJoin(
        ui.value.indicator.container
      ))
    })

    const indicatorClass = computed(() => {
      return twMerge(twJoin(
        ui.value.indicator.text,
        ui.value.indicator.size[props.size]
      ))
    })

    const meterClass = computed(() => {
      return twJoin(
        ui.value.meter.base,
        ui.value.meter.background,
        ui.value.meter.ring,
        ui.value.meter.rounded,
        ui.value.meter.shadow,
        ui.value.color[props.color] ?? ui.value.meter.color.replaceAll('{color}', props.color),
        ui.value.meter.size[props.size]
      )
    })

    const meterAppearanceClass = computed(() => {
      return twJoin(
        ui.value.meter.appearance.inner,
        ui.value.meter.appearance.meter,
        ui.value.meter.appearance.bar,
        ui.value.meter.appearance.value
      )
    })

    const meterBarClass = computed(() => {
      return twJoin(
        ui.value.meter.bar.transition,
        ui.value.meter.bar.ring,
        ui.value.meter.bar.rounded,
        ui.value.meter.bar.size[props.size]
      )
    })

    const labelClass = computed(() => {
      return twMerge(twJoin(
        ui.value.label.base,
        ui.value.color[props.color] ?? ui.value.label.color.replaceAll('{color}', props.color),
        ui.value.label.size[props.size]
      ))
    })

    const normalizedMin = computed(() => props.min > props.max ? props.max : props.min)
    const normalizedMax = computed(() => props.max < props.min ? props.min : props.max)

    const percent = computed(() => clampPercent(Number(props.value), normalizedMin.value, normalizedMax.value))

    return {
      wrapperClass,
      indicatorContainerClass,
      indicatorClass,
      meterClass,
      meterAppearanceClass,
      meterBarClass,
      labelClass,
      normalizedMin,
      normalizedMax,
      percent
    }
  }
})
</script>
