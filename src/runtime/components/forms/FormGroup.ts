import { h, cloneVNode, computed, defineComponent, provide, inject } from 'vue'
import type { PropType } from 'vue'
import { defuTwMerge, getSlotsChildren } from '../../utils'
import type { FormError } from '../../types'
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
    size: {
      type: String,
      default: null,
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
      default: () => ({})
    }
  },
  setup (props, { slots }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.formGroup>>(() => defuTwMerge({}, props.ui, appConfig.ui.formGroup))

    provide('form-path', props.name)
    const formErrors = inject<Ref<FormError[]> | null>('form-errors', null)
    const errorMessage = computed(() => {
      return props.error && typeof props.error === 'string'
        ? props.error
        : formErrors?.value?.find((error) => error.path === props.name)?.message
    })

    const children = computed(() => getSlotsChildren(slots))

    const clones = computed(() => children.value.map((node) => {
      const vProps: any = {}

      if (errorMessage.value) {
        vProps.oldColor = node.props?.color
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

    const size = computed(() => ui.value.size[props.size ?? appConfig.ui.input.default.size])

    return () => h('div', { class: [ui.value.wrapper] }, [
      props.label && h('div', { class: [ui.value.label.wrapper, size.value] }, [
        h('label', { for: props.name, class: [ui.value.label.base, props.required && ui.value.label.required] }, props.label),
        props.hint && h('span', { class: [ui.value.hint] }, props.hint)
      ]),
      props.description && h('p', { class: [ui.value.description, size.value
      ] }, props.description),
      h('div', { class: [!!props.label && ui.value.container] }, [
        ...clones.value,
        errorMessage.value ? h('p', { class: [ui.value.error, size.value] }, errorMessage.value) : props.help ? h('p', { class: [ui.value.help, size.value] }, props.help) : null
      ])
    ])
  }
})
