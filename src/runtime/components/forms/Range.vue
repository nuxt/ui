<template>
  <div ref="track" :class="[trackClass, disabled ? ui.track.disabled : ui.track.cursor]" @click="onBarClick">
    <span :class="rangeClass" :style="rangeStyle" role="slider" />

    <span
      v-if="multiple"
      :class="[thumbClassLeft]"
      :style="leftThumbStyle"
      role="slider"
      tabindex="0"
      @mousedown="onDragStart"
      @touchstart="onDragStart"
      @touchmove="onDrag($event)"
      @keydown="onKeyDown($event, 0)"
    />

    <span
      :class="[thumbClassRight]"
      :style="rightThumbStyle"
      role="slider"
      tabindex="0"
      @mousedown="onDragStart"
      @touchstart="onDragStart"
      @touchmove="onDrag($event)"
      @keydown="onKeyDown($event, 1)"
    />
  </div>
</template>

<script lang="ts">
import { computed, onMounted, onUnmounted, toRef, defineComponent, type StyleValue } from 'vue'
import { type PropType, ref } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import { useFormGroup } from '../../composables/useFormGroup'
import { mergeConfig } from '../../utils'
import type { RangeSize, Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { range } from '#ui/ui.config'
import colors from '#ui-colors'

const config = mergeConfig<typeof range>(appConfig.ui.strategy, appConfig.ui.range, range)

export default defineComponent({
  props: {
    modelValue: {
      type: [Number, Array] as PropType<number | [number, number]>,
      default: 0
    },
    name: {
      type: String,
      default: null
    },
    color: {
      type: String as PropType<typeof colors[number]>,
      default: () => config.default.color,
      validator (value: string) {
        return appConfig.ui.colors.includes(value)
      }
    },
    size: {
      type: String as PropType<RangeSize>,
      default: null,
      validator (value: string) {
        return Object.keys(config.size).includes(value)
      }
    },
    multiple: {
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
    disabled: {
      type: Boolean,
      default: false
    },
    step: {
      type: Number,
      default: 1
    },
    ui: {
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const { ui } = useUI('range', toRef(props, 'ui'), config)
    const { color, size } = useFormGroup(props, config)

    const track = ref<HTMLElement | null>(null)
    const dragging = ref(false)

    const thumbClassRight = computed(() => {
      return twJoin(
        ui.value.thumb.base,
        ui.value.thumb.right.ring.replace('{color}', color.value),
        ui.value.thumb.right.background,
        ui.value.thumb.size[size.value],
        ui.value.thumb.transition
      )
    })

    const thumbClassLeft = computed(() => {
      return twJoin(
        ui.value.thumb.base,
        ui.value.thumb.left.ring.replace('{color}', color.value),
        ui.value.thumb.left.background,
        ui.value.thumb.size[size.value],
        ui.value.thumb.transition
      )
    })

    const trackClass = computed(() => {
      return twMerge(twJoin(
        ui.value.base,
        ui.value.track.background,
        ui.value.track.rounded,
        ui.value.track.size[size.value]
      ))
    })

    const rangeClass = computed(() => {
      return twMerge(twJoin(
        ui.value.range.background.replaceAll('{color}', color.value),
        ui.value.range.base,
        ui.value.range.rounded,
        ui.value.range.size[size.value],
        ui.value.range.transition
      ))
    })

    const scaleLinear = (x: number) => {
      return ((x - props.min) / (props.max - props.min)) * 100
    }

    const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a
    const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a))
    const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x))
    const range = (x1: number, y1: number, x2: number, y2: number, a: number) => lerp(x2, y2, invlerp(x1, y1, a))

    const modelValuePercent0 = computed(() => {
      if (!props.multiple) return 0

      return scaleLinear(Math.max(props.modelValue[0], props.min))
    })

    const modelValuePercent1 = computed(() =>
      scaleLinear(Math.min(props.modelValue[1] ?? props.modelValue, props.max))
    )

    const rangeStyle = computed(() => {
      return {
        left: `${modelValuePercent0.value}%`,
        width: `${modelValuePercent1.value - modelValuePercent0.value}%`
      } satisfies StyleValue
    })

    const leftThumbStyle = computed(() => {
      return {
        left: `${modelValuePercent0.value}%`
      } satisfies StyleValue
    })

    const rightThumbStyle = computed(() => {
      return {
        left: `${modelValuePercent1.value}%`
      } satisfies StyleValue
    })

    onMounted(() => window.addEventListener('mouseup', onDragEnd))
    onUnmounted(() => window.removeEventListener('mouseup', onDragEnd))

    const getOffset = (event: MouseEvent | TouchEvent) => {
      const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX
      const { left, width } = track.value.getBoundingClientRect()

      const x = clientX - left
      return range(0, width, props.min, props.max, x)
    }

    const onDrag = (event: MouseEvent | TouchEvent) => {
      if (!dragging.value || props.disabled) return

      updateValue(getOffset(event))
    }

    const updateValue = (offset: number) => {
      const rounded = Math.round(offset / props.step) * props.step

      if (
        Array.isArray(props.modelValue) &&
        props.modelValue
      ) {
        const [left, right] = props.modelValue

        const leftDiff = Math.abs(offset - left)
        const rightDiff = Math.abs(offset - right)

        if (leftDiff < rightDiff) {
          emit('update:modelValue', [rounded, right])
        } else {
          emit('update:modelValue', [left, rounded])
        }
      } else {
        emit('update:modelValue', rounded)
      }
    }

    const onDragStart = () => {
      dragging.value = true

      window.addEventListener('mousemove', onDrag)
    }

    const onDragEnd = () => {
      dragging.value = false

      window.removeEventListener('mousemove', onDrag)
    }

    const onBarClick = (event: MouseEvent | TouchEvent) => {
      if (props.disabled) return

      updateValue(getOffset(event))
    }

    const onKeyDown = (event: KeyboardEvent, index: number) => {
      const currentValue = Array.isArray(props.modelValue) ? props.modelValue[index] : props.modelValue

      switch (event.code) {
      case 'ArrowDown':
      case 'ArrowLeft':
        updateValue(currentValue - props.step)
        break
      case 'ArrowUp':
      case 'ArrowRight':
        updateValue(currentValue + props.step)
      }
    }

    return {
      onDrag,
      onDragStart,
      onDragEnd,
      thumbClassLeft,
      thumbClassRight,
      trackClass,
      track,
      leftThumbStyle,
      rightThumbStyle,
      rangeClass,
      rangeStyle,
      onKeyDown,
      onBarClick,
      // eslint-disable-next-line vue/no-dupe-keys
      ui
    }
  }
})
</script>
