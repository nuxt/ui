
<template>
  <div :class="wrapperClass">
    <div v-if="withLabel || $slots.default" :class="labelClass">
      <span v-if="!$slots.default">
        {{ relativeValue }}%
      </span>
      <slot v-else />
    </div>
    <div :class="progressBarClass">
      <span
        :class="progressClass"
        :style="progressStyle"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

import type { PropType } from 'vue'
import { omit } from '../../utils/lodash'
import { twJoin, twMerge } from 'tailwind-merge'
import { defuTwMerge } from '../../utils'

import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

const ANIMATION_CLASS = {
  SIDEWAYS: 'sideways',
  PROGRESS_LOADING: 'progress-loading'
}
export default defineComponent({
  props: {
    modelValue: {
      type: Number,
      default: null
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    withLabel: {
      type: Boolean,
      default: false
    },
    labelPosition: {
      type: String,
      default: () => appConfig.ui.progressBar.default.labelPosition,
      validator (value: string) {
        return Object.keys(appConfig.ui.progressBar.label.position).includes(value)
      }
    },
    color: {
      type: String,
      default: () => appConfig.ui.progressBar.default.color,
      validator (value: string) {
        return [...appConfig.ui.colors, ...Object.keys(appConfig.ui.progressBar.color)].includes(value)
      }
    },
    size: {
      type: String,
      default: () => appConfig.ui.progressBar.default.size,
      validator (value: string) {
        return Object.keys(appConfig.ui.progressBar.size).includes(value)
      }
    },
    progressBarClass: {
      type: String,
      default: null
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.range>>,
      default: () => ({})
    }
  },
  setup (props, { attrs }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.progressBar>>(() => defuTwMerge({}, props.ui, appConfig.ui.progressBar))

    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper,
        ui.value.size[props.size]
      ), attrs.class as string)
    })

    const progressBarClass = computed(() => {
      return twMerge(twJoin(
        ui.value.base,
        ui.value.rounded,
        ui.value.color
      ), props.progressBarClass)
    })

    const animationClass = computed(() => {
      return props.modelValue !== null ? ANIMATION_CLASS.SIDEWAYS : ANIMATION_CLASS.PROGRESS_LOADING
    })

    const progressClass = computed(() => {
      return twJoin(
        ui.value.progress.base,
        ui.value.progress.rounded,
        ui.value.progress.background.replaceAll('{color}', props.color),
        animationClass.value
      )
    })
    const labelClass = computed(() => {
      return twJoin(
        ui.value.label.base,
        ui.value.label.position[props.labelPosition],
        ui.value.label.size[props.size]
      )
    })

    const relativeValue = computed(() => {
      const { modelValue, min, max } = props
      const clampedValue = Math.max(min, Math.min(modelValue, max))
      return ((clampedValue - min) / (max - min)) * 100
    })



    const progressStyle = computed(() => {
      if (animationClass.value === ANIMATION_CLASS.PROGRESS_LOADING) {
        return { width: '20%' }
      }
      return {
        width: `${relativeValue.value }%`
      }
    })


    return {
      attrs: computed(() => omit(attrs, ['class'])),
      wrapperClass,
      // eslint-disable-next-line vue/no-dupe-keys
      progressBarClass,
      progressClass,
      labelClass,
      progressStyle,
      relativeValue
    }
  }
})
</script>

<style scoped>
.sideways {
  animation: sideways 1s ease-out;
}
.progress-loading {
  animation: progress-loading 5s ease-in-out infinite;
}

@keyframes sideways {
  0% {
    width: 0%;
  }
}

@keyframes progress-loading {
  50% {
    transform: translateX(400%);
  }
}
</style>
