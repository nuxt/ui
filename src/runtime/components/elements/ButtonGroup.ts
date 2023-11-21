import { h, computed, toRef, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import { mergeConfig, getSlotsChildren } from '../../utils'
import { useProvideButtonGroup } from '../../composables/useButtonGroup'
import type { ButtonSize, Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { button, buttonGroup } from '#ui/ui.config'

const buttonConfig = mergeConfig<typeof button>(appConfig.ui.strategy, appConfig.ui.button, button)
const buttonGroupConfig = mergeConfig<typeof buttonGroup>(appConfig.ui.strategy, appConfig.ui.buttonGroup, buttonGroup)

export default defineComponent({
  name: 'ButtonGroup',
  inheritAttrs: false,
  props: {
    size: {
      type: String as PropType<ButtonSize>,
      default: null,
      validator (value: string) {
        return Object.keys(buttonConfig.size).includes(value)
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

    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper[props.orientation],
        ui.value.rounded,
        ui.value.shadow
      ), props.class)
    })

    const rounded = computed(() => {
      const roundedMap = {
        'rounded-none': { horizontal: { start: 'rounded-s-none', end: 'rounded-e-none' }, vertical: { start: 'rounded-t-none', end: 'rounded-b-none' } },
        'rounded-sm': { horizontal: { start: 'rounded-s-sm', end: 'rounded-e-sm' }, vertical: { start: 'rounded-t-sm', end: 'rounded-b-sm' } },
        rounded: { horizontal: { start: 'rounded-s', end: 'rounded-e' }, vertical: { start: 'rounded-t', end: 'rounded-b' } },
        'rounded-md': { horizontal: { start: 'rounded-s-md', end: 'rounded-e-md' }, vertical: { start: 'rounded-t-md', end: 'rounded-b-md' } },
        'rounded-lg': { horizontal: { start: 'rounded-s-lg', end: 'rounded-e-lg' }, vertical: { start: 'rounded-t-lg', end: 'rounded-b-lg' } },
        'rounded-xl': { horizontal: { start: 'rounded-s-xl', end: 'rounded-e-xl' }, vertical: { start: 'rounded-t-xl', end: 'rounded-b-xl' } },
        'rounded-2xl': { horizontal: { start: 'rounded-s-2xl', end: 'rounded-e-2xl' }, vertical: { start: 'rounded-t-2xl', end: 'rounded-b-2xl' } },
        'rounded-3xl': { horizontal: { start: 'rounded-s-3xl', end: 'rounded-e-3xl' }, vertical: { start: 'rounded-t-3xl', end: 'rounded-b-3xl' } },
        'rounded-full': { horizontal: { start: 'rounded-s-full', end: 'rounded-e-full' }, vertical: { start: 'rounded-t-full', end: 'rounded-b-full' } }
      }
      return roundedMap[ui.value.rounded][props.orientation]
    })

    useProvideButtonGroup({ orientation: toRef(props, 'orientation'), size: toRef(props, 'size'), ui, rounded })

    return () => h('div', { class: wrapperClass.value, ...attrs.value }, children.value)
  }
})
