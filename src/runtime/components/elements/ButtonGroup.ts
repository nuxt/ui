import { h, cloneVNode, computed, toRef, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import { mergeConfig, getSlotsChildren } from '../../utils'
import type { ButtonSize, Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { button, buttonGroup } from '#ui/ui.config'

const buttonConfig = mergeConfig<typeof button>(appConfig.ui.strategy, appConfig.ui.button, button)
const buttonGroupConfig = mergeConfig<typeof buttonGroup>(appConfig.ui.strategy, appConfig.ui.buttonGroup, buttonGroup)

export default defineComponent({
  inheritAttrs: false,
  props: {
    size: {
      type: String as PropType<ButtonSize>,
      default: null,
      validator (value: string) {
        return Object.keys(buttonConfig.size).includes(value)
      }
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal',
      validator (value: string) {
        return ['horizontal', 'vertical'].includes(value)
      }
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: undefined
    },
    ui: {
      type: Object as PropType<Partial<typeof buttonGroupConfig & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  setup (props, { slots }) {
    const { ui, attrs } = useUI('buttonGroup', toRef(props, 'ui'), buttonGroupConfig)

    const children = computed(() => getSlotsChildren(slots))

    const rounded = computed(() => {
      const roundedMap = {
        'rounded-none': { horizontal: { left: 'rounded-s-none', right: 'rounded-e-none' }, vertical: { top: 'rounded-t-none', bottom: 'rounded-b-none' } },
        'rounded-sm': { horizontal: { left: 'rounded-s-sm', right: 'rounded-e-sm' }, vertical: { top: 'rounded-t-sm', bottom: 'rounded-b-sm' } },
        rounded: { horizontal: { left: 'rounded-s', right: 'rounded-e' }, vertical: { top: 'rounded-t', bottom: 'rounded-b' } },
        'rounded-md': { horizontal: { left: 'rounded-s-md', right: 'rounded-e-md' }, vertical: { top: 'rounded-t-md', bottom: 'rounded-b-md' } },
        'rounded-lg': { horizontal: { left: 'rounded-s-lg', right: 'rounded-e-lg' }, vertical: { top: 'rounded-t-lg', bottom: 'rounded-b-lg' } },
        'rounded-xl': { horizontal: { left: 'rounded-s-xl', right: 'rounded-e-xl' }, vertical: { top: 'rounded-t-xl', bottom: 'rounded-b-xl' } },
        'rounded-2xl': { horizontal: { left: 'rounded-s-2xl', right: 'rounded-e-2xl' }, vertical: { top: 'rounded-t-2xl', bottom: 'rounded-b-2xl' } },
        'rounded-3xl': { horizontal: { left: 'rounded-s-3xl', right: 'rounded-e-3xl' }, vertical: { top: 'rounded-t-3xl', bottom: 'rounded-b-3xl' } },
        'rounded-full': { horizontal: { left: 'rounded-s-full', right: 'rounded-e-full' }, vertical: { top: 'rounded-t-full', bottom: 'rounded-b-full' } }
      }
      return roundedMap[ui.value.rounded][props.orientation]
    })

    const clones = computed(() => children.value.map((node, index) => {
      const vProps: any = {}

      if (props.size) {
        vProps.size = props.size
      }

      vProps.ui = node.props?.ui || {}
      vProps.ui.rounded = 'rounded-none'
      vProps.ui.base = '!shadow-none'

      if (index === 0) {
        vProps.ui.rounded += ` ${rounded.value.left || rounded.value.top}`
      }

      if (index === children.value.length - 1) {
        vProps.ui.rounded += ` ${rounded.value.right || rounded.value.bottom}`
      }

      return cloneVNode(node, vProps)
    }))

    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper[props.orientation],
        ui.value.rounded,
        ui.value.shadow
      ), props.class)
    })

    return () => h('div', { class: wrapperClass.value, ...attrs.value }, clones.value)
  }
})
