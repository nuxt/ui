import { h, cloneVNode, computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import { mergeConfig, getSlotsChildren } from '../../utils'
import type { Strategy } from '../../types'
import { omit } from '../../utils/lodash'
// @ts-expect-error
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'
// @ts-expect-error
import { meter, meterGroup } from '#ui/ui.config'
import MeterElement from './Meter.vue'

const meterConfig = mergeConfig<typeof meter>(appConfig.ui.strategy, appConfig.ui.meter, meter)
const meterGroupConfig = mergeConfig<typeof meterGroup>(appConfig.ui.strategy, appConfig.ui.meterGroup, meterGroup)

export default defineComponent({
  components: { MeterElement },
  inheritAttrs: false,
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    size: {
      type: String,
      default: meterGroupConfig.default.size,
      validator (value: string) {
        return Object.keys(meterGroupConfig.size).includes(value)
      }
    },
    indicator: {
      type: Boolean,
      default: false
    },
    ui: {
      type: Object as PropType<Partial<typeof meterGroupConfig & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  setup (props, { slots }) {
    const { ui, attrs, attrsClass } = useUI('meterGroup', props.ui, meterGroupConfig)

    // If there is no children, throw an expressive error.
    if (!slots.default) {
      throw new Error('Meter Group has no Meter children.')
    }

    const children = computed(() => getSlotsChildren(slots))

    const rounded = computed(() => {
      const roundedMap = {
        'rounded-none': { left: 'rounded-s-none', right: 'rounded-e-none' },
        'rounded-sm': { left: 'rounded-s-sm', right: 'rounded-e-sm' },
        rounded: { left: 'rounded-s', right: 'rounded-e' },
        'rounded-md': { left: 'rounded-s-md', right: 'rounded-e-md' },
        'rounded-lg': { left: 'rounded-s-lg', right: 'rounded-e-lg' },
        'rounded-xl': { left: 'rounded-s-xl', right: 'rounded-e-xl' },
        'rounded-2xl': { left: 'rounded-s-2xl', right: 'rounded-e-2xl' },
        'rounded-3xl': { left: 'rounded-s-3xl', right: 'rounded-e-3xl' },
        'rounded-full': { left: 'rounded-s-full', right: 'rounded-e-full' }
      }

      return roundedMap[ui.value.rounded]
    })

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

    const clones = computed(() => children.value.map((node, index) => {
      const vProps: any = {}

      vProps.style = { width: `${clampPercent(node.props.value, props.min, props.max)}%` }

      // Normalize the props to be the same on all groups
      vProps.size = props.size
      vProps.min = props.min
      vProps.max = props.max

      // Adjust the style of all meters so they appear in a row.
      vProps.ui = node.props?.ui || {}
      vProps.ui.base = node.props?.ui?.base || ''
      vProps.ui.base += [
        node.props?.ui?.base,
        props.ui?.meter?.background || ui.value.background,
        'transition-all'
      ].filter(Boolean).join(' ')

      // Override the background to make the bar appear "full"
      vProps.ui.meter = node.props?.ui?.meter || {}
      vProps.ui.meter.background = `bg-${node.props.color}-500 dark:bg-${node.props.color}-500`
      vProps.ui.meter.rounded = 'rounded-none'
      vProps.ui.meter.bar = node.props?.ui?.meter?.bar || {}

      if (index === 0) {
        vProps.ui.meter.rounded = `${rounded.value.left} rounded-e-none`
      }

      if (index === children.value.length - 1) {
        vProps.ui.meter.rounded = `${rounded.value.right} rounded-s-none`
      }

      // Normalize all the bars without labels or indicators
      delete(vProps.slots?.indicator)
      delete(vProps.slots?.label)
      delete(vProps.indicator)
      delete(vProps.label)

      return cloneVNode(node, vProps)
    }))

    const value = computed(() => clones.value.reduce((prev, node) => prev + node.props.value, 0))

    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper,
        ui.value.background,
        ui.value.rounded,
        ui.value.shadow,
        ui.value.size[props.size]
      ), attrsClass)
    })

    return () => h(
      MeterElement,
      { min: props.min, max: props.max, value: value.value, size: props.size, indicator: props.indicator, ui: props.ui },
      () => h('div', { class: wrapperClass.value }, clones.value)
    )
  }
})
