<template>
  <div :class="ui.wrapper" role="progressbar">
    <slot v-if="indicator || $slots.indicator" name="indicator" v-bind="{ percent }">
      <div v-if="!isSteps" :class="indicatorContainerClass" :style="{ width: `${percent}%` }">
        <div :class="indicatorClass">
          {{ Math.round(percent) }}%
        </div>
      </div>
    </slot>

    <progress
      :aria-valuemax="realMax"
      :aria-valuenow="value"
      :class="progressClass"
      v-bind="{ value, max: realMax, ...attrs }"
    >
      {{ percent !== undefined ? `${Math.round(percent)}%` : undefined }}
    </progress>

    <div v-if="isSteps" :class="stepsClass">
      <div v-for="(step, index) in max" :key="index" :class="stepClasses(index)">
        <slot :name="`step-${index}`" v-bind="{ step }">
          {{ step }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRef } from 'vue'
import type { PropType } from 'vue'
import { twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { Strategy, ProgressSize, ProgressAnimation, ProgressColor, DeepPartial } from '../../types/index'
// @ts-expect-error
import appConfig from '#build/app.config'
import { progress } from '#ui/ui.config'

const config = mergeConfig<typeof progress>(appConfig.ui.strategy, appConfig.ui.progress, progress)

export default defineComponent({
  inheritAttrs: false,
  props: {
    value: {
      type: Number,
      default: null
    },
    max: {
      type: [Number, Array<any>],
      default: 100
    },
    indicator: {
      type: Boolean,
      default: false
    },
    animation: {
      type: String as PropType<ProgressAnimation>,
      default: () => config.default.animation,
      validator(value: string) {
        return Object.keys(config.animation).includes(value)
      }
    },
    size: {
      type: String as PropType<ProgressSize>,
      default: () => config.default.size,
      validator(value: string) {
        return Object.keys(config.progress.size).includes(value)
      }
    },
    color: {
      type: String as PropType<ProgressColor>,
      default: () => config.default.color,
      validator(value: string) {
        return appConfig.ui.colors.includes(value)
      }
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
    const { ui, attrs } = useUI('progress', toRef(props, 'ui'), config, toRef(props, 'class'))

    const indicatorContainerClass = computed(() => {
      return twJoin(
        ui.value.indicator.container.base,
        ui.value.indicator.container.width,
        ui.value.indicator.container.transition
      )
    })

    const indicatorClass = computed(() => {
      return twJoin(
        ui.value.indicator.align,
        ui.value.indicator.width,
        ui.value.indicator.color,
        ui.value.indicator.size[props.size]
      )
    })

    const progressClass = computed(() => {
      const classes = [
        ui.value.progress.base,
        ui.value.progress.width,
        ui.value.progress.size[props.size],
        ui.value.progress.rounded,
        ui.value.progress.track,
        ui.value.progress.bar,
        // Intermediate class to allow thumb ring or background color (set to `current`) as it's impossible to safelist with arbitrary values
        ui.value.progress.color?.replaceAll('{color}', props.color),
        ui.value.progress.background,
        ui.value.progress.indeterminate.base,
        ui.value.progress.indeterminate.rounded
      ]

      if (isIndeterminate.value) {
        classes.push(ui.value.animation[props.animation])
      }

      return twJoin(...classes)
    })

    const stepsClass = computed(() => {
      return twJoin(
        ui.value.steps.base,
        ui.value.steps.color?.replaceAll('{color}', props.color),
        ui.value.steps.size[props.size]
      )
    })

    const stepClass = computed(() => {
      return twJoin(
        ui.value.step.base,
        ui.value.step.align
      )
    })

    const stepActiveClass = computed(() => {
      return twJoin(
        ui.value.step.active
      )
    })

    const stepFirstClass = computed(() => {
      return twJoin(
        ui.value.step.first
      )
    })

    function isActive(index: number) {
      return index === Number(props.value)
    }

    function isFirst(index: number) {
      return index === 0
    }

    function stepClasses(index: string | number) {
      index = Number(index)

      const classes = [stepClass.value]

      if (isFirst(index)) {
        classes.push(stepFirstClass.value)
      }

      if (isActive(index)) {
        classes.push(stepActiveClass.value)
      }

      return classes.join(' ')
    }

    const isIndeterminate = computed(() => props.value === undefined || props.value === null)
    const isSteps = computed(() => Array.isArray(props.max))

    const realMax = computed(() => {
      if (isIndeterminate.value) {
        return null
      }

      if (Array.isArray(props.max)) {
        return props.max.length - 1
      }

      return Number(props.max)
    })

    const percent = computed(() => {
      if (isIndeterminate.value) {
        return undefined
      }

      switch (true) {
        case props.value < 0: return 0
        case props.value > (realMax.value as number): return 100
        default: return (props.value / (realMax.value as number)) * 100
      }
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      indicatorContainerClass,
      indicatorClass,
      progressClass,
      stepsClass,
      stepClasses,
      isIndeterminate,
      isSteps,
      realMax,
      percent
    }
  }
})
</script>

<style scoped>
/** These styles are required to animate the bar */
progress:indeterminate {
  @apply relative;

  &:after {
    @apply content-[''];
    @apply absolute inset-0;
    @apply bg-current;
  }

  &::-webkit-progress-value {
    @apply bg-current;
  }

  &::-moz-progress-bar {
    @apply bg-current;
  }

  &.bar-animation-carousel {
    &:after {
      animation: carousel 2s ease-in-out infinite;
    }

    &::-webkit-progress-value {
      animation: carousel 2s ease-in-out infinite;
    }

    &::-moz-progress-bar {
      animation: carousel 2s ease-in-out infinite;
    }
  }

  [dir=rtl] &.bar-animation-carousel {
    &:after {
      animation: carousel-rtl 2s ease-in-out infinite;
    }

    &::-webkit-progress-value {
      animation: carousel-rtl 2s ease-in-out infinite;
    }

    &::-moz-progress-bar {
      animation: carousel-rtl 2s ease-in-out infinite;
    }
  }

  &.bar-animation-carousel-inverse {
    &:after {
      animation: carousel-inverse 2s ease-in-out infinite;
    }

    &::-webkit-progress-value {
      animation: carousel-inverse 2s ease-in-out infinite;
    }

    &::-moz-progress-bar {
      animation: carousel-inverse 2s ease-in-out infinite;
    }
  }

  [dir=rtl] &.bar-animation-carousel-inverse {
    &:after {
      animation: carousel-inverse-rtl 2s ease-in-out infinite;
    }

    &::-webkit-progress-value {
      animation: carousel-inverse-rtl 2s ease-in-out infinite;
    }

    &::-moz-progress-bar {
      animation: carousel-inverse-rtl 2s ease-in-out infinite;
    }
  }

  &.bar-animation-swing {
    &:after {
      animation: swing 3s ease-in-out infinite;
    }

    &::-webkit-progress-value {
      animation: swing 3s ease-in-out infinite;
    }

    &::-moz-progress-bar {
      animation: swing 3s ease-in-out infinite;
    }
  }

  &.bar-animation-elastic {
    &::after {
      animation: elastic 3s ease-in-out infinite;
    }

    &::-webkit-progress-value {
      animation: elastic 3s ease-in-out infinite;
    }

    &::-moz-progress-bar {
      animation: elastic 3s ease-in-out infinite;
    }
  }
}

@keyframes carousel {

  0%,
  100% {
    width: 50%
  }

  0% {
    transform: translateX(-100%)
  }

  100% {
    transform: translateX(200%)
  }
}

@keyframes carousel-rtl {

  0%,
  100% {
    width: 50%
  }

  0% {
    transform: translateX(100%)
  }

  100% {
    transform: translateX(-200%)
  }
}

@keyframes carousel-inverse {

  0%,
  100% {
    width: 50%
  }

  0% {
    transform: translateX(200%)
  }

  100% {
    transform: translateX(-100%)
  }
}

@keyframes carousel-inverse-rtl {

  0%,
  100% {
    width: 50%
  }

  0% {
    transform: translateX(-200%)
  }

  100% {
    transform: translateX(100%)
  }
}

@keyframes swing {

  0%,
  100% {
    width: 50%
  }

  0%,
  100% {
    transform: translateX(-25%)
  }

  50% {
    transform: translateX(125%)
  }
}

@keyframes elastic {

  /* Firefox doesn't do "margin: 0 auto", we have to play with margin-left */
  0%,
  100% {
    width: 50%;
    margin-left: 25%;
  }

  50% {
    width: 90%;
    margin-left: 5%
  }
}
</style>
