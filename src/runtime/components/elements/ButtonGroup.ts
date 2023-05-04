import { h, computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
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
        return Object.keys(appConfig.ui.avatar.size).includes(value)
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

    const children = computed(() => {
      let children = slots.default?.()
      // @ts-ignore-next
      if (children.length && children[0].type.name === 'ContentSlot') {
        // @ts-ignore-next
        children = children[0].ctx.slots.default?.()
      }
      return children
    })

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
      if (props.size) {
        node.props.size = props.size
      }

      node.props.class = node.props.class || ''
      node.props.class += ' !shadow-none'
      node.props.ui = node.props.ui || {}
      node.props.ui.rounded = ''

      if (index === 0) {
        node.props.ui.rounded = rounded.value.left
      }

      if (index > 0) {
        node.props.class += ' -ml-px'
      }

      if (index === children.value.length - 1) {
        node.props.ui.rounded = rounded.value.right
      }

      return node
    }))

    return () => h('div', { class: [ui.value.wrapper, ui.value.rounded, ui.value.shadow] }, clones.value)
  }
})
