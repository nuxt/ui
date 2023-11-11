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
    rounded: {
      type: String as PropType<'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'>,
      default: 'md',
      validator (value: string) {
        return ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'].includes(value)
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

    const clones = computed(() => children.value.map((node, index) => {
      const vProps: any = {}

      if (props.size) {
        vProps.size = props.size
      }

      vProps.ui = node.props?.ui || {}
      vProps.ui.base = '!shadow-none'

      return cloneVNode(node, vProps)
    }))

    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper[props.orientation],
        ui.value.rounded[props.orientation][props.rounded],
        ui.value.shadow
      ), props.class)
    })

    return () => h('div', { class: wrapperClass.value, ...attrs.value }, clones.value)
  }
})
