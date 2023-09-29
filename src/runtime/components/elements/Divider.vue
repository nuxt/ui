<template>
  <div :class="wrapperStyle">
    <div :class="borderStyle" />
    <div v-if="label || icon || image || alt || $slots.default" :class="baseStyle">
      <slot>
        <UAvatar
          v-if="!label"
          :icon="icon"
          :src="image"
          :alt="alt"
          :ui="{ rounded: ui.rounded, background: ui.background }"
        />
        <span v-else :class="ui?.label">
          {{ label }}
        </span>
      </slot>
    </div>

    <div :class="borderStyle" />
  </div>
</template>

<script lang="ts">
import { toRef, computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import UAvatar from '../elements/Avatar.vue'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { divider } from '#ui/ui.config'

const config = mergeConfig<typeof divider>(appConfig.ui.strategy, appConfig.ui.divider, divider)

export default defineComponent({
  components: {
    UAvatar
  },
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
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

    const wrapperStyle = computed(() => [
      ui.value.wrapper.base,
      isHorizontal.value ? ui.value.wrapper.horizontal : ui.value.wrapper.vertical,
      props?.class
    ])

    const baseStyle = computed(() => [
      ui.value.base.main,
      isHorizontal.value ? ui.value.base.horizontal : ui.value.base.vertical
    ])

    const borderStyle = computed(() => [
      'border-{style}'.replaceAll('{style}', props.type),
      ui.value.border.base,
      isHorizontal.value ? ui.value.border.horizontal : ui.value.border.vertical,
      isHorizontal.value ? ui.value.border.size.horizontal : ui.value.border.size.vertical
    ])

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      wrapperStyle,
      borderStyle,
      baseStyle
    }
  }
})
</script>
