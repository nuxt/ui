import { h, cloneVNode, computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import { getSlotsChildren } from '../../utils'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

const appConfig = useAppConfig()

export default defineComponent({
  props: {
    name: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: () => appConfig.ui.input.default.size,
      validator (value: string) {
        return Object.keys(appConfig.ui.formGroup.size).includes(value)
      }
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
      const vProps: any = {}

      if (props.error) {
        vProps.oldColor = node.props.color
        vProps.color = 'red'
      } else if (vProps.oldColor) {
        vProps.color = vProps.oldColor
      }

      if (props.name) {
        vProps.name = props.name
      }

      if (props.size) {
        vProps.size = props.size
      }

      return cloneVNode(node, vProps)
    }))

    return () => h('div', { class: [ui.value.wrapper] }, [
      props.label && h('div', { class: [ui.value.label.wrapper, ui.value.size[props.size]] }, [
        h('label', { for: props.name, class: [ui.value.label.base, props.required && ui.value.label.required] }, props.label),
        props.hint && h('span', { class: [ui.value.hint] }, props.hint)
      ]),
      props.description && h('p', { class: [ui.value.description, ui.value.size[props.size]
      ] }, props.description),
      h('div', { class: [!!props.label && ui.value.container] }, [
        ...clones.value,
        props.error && typeof props.error === 'string' ? h('p', { class: [ui.value.error, ui.value.size[props.size]] }, props.error) : props.help ? h('p', { class: [ui.value.help, ui.value.size[props.size]] }, props.help) : null
      ])
    ])
  }
})
