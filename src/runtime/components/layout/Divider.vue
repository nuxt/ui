<template>
  <div :class="wrapperClass" v-bind="attrs">
    <div :class="borderClass" />

    <div v-if="label || icon || avatar || $slots.default" :class="containerClass">
      <slot>
        <span v-if="label" :class="ui.label">
          {{ label }}
        </span>
        <UIcon v-else-if="icon" :name="icon" :class="ui.icon.base" />
        <UAvatar v-else-if="avatar" v-bind="{ size: ui.avatar.size, ...avatar }" :class="ui.avatar.base" />
      </slot>
    </div>

    <div :class="borderClass" />
  </div>
</template>

<script lang="ts">
import { toRef, computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import UIcon from '../elements/Icon.vue'
import UAvatar from '../elements/Avatar.vue'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { Avatar, Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { divider } from '#ui/ui.config'

const config = mergeConfig<typeof divider>(appConfig.ui.strategy, appConfig.ui.divider, divider)

export default defineComponent({
  components: {
    UIcon,
    UAvatar
  },
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    avatar: {
      type: Object as PropType<Avatar>,
      default: null
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal',
      validator: (value: string) => ['horizontal', 'vertical'].includes(value)
    },
    type: {
      type: String as PropType<'solid' | 'dotted' | 'dashed'>,
      default: 'solid',
      validator: (value: string) => ['solid', 'dotted', 'dashed'].includes(value)
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
  setup (props) {
    const { ui, attrs } = useUI('divider', toRef(props, 'ui'), config)

    const isHorizontal = computed(() => props.orientation === 'horizontal' )

    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper.base,
        isHorizontal.value ? ui.value.wrapper.horizontal : ui.value.wrapper.vertical
      ), props.class)
    })

    const containerClass = computed(() => {
      return twJoin(
        ui.value.container.base,
        isHorizontal.value ? ui.value.container.horizontal : ui.value.container.vertical
      )
    })

    const borderClass = computed(() => {
      const typeClass = ({
        solid: 'border-solid',
        dotted: 'border-dotted',
        dashed: 'border-dashed'
      })[props.type]

      return twJoin(
        ui.value.border.base,
        isHorizontal.value ? ui.value.border.horizontal : ui.value.border.vertical,
        isHorizontal.value ? ui.value.border.size.horizontal : ui.value.border.size.vertical,
        typeClass
      )
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      wrapperClass,
      containerClass,
      borderClass
    }
  }
})
</script>
