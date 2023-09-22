<template>
  <div :class="wrapperClass">
    <slot v-if="$props.indicator || $slots.indicator" name="indicator" v-bind="{ percent }">
      <div :class="indicatorContainerClass" :style="{ width: `${percent}%` }">
        <div :class="indicatorClass">
          {{ Math.round(percent) }}%
        </div>
      </div>
    </slot>

    <slot>
      <meter
        :value="$props.value"
        :min="normalizedMin"
        :max="normalizedMax"
        :class="[meterClass, meterAppearanceClass, meterBarClass]"
      />
    </slot>

    <template v-if="label || $slots.label">
      <slot name="label" v-bind="{ percent }">
        <div :class="labelClass">
          {{ label }}
        </div>
      </slot>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { PropType } from 'vue'
import { mergeConfig } from '../../utils'
import type { Strategy } from '../../types'
import { twJoin, twMerge } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'
// @ts-expect-error
import { meter } from '#ui/ui.config'
// @ts-expect-error
import colors from '#ui-colors'

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
      required: false
    },
    size: {
      type: String as PropType<keyof typeof config.size>,
      default: () => config.default.size,
      validator (value: string) {
        return Object.keys(config.meter.bar.size).includes(value)
      }
    },
    color: {
      type: String as PropType<typeof colors[number]>,
      default: () => config.default.color,
      validator (value: string) {
        return appConfig.ui.colors.includes(value)
      }
    },
    ui: {
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  setup (props) {
    const { ui, attrsClass } = useUI('meter', props.ui, config)

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
      ), attrsClass)
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
        ui.value.meter.color.replaceAll('{color}', props.color),
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
        ui.value.label.color.replaceAll('{color}', props.color),
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
