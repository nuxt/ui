<template>
  <div :class="wrapperStyle">
    <div :class="borderStyle" />

    <div v-if="label || icon || alt || image || $slot" :class="ui.base">
      <slot>
        <UAvatar v-if="!label" :icon="icon" :src="image" :alt="alt" />
        <span v-else :class="ui.label">
          {{ label }}
        </span>
      </slot>
    </div>

    <div :class="borderStyle" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
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
    ui: {
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  setup (props) {
    const { ui, attrs } = useUI('divider', props.ui, config, { mergeWrapper: true })

    const isHorizontal = computed(() => props.orientation === 'horizontal' )

    const borderStyle = computed(() => [
      'border-{style}'.replaceAll('{style}', props.type),
      ui.value.border.base,
      isHorizontal.value ? ui.value.border.horizontal : ui.value.border.vertical,
      isHorizontal.value ? ui.value.border.size.horizontal : ui.value.border.size.vertical
    ])

    const wrapperStyle = computed(() => [
      ui.value.wrapper.base,
      isHorizontal.value ? ui.value.wrapper.horizontal : ui.value.wrapper.vertical
    ])

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      borderStyle,
      wrapperStyle

    }
  }
})
</script>
