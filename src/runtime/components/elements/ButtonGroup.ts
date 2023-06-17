import { h, cloneVNode, computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import { getSlotsChildren } from '../../utils'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  props: {
    size: {
      type: String,
      default: null,
      validator (value: string) {
        return Object.keys(appConfig.ui.button.size).includes(value)
      }
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.buttonGroup>>,
      default: () => appConfig.ui.buttonGroup
    }
  },
  setup (props, { slots }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.buttonGroup>>(() => defu({}, props.ui, appConfig.ui.buttonGroup))

    const children = computed(() => getSlotsChildren(slots))

    const rounded = computed(() => ({
      'rounded-none': { left: 'rounded-l-none', right: 'rounded-r-none' },
      'rounded-sm': { left: 'rounded-l-sm', right: 'rounded-r-sm' },
      rounded: { left: 'rounded-l', right: 'rounded-r' },
      'rounded-md': { left: 'rounded-l-md', right: 'rounded-r-md' },
      'rounded-lg': { left: 'rounded-l-lg', right: 'rounded-r-lg' },
      'rounded-xl': { left: 'rounded-l-xl', right: 'rounded-r-xl' },
      'rounded-2xl': { left: 'rounded-l-2xl', right: 'rounded-r-2xl' },
      'rounded-3xl': { left: 'rounded-l-3xl', right: 'rounded-r-3xl' },
      'rounded-full': { left: 'rounded-l-full', right: 'rounded-r-full' }
    }[ui.value.rounded]))

    const clones = computed(() => children.value.map((node, index) => {
      const vProps: any = {}

      if (props.size) {
        vProps.size = props.size
      }

      vProps.class = node.props.class || ''
      vProps.class += ' !shadow-none'
      vProps.ui = node.props.ui || {}
      vProps.ui.rounded = ''

      if (index === 0) {
        vProps.ui.rounded = rounded.value.left
      }

      if (index === children.value.length - 1) {
        vProps.ui.rounded = rounded.value.right
      }

      return cloneVNode(node, vProps)
    }))

    return () => h('div', { class: [ui.value.wrapper, ui.value.rounded, ui.value.shadow] }, clones.value)
  }
})
