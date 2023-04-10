import { h, computed } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import { classNames } from '../../utils'
import Avatar from './Avatar.vue'
import $ui from '#build/ui'
import { defineNuxtComponent } from '#imports'

export default defineNuxtComponent({
  props: {
    size: {
      type: String,
      default: null,
      validator (value: string) {
        return Object.keys($ui.avatar.size).includes(value)
      }
    },
    max: {
      type: Number,
      default: null
    },
    ui: {
      type: Object as PropType<Partial<typeof $ui.avatarGroup>>,
      default: () => $ui.avatarGroup
    }
  },
  setup (props, { slots }) {
    const ui = computed<Partial<typeof $ui.avatarGroup>>(() => defu({}, props.ui, $ui.avatarGroup))

    const children = computed(() => {
      let children = slots.default?.()
      // @ts-ignore-next
      if (children.length && children[0].type.name === 'ContentSlot') {
        children = children[0].ctx.slots.default?.()
      }
      return children
    })

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
