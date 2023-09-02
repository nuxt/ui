import { h, cloneVNode, computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { omit } from 'lodash-es'
import { twMerge, twJoin } from 'tailwind-merge'
import { defuTwMerge, getSlotsChildren } from '../../utils'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  inheritAttrs: false,
  props: {
    size: {
      type: String,
      default: null,
      validator (value: string) {
        return Object.keys(appConfig.ui.button.size).includes(value)
      }
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal',
      validator: (value: string) => ['horizontal', 'vertical'].includes(value)
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.buttonGroup>>,
      default: () => ({})
    }
  },
  setup (props, { attrs, slots }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.buttonGroup>>(() => defuTwMerge({}, props.ui, appConfig.ui.buttonGroup))

    const children = computed(() => getSlotsChildren(slots))

    const rounded = computed(() => {
      const roundedStyles = ['none', 'sm', '', 'md', 'lg', 'xl', '2xl', '3xl', 'full'].reduce((acc, cur) => {
        acc[`rounded-${cur}`] = {
          left: `rounded-s-${cur}`,
          right: `rounded-e-${cur}`,
          top: `rounded-t-${cur}`,
          bottom: `rounded-b-${cur}`
        }
        return acc
      }, {})
      return props.orientation === 'vertical'
        ? { top: roundedStyles[ui.value.rounded].top, bottom: roundedStyles[ui.value.rounded].bottom }
        : { left: roundedStyles[ui.value.rounded].left, right: roundedStyles[ui.value.rounded].right }
    })

    const clones = computed(() => children.value.map((node, index) => {
      const vProps: any = {}

      if (props.orientation === 'vertical') {
        ui.value.wrapper = 'flex flex-col -space-y-px'
      } else {
        ui.value.wrapper = 'inline-flex -space-x-px'
      }

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

    return () => h('div', { class: twMerge(twJoin(ui.value.wrapper, ui.value.rounded, ui.value.shadow), attrs.class as string), ...omit(attrs, ['class']) }, clones.value)
  }
})
