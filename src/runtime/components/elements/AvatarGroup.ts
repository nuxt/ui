import { h, computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import { classNames, getSlotsChildren } from '../../utils'
import Avatar from './Avatar.vue'
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
    max: {
      type: Number,
      default: null
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.avatarGroup>>,
      default: () => appConfig.ui.avatarGroup
    }
  },
  setup (props, { slots }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.avatarGroup>>(() => defu({}, props.ui, appConfig.ui.avatarGroup))

    const children = computed(() => getSlotsChildren(slots))

    const max = computed(() => typeof props.max === 'string' ? parseInt(props.max, 10) : props.max)

    const clones = computed(() => children.value.map((node, index) => {
      if (!props.max || (max.value && index < max.value)) {
        if (props.size) {
          node.props.size = props.size
        }

        node.props.class = node.props.class || ''
        node.props.class += ` ${classNames(
          ui.value.ring,
          ui.value.margin
        )}`

        return node
      }

      if (max.value !== undefined && index === max.value) {
        return h(Avatar, {
          size: props.size,
          text: `+${children.value.length - max.value}`,
          class: classNames(
            ui.value.ring,
            ui.value.margin
          )
        })
      }

      return null
    }).filter(Boolean).reverse())

    return () => h('div', { class: ui.value.wrapper }, clones.value)
  }
})
