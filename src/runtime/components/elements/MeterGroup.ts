import { h, cloneVNode, computed, toRef, defineComponent } from 'vue'
import type { ComputedRef, VNode, SlotsType, PropType } from 'vue'
import { twJoin } from 'tailwind-merge'
import UIcon from '../elements/Icon.vue'
import { useUI } from '../../composables/useUI'
import { mergeConfig, getSlotsChildren } from '../../utils'
import type { DeepPartial, Strategy, MeterSize } from '../../types/index'
import type Meter from './Meter.vue'
// @ts-expect-error
import appConfig from '#build/app.config'
import { meter, meterGroup } from '#ui/ui.config'

const meterConfig = mergeConfig<typeof meter>(appConfig.ui.strategy, appConfig.ui.meter, meter)
const meterGroupConfig = mergeConfig<typeof meterGroup>(appConfig.ui.strategy, appConfig.ui.meterGroup, meterGroup)

export default defineComponent({
  components: {
    UIcon
  },
  inheritAttrs: false,
  slots: Object as SlotsType<{
    default?: typeof Meter[]
    indicator?: { percent: number }
  }>,
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
      type: String as PropType<MeterSize>,
      default: () => meterConfig.default.size,
      validator(value: string) {
        return Object.keys(meterConfig.meter.bar.size).includes(value)
      }
    },
    indicator: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: () => meterGroupConfig.default.icon
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<DeepPartial<typeof meterGroupConfig> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  setup(props, { slots }) {
    const { ui, attrs } = useUI('meterGroup', toRef(props, 'ui'), meterGroupConfig)
    const { ui: uiMeter } = useUI('meter', undefined, meterConfig)

    // If there is no children, throw an expressive error.
    if (!slots.default) {
      throw new Error('Meter Group has no Meter children.')
    }

    // Normalize the min and max numbers, if these are inversed.
    const normalizedMin = computed(() => props.min > props.max ? props.max : props.min)
    const normalizedMax = computed(() => props.max < props.min ? props.min : props.max)

    const children = computed(() => getSlotsChildren(slots))

    const rounded = computed(() => ui.value.orientation[ui.value.rounded])

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

    // We have to store the labels outside to preserve reactivity later.
    const labels = computed(() => {
      return children.value.map(node => node.props.label)
    })

    const percents = computed(() => {
      return children.value.map(node => clampPercent(node.props.value, props.min, props.max))
    })

    const percent = computed(() => {
      return Math.max(0, Math.max(percents.value.reduce((prev, percent) => prev + percent, 0)))
    })

    const clones: ComputedRef<VNode> = computed(() => children.value.map((node, index) => {
      const vProps: any = {}

      vProps.style = { width: `${percents.value[index]}%` }

      // Normalize the props to be the same on all groups
      vProps.size = props.size
      vProps.min = normalizedMin.value
      vProps.max = normalizedMax.value

      // Adjust the style of all meters, so they appear in a row.
      vProps.ui = node.props?.ui || {}
      vProps.ui.wrapper = node.props?.ui?.wrapper || ''
      vProps.ui.wrapper += [
        node.props?.ui?.wrapper,
        ui.value.background,
        ui.value.transition
      ].filter(Boolean).join(' ')

      // Override the background to make the bar appear "full"
      vProps.ui.meter = node.props?.ui?.meter || {}
      vProps.ui.meter.background = `bg-${node.props.color}-500 dark:bg-${node.props.color}-400`
      vProps.ui.meter.rounded = 'rounded-none'
      vProps.ui.meter.bar = node.props?.ui?.meter?.bar || {}

      if (index === 0) {
        vProps.ui.meter.rounded = `${rounded.value.left} rounded-e-none`
      }

      if (index === children.value.length - 1) {
        vProps.ui.meter.rounded = `${rounded.value.right} rounded-s-none`
      }

      // Move the labels out of the node so these can be checked later
      labels.value[index] = node.props.label

      const clone = cloneVNode(node, vProps)

      // @ts-expect-error
      delete (clone.children?.label)
      delete (clone.props?.indicator)
      delete (clone.props?.label)

      return clone
    }))

    const baseClass = computed(() => {
      return twJoin(
        ui.value.base,
        ui.value.background,
        ui.value.rounded,
        ui.value.shadow,
        uiMeter.value.meter.size[props.size]
      )
    })

    const indicatorContainerClass = computed(() => {
      return twJoin(
        uiMeter.value.indicator.container
      )
    })

    const indicatorClass = computed(() => {
      return twJoin(
        uiMeter.value.indicator.text,
        uiMeter.value.indicator.size[props.size]
      )
    })

    const vNodeChildren = computed(() => {
      const vNodeSlots = [
        undefined,
        h('div', { class: baseClass.value }, clones.value),
        undefined
      ]

      if (props.indicator) {
        vNodeSlots[0] = h('div', { class: indicatorContainerClass.value }, [
          h('div', { class: indicatorClass.value, style: { width: `${percent.value}%` } }, Math.round(percent.value) + '%')
        ])
      } else if (slots.indicator) {
        // @ts-expect-error
        vNodeSlots[0] = slots.indicator({ percent: percent.value })
      }

      vNodeSlots[2] = h('ol', { class: ui.value.list }, labels.value.map((label, key) => {
        const labelClass = computed(() => {
          return twJoin(
            uiMeter.value.label.base,
            uiMeter.value.label.text,
            uiMeter.value.color[clones.value[key]?.props.color] ?? uiMeter.value.label.color.replaceAll('{color}', clones.value[key]?.props.color ?? uiMeter.value.default.color),
            uiMeter.value.label.size[props.size]
          )
        })

        return h('li', { class: labelClass.value }, [
          h(UIcon, { name: clones.value[key]?.props.icon ?? props.icon }),
          `${label} (${Math.round(percents.value[key])}%)`
        ])
      }))

      return vNodeSlots
    })

    return () => h('div', { class: ui.value.wrapper, ...attrs.value }, vNodeChildren.value)
  }
})
