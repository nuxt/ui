<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { ProgressRootProps, ProgressRootEmits } from 'reka-ui'
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/progress'
import type { ComponentConfig } from '../types/tv'

type Progress = ComponentConfig<typeof theme, AppConfig, 'progress'>

export interface ProgressProps extends Pick<ProgressRootProps, 'getValueLabel' | 'getValueText' | 'modelValue'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /** The maximum progress value. */
  max?: number | Array<any>
  /** Display the current progress value. */
  status?: boolean
  /** Whether the progress is visually inverted. */
  inverted?: boolean
  /**
   * @defaultValue 'md'
   */
  size?: Progress['variants']['size']
  /**
   * @defaultValue 'primary'
   */
  color?: Progress['variants']['color']
  /**
   * The orientation of the progress bar.
   * @defaultValue 'horizontal'
   */
  orientation?: Progress['variants']['orientation']
  /**
   * The animation of the progress bar.
   * @defaultValue 'carousel'
   */
  animation?: Progress['variants']['animation']
  /**
   * The progress bar variant
   * @defaultValue 'linear'
   */
  variant?: Progress['variants']['variant']
  /**
   * The thickness of the circular progress stroke in pixels, `auto` derives it from the `size` prop.
   * Only applies to the `circular` variant.
   * @defaultValue 'auto'
   */
  thickness?: 'auto' | number
  class?: any
  ui?: Progress['slots']
}

export interface ProgressEmits extends ProgressRootEmits {}

export type ProgressSlots = {
  status?(props: { percent?: number }): VNode[]
} & {
  [key: string]: (props: { step: number }) => VNode[]
}

</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive, ProgressRoot, ProgressIndicator } from 'reka-ui'
import { useForwardProps } from '../composables/useForwardProps'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useLocale } from '../composables/useLocale'
import { tv } from '../utils/tv'

const _props = withDefaults(defineProps<ProgressProps>(), {
  inverted: false,
  modelValue: null,
  orientation: 'horizontal',
  variant: 'linear',
  thickness: 'auto'
})
const emits = defineEmits<ProgressEmits>()
const slots = defineSlots<ProgressSlots>()

const props = useComponentProps('progress', _props)

const { dir } = useLocale()
const appConfig = useAppConfig() as Progress['AppConfig']

const rootProps = useForwardProps(reactivePick(props, 'getValueLabel', 'getValueText', 'modelValue'), emits)

const isIndeterminate = computed(() => rootProps.value.modelValue === null)
const hasSteps = computed(() => Array.isArray(props.max))

const realMax = computed(() => {
  if (isIndeterminate.value || !props.max) {
    return undefined
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
    case rootProps.value.modelValue! < 0: return 0
    case rootProps.value.modelValue! > (realMax.value ?? 100): return 100
    default: return Math.round((rootProps.value.modelValue! / (realMax.value ?? 100)) * 100)
  }
})

const indicatorStyle = computed(() => {
  if (percent.value === undefined) {
    return
  }

  if (props.variant === 'linear') {
    if (props.orientation === 'vertical') {
      return {
        transform: `translateY(${props.inverted ? '' : '-'}${100 - percent.value}%)`
      }
    } else {
      if (dir.value === 'rtl') {
        return {
          transform: `translateX(${props.inverted ? '-' : ''}${100 - percent.value}%)`
        }
      } else {
        return {
          transform: `translateX(${props.inverted ? '' : '-'}${100 - percent.value}%)`
        }
      }
    }
  } else {
    const strokeDasharray = `${percent.value ?? 25}, 100`

    return {
      'stroke-dasharray': strokeDasharray
    }
  }
})

const thicknessStyle = computed(() => {
  if (props.variant === 'linear') return

  if (props.thickness === 'auto') return

  return {
    '--ui-progress-thickness': `${props.thickness}px`
  }
})

const statusStyle = computed(() => {
  if (props.variant === 'circular') return undefined

  const value = `${Math.max(percent.value ?? 0, 0)}%`
  return props.orientation === 'vertical' ? { height: value } : { width: value }
})

function isActive(index: number) {
  return index === Number(props.modelValue)
}

function isFirst(index: number) {
  return index === 0
}

function isLast(index: number) {
  return index === realMax.value
}

function stepVariant(index: number | string) {
  index = Number(index)

  if (isActive(index) && !isFirst(index)) {
    return 'active'
  }

  if (isFirst(index) && isActive(index)) {
    return 'first'
  }

  if (isLast(index) && isActive(index)) {
    return 'last'
  }

  return 'other'
}

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.progress || {}) })({
  animation: props.animation,
  size: props.size,
  color: props.color,
  orientation: props.orientation,
  inverted: props.inverted,
  variant: props.variant,
  thickness: props.thickness === 'auto' ? 'auto' : undefined
}))
</script>

<template>
  <Primitive :as="props.as" :data-orientation="props.orientation" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="!isIndeterminate && (props.status || !!slots.status) && props.variant === 'linear'" data-slot="status" :class="ui.status({ class: props.ui?.status })" :style="statusStyle">
      <slot name="status" :percent="percent">
        {{ percent }}%
      </slot>
    </div>

    <ProgressRoot v-bind="rootProps" :max="realMax" data-slot="base" :class="ui.base({ class: props.ui?.base })" :style="['transform: translateZ(0)', thicknessStyle]">
      <template v-if="props.variant === 'circular'">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" data-slot="track" :class="ui.track({ class: props.ui?.track })" />
          <ProgressIndicator as-child>
            <circle cx="50" cy="50" pathLength="100" :class="ui.indicator({ class: props.ui?.indicator })" :style="indicatorStyle" />
          </ProgressIndicator>
        </svg>
        <div v-if="!isIndeterminate && (props.status || !!slots.status)" data-slot="status" :class="ui.status({ class: props.ui?.status })" :style="statusStyle">
          <slot name="status" :percent="percent">
            {{ percent }}%
          </slot>
        </div>
      </template>

      <ProgressIndicator v-else-if="props.variant === 'linear'" data-slot="indicator" :class="ui.indicator({ class: props.ui?.indicator })" :style="indicatorStyle" />
    </ProgressRoot>

    <div v-if="hasSteps" data-slot="steps" :class="ui.steps({ class: props.ui?.steps })">
      <div v-for="(step, index) in props.max" :key="index" data-slot="step" :class="ui.step({ class: props.ui?.step, step: stepVariant(index) })">
        <slot :name="`step-${index}`" :step="step">
          {{ step }}
        </slot>
      </div>
    </div>
  </Primitive>
</template>
