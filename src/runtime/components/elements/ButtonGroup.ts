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
      validator (value: string) {
        return ['horizontal', 'vertical'].includes(value)
      }
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
