<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { ProgressRootProps, ProgressRootEmits } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/progress'

const appConfig = _appConfig as AppConfig & { ui: { progress: Partial<typeof theme> } }

const progress = tv({ extend: tv(theme), ...(appConfig.ui?.progress || {}) })

type ProgressVariants = VariantProps<typeof progress>

export interface ProgressProps extends Omit<ProgressRootProps, 'asChild' | 'max'> {
  max?: number | Array<any>
  status?: boolean
  inverted?: boolean
  size?: ProgressVariants['size']
  color?: ProgressVariants['color']
  orientation?: ProgressVariants['orientation']
  animation?: ProgressVariants['animation']
  class?: any
  ui?: Partial<typeof progress.slots>
}

export interface ProgressEmits extends ProgressRootEmits {}

export type ProgressSlots = {
  status(props: { percent?: number }): any
} & {
  [key: string]: (props: { step: number }) => any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ProgressIndicator, ProgressRoot, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'

const props = withDefaults(defineProps<ProgressProps>(), {
  inverted: false,
  modelValue: null,
  orientation: 'horizontal'
})
const emits = defineEmits<ProgressEmits>()
defineSlots<ProgressSlots>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'getValueLabel', 'modelValue'), emits)

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

  return {
    transform: `translate${props.orientation === 'vertical' ? 'Y' : 'X'}(${props.inverted ? '' : '-'}${100 - percent.value}%)`
  }
})

const statusStyle = computed(() => {
  return {
    [props.orientation === 'vertical' ? 'height' : 'width']: percent.value ? `${percent.value}%` : 'fit-content'
  }
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

const ui = computed(() => tv({ extend: progress, slots: props.ui })({
  animation: props.animation,
  size: props.size,
  color: props.color,
  orientation: props.orientation,
  inverted: props.inverted
}))
</script>

<template>
  <div :class="ui.root({ class: props.class })">
    <div v-if="!isIndeterminate && (status || $slots.status)" :class="ui.status()" :style="statusStyle">
      <slot name="status" :percent="percent">
        {{ percent }}%
      </slot>
    </div>

    <ProgressRoot v-bind="rootProps" :max="realMax" :class="ui.base()" style="transform: translateZ(0)">
      <ProgressIndicator :class="ui.indicator()" :style="indicatorStyle" />
    </ProgressRoot>

    <div v-if="hasSteps" :class="ui.steps()">
      <div v-for="(step, index) in max" :key="index" :class="ui.step({ step: stepVariant(index) })">
        <slot :name="`step-${index}`" :step="step">
          {{ step }}
        </slot>
      </div>
    </div>
  </div>
</template>
