import { h, computed, toRef, defineComponent } from 'vue'
import type { PropType, SlotsType } from 'vue'
import type { RequireAtLeastOne } from 'type-fest'
import { twMerge, twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import type { Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { mergeConfig, getSlotsChildren } from '#ui/utils'
import { list } from '#ui/ui.config'

const config = mergeConfig<typeof list>(appConfig.ui.strategy, appConfig.ui.list, list)

export default defineComponent({
  inheritAttrs: false,
  props: {
    ordered: {
      type: Boolean,
      default: false
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: () => config.orientation,
      validator (value: string) {
        return ['horizontal', 'vertical'].includes(value)
      }
    },
    gap: {
      type: Boolean,
      default: false
    },
    wrap: {
      type: Boolean,
      default: () => config.wrapItems
    },
    itemOrientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: undefined,
      validator (value: string|undefined) {
        return value === undefined ? true : ['horizontal', 'vertical'].includes(value)
      }
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: undefined
    },
    ui: {
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  slots: Object as SlotsType<
    RequireAtLeastOne<{
      default: undefined,
      'separator-before'?: { index: number, isFirst: boolean, isLast: boolean },
      'separator-after'?: { index: number, isFirst: boolean, isLast: boolean },
    }, 'separator-before' | 'separator-after'>
  >,
  setup (props, { slots }) {
    const { ui, attrs } = useUI('list', toRef(props, 'ui'), config)

    const listClass = computed(() => {
      return twMerge(twJoin(
        ui.value[props.orientation].base,
        props.wrap ? ui.value.wrap : ui.value.nowrap,
        props.gap ? ui.value[props.orientation].gap : ''
      ), props.class)
    })

    const itemClass = computed(() => {
      return twJoin(
        ui.value[props.itemOrientation ?? props.orientation].base,
        ui.value.nowrap
      )
    })

    function addSeparator (array) {
      return array.map((item, index) => {
        const children = []

        const isFirst = array.length === 1
          || ((slots['separator-before'] && index === 1) || (slots['separator-after'] && index === 0))

        const isLast = array.length === 1
          || ((slots['separator-before'] && index === (array.length - 1)) || (slots['separator-after'] && index === (array.length - 2)))

        if (slots['separator-before'] && (index > 0)) {
          children.push(slots['separator-before']({ index, isFirst, isLast }))
        }

        children.push(item)

        if (slots['separator-after'] && (index < (array.length - 1))) {
          children.push(slots['separator-after']({ index, isFirst, isLast }))
        }

        return h('li', { class: itemClass.value }, children)
      })
    }

    const children = computed(() => addSeparator(getSlotsChildren(slots)))

    const orderedElement = computed(() => props.ordered ? 'ol' : 'ul')

    return () => h(orderedElement.value, { ...attrs.value, class: listClass.value, ref: 'list' }, children.value)
  }
})
