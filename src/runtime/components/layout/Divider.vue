<template>
  <div :class="wrapperClass" v-bind="attrs">
    <div :class="borderClass" />

    <template v-if="label || icon || avatar || $slots.default">
      <div :class="containerClass">
        <slot>
          <span v-if="label" :class="ui.label">
            {{ label }}
          </span>
          <UIcon v-else-if="icon" :name="icon" :class="ui.icon.base" />
          <UAvatar v-else-if="avatar" v-bind="{ size: ui.avatar.size, ...avatar }" :class="ui.avatar.base" />
        </slot>
      </div>

      <div :class="borderClass" />
    </template>
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
import type { Avatar, DeepPartial, DividerSize, Strategy } from '../../types/index'
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
    size: {
      type: String as PropType<DividerSize>,
      default: () => config.default.size,
      validator(value: string) {
        return Object.keys(config.border.size.horizontal).includes(value) || Object.keys(config.border.size.vertical).includes(value)
      }
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal',
      validator: (value: string) => ['horizontal', 'vertical'].includes(value)
    },
    type: {
      type: String as PropType<'solid' | 'dotted' | 'dashed'>,
      default: () => config.default.type,
      validator: (value: string) => ['solid', 'dotted', 'dashed'].includes(value)
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<DeepPartial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  setup(props) {
    const { ui, attrs } = useUI('divider', toRef(props, 'ui'), config)

    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper.base,
        ui.value.wrapper[props.orientation]
      ), props.class)
    })

    const containerClass = computed(() => {
      return twJoin(
        ui.value.container.base,
        ui.value.container[props.orientation]
      )
    })

    const borderClass = computed(() => {
      return twJoin(
        ui.value.border.base,
        ui.value.border[props.orientation],
        ui.value.border.size[props.orientation][props.size],
        ui.value.border.type[props.type]
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
