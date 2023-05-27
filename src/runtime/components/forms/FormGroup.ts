import { h, computed, defineComponent } from 'vue'
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
    name: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    help: {
      type: String,
      default: null
    },
    error: {
      type: [String, Boolean],
      default: null
    },
    hint: {
      type: String,
      default: null
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.formGroup>>,
      default: () => appConfig.ui.formGroup
    }
  },
  setup (props, { slots }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.formGroup>>(() => defu({}, props.ui, appConfig.ui.formGroup))

    const children = computed(() => getSlotsChildren(slots))

    const clones = computed(() => children.value.map((node) => {
      if (props.error) {
        node.props.oldColor = node.props.color
        node.props.color = 'red'
      } else {
        node.props.color = node.props.oldColor
      }

      if (props.name) {
        node.props.name = props.name
      }

      return node
    }))

    return () => h('div', { class: [ui.value.wrapper] }, [
      props.label && h('div', { class: [ui.value.label.wrapper] }, [
        h('label', { for: props.name, class: [ui.value.label.base, props.required && ui.value.label.required] }, props.label),
        props.hint && h('span', { class: [ui.value.hint] }, props.hint)
      ]),
      props.description && h('p', { class: [ui.value.description] }, props.description),
      h('div', { class: [!!props.label && ui.value.container] }, [
        ...clones.value,
        props.error && typeof props.error === 'string' ? h('p', { class: [ui.value.error] }, props.error) : props.help ? h('p', { class: [ui.value.help] }, props.help) : null
      ])
    ])
  }
})
