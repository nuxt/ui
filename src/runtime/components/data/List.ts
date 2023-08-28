import { h, computed, toRef, defineComponent } from 'vue'
import type { PropType, SlotsType, ComputedRef } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import type {Strategy, ListOrientation, ListItem, ListSlots, ListSeparatorColor} from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { mergeConfig, getSlotsChildren, get } from '#ui/utils'
import { list } from '#ui/ui.config'
import UAvatar from '../elements/Avatar.vue'
import UButton from '../elements/Button.vue'
import UIcon from '../elements/Icon.vue'

const config = mergeConfig<typeof list>(appConfig.ui.strategy, appConfig.ui.list, list)

export default defineComponent({
  components: {
    UIcon,
    UAvatar
  },
  inheritAttrs: false,
  props: {
    items: {
      type: Array as PropType<Array<String> | Array<ListItem>>,
      default: () => [],
    },
    by: {
      type: String,
      default: undefined
    },
    ordered: {
      type: Boolean,
      default: false
    },
    orientation: {
      type: String as PropType<ListOrientation>,
      default: () => config.default.orientation,
      validator (value: string) {
        return Object.keys(config.stacking.orientation).includes(value)
      }
    },
    wrap: {
      type: Boolean,
      default: () => config.default.wrap
    },
    separator: {
      type: Boolean,
      default: true
    },
    separatorColor: {
      type: String as PropType<ListSeparatorColor>,
      default: () => config.default.separatorColor,
      validator (value: string) {
        return [...appConfig.ui.colors, ...Object.keys(config.color)].includes(value)
      }
    },
    separatorTrailing: {
      type: Boolean,
      default: false
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
  slots: Object as SlotsType<ListSlots>,
  setup (props, { slots }) {
    const { ui, attrs } = useUI('list', toRef(props, 'ui'), config)

    function objectToVNodes (item: ListItem) {
      // If the item is a button, pass everything to the button
      if ('to' in item || 'click' in item) {
        return h(UButton, { variant: 'link', ...item })
      }

      const isLeading = (item.icon && item.leading) || (item.icon && !item.trailing) || item.leadingIcon
      const isTrailing = (item.icon && item.trailing) || item.trailingIcon

      const elements = []

      if (isLeading) {
        elements.push(h(UIcon, { name: item.leadingIcon || item.icon }))
      }

      elements.push(h('div', item.label))

      if (isTrailing) {
        elements.push(h(UIcon, { name: item.trailingIcon || item.icon }))
      }

      return h('div', { class: contentClass.value }, elements)
    }

    function addSeparator (array) {
      return array.map((item, index) => {
        const itemProps = {
          class: itemClass.value,
          key: props.by ? get(item, props.by, index) : item
        }

        const children = []

        const isFirst = index === 0
        const isLast = index === (array.length - 1)

        if (hasSeparator.value && !isFirst && !separatorObject.value.trailing) {
          children.push(separatorElement.value({ index, isFirst, isLast }))
        }

        children.push(item)

        if (hasSeparator.value && !isLast && separatorObject.value.trailing) {
          children.push(separatorElement.value({ index, isFirst, isLast }))
        }

        return h('li', itemProps, children)
      })
    }

    const items = computed(() => {
      const items = getSlotsChildren(slots)

      if (items.length) {
        return items
      }

      return props.items.map(item => {
        const object = {
          label: '',
          icon: '',
          leading: true,
          trailing: false,
        }

        Object.assign(object, typeof item === 'object' ? item : { label: item })

        return objectToVNodes(object)
      })
    })

    const hasSeparator = computed(() => props.separator && items.value.length > 1)

    const orderedElement = computed(() => props.ordered ? 'ol' : 'ul')

    const separatorObject = computed(() => ({
      color: props.separatorColor,
      trailing: props.separatorTrailing
    }))

    const listClass = computed(() => {
      return twMerge(twJoin(
        ui.value.stacking.base,
        ui.value.stacking.orientation[props.orientation],
        props.wrap ? ui.value.stacking.wrap : ui.value.stacking.nowrap
      ), props.class)
    })

    const itemClass = computed(() => {
      return twJoin(
        ui.value.item.base,
        ui.value.stacking.base,
        ui.value.stacking.orientation[props.orientation],
        ui.value.stacking.nowrap
      )
    })

    const contentClass = computed(() => {
      return twJoin(
        ui.value.item.contents,
        ui.value.stacking.base,
        ui.value.stacking.orientation['horizontal'],
        ui.value.stacking.nowrap
      )
    })

    const separatorClass = computed(() => {
      return twJoin(
        ui.value.separator.base,
        ui.value.separator.color.replaceAll('{color}', props.separatorColor),
        ui.value.separator.orientation[props.orientation]
      )
    })

    const separatorElement: ComputedRef<Function> = computed(() => {
      return slots.separator || (() => h('div', { class: separatorClass.value }))
    })

    return () => h(orderedElement.value, { ...attrs.value, class: listClass.value }, addSeparator(items.value))
  }
})
