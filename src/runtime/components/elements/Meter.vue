<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <template v-if="indicator || $slots.indicator">
      <slot name="indicator" v-bind="{ percent, value }">
        <div :class="indicatorContainerClass" :style="{ width: `${percent}%` }">
          <div :class="indicatorClass">
            {{ Math.round(percent) }}%
          </div>
        </div>
      </slot>
    </template>

    <meter
      :value="value"
      :min="normalizedMin"
      :max="normalizedMax"
      :class="[meterClass, meterAppearanceClass, meterBarClass]"
    />

    <template v-if="label || $slots.label">
      <slot name="label" v-bind="{ percent, value }">
        <div :class="labelClass">
          <UIcon v-if="icon" :name="icon" /> {{ label }}
        </div>
      </slot>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRef } from 'vue'
import type { SlotsType, PropType } from 'vue'
import { twJoin } from 'tailwind-merge'
import UIcon from '../elements/Icon.vue'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { Strategy, MeterColor, MeterSize, DeepPartial } from '../../types/index'
// @ts-expect-error
import appConfig from '#build/app.config'
import { meter } from '#ui/ui.config'

const config = mergeConfig<typeof meter>(appConfig.ui.strategy, appConfig.ui.meter, meter)

export default defineComponent({
  components: {
    UIcon
  },
  inheritAttrs: false,
  slots: Object as SlotsType<{
    indicator?: { percent: number, value: number }
    label?: { percent: number, value: number }
  }>,
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
      default: null
    },
    size: {
      type: String as PropType<MeterSize>,
      default: () => config.default.size,
      validator(value: string) {
        return Object.keys(config.meter.size).includes(value)
      }
    },
    color: {
      type: String as PropType<MeterColor>,
      default: () => config.default.color,
      validator(value: string) {
        return [...appConfig.ui.colors, ...Object.keys(config.color)].includes(value)
      }
    },
    icon: {
      type: String,
      default: null
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<DeepPartial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  setup(props) {
    const { ui, attrs } = useUI('meter', toRef(props, 'ui'), config, toRef(props, 'class'))

    function clampPercent(value: number, min: number, max: number): number {
      if (min == max) {
        return value < min ? 0 : 100
      }

      if (min > max) {
        max = [min, min = max][0]
      }

      const percent = (value - min) / (max - min) * 100

      return Math.max(0, Math.min(100, percent))
    }

    const indicatorContainerClass = computed(() => {
      return twJoin(
        ui.value.indicator.container
      )
    })

    const indicatorClass = computed(() => {
      return twJoin(
        ui.value.indicator.text,
        ui.value.indicator.size[props.size]
      )
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
      return twJoin(
        ui.value.label.base,
        ui.value.label.text,
        ui.value.color[props.color] ?? ui.value.label.color.replaceAll('{color}', props.color),
        ui.value.label.size[props.size]
      )
    })

    const normalizedMin = computed(() => props.min > props.max ? props.max : props.min)
    const normalizedMax = computed(() => props.max < props.min ? props.min : props.max)

    const percent = computed(() => clampPercent(Number(props.value), normalizedMin.value, normalizedMax.value))

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
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
